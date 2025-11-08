from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from assets.models import File, FileVersion, Folder, TagType, Tag
from users.models import Employee
from django.contrib.auth.models import User
from django.db import transaction

class TagTypeSerializer(serializers.ModelSerializer):
    tag_count = serializers.SerializerMethodField()
    class Meta:
        model = TagType
        fields = ['id', 'name', 'tag_count', 'description']

    def get_tag_count(self, obj):
        return len(Tag.objects.filter(type=obj))


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','username','password']
        extra_kwargs = {
            'password' : {'write_only' : True}
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)

        instance.save()
        return instance

class EmployeeSerializer(serializers.ModelSerializer):
    user = serializers.DictField(write_only=True)
    email = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id',
            'role',
            'first_name', 
            'last_name',
            'email', 
            'username', 
            'last_active', 
            'join_date', 
            'user'
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer(data=user_data)
        user.is_valid(raise_exception=True)
        user = user.save()
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()
        
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance

    def get_user(self):
        return self.request.user

    def get_email(self, obj):
        return obj.user.email
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name
    
class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'parent_folder']
        
    def create(self, validated_data):
        file = File.objects.create(**validated_data)
        return file
    
class FileVersionSerializer(serializers.ModelSerializer):
    file = FileSerializer(source='original_file', read_only=True)
    employee = EmployeeSerializer(source='created_by', read_only=True)
    date_created = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    data = serializers.FileField(required=False)
    file_id = serializers.IntegerField(write_only=True, required=False, default=0)

    class Meta:
        model = FileVersion
        fields = [
            'id', 
            'original_file', 
            'file_id',
            'name', 
            'description',
            'size', 
            'filetype', 
            'media_type',
            'data', 
            'version', 
            'date_created', 
            'created_by', 
            'file',
            'employee',
        ]
        read_only_fields = ['size', 'date_created', 'created_by', 'file', 'employee','filetype','media_type']

    # @transaction.atomic
    def create(self, validated_data):
        print(validated_data)
        user = self.context['request'].user
        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated")
        try:
            employee = user.employee
        except AttributeError:
            raise serializers.ValidationError(
                "Authenticated user has no Employee profile."
            )
        
        # Get parent_folder from request.POST        
        parent_folder = self.context['request'].query_params.get('parent_folder')
        file_id = validated_data.get('file_id')
        if parent_folder in ('', 'null', 'undefined', '-1'):
            folder = None
        elif parent_folder == '-2':
            folder = int(parent_folder)
        else:
            try:
                parent_folder = int(parent_folder)
                folder = Folder.objects.get(id=parent_folder) if parent_folder != '-1' else None
            except (TypeError, ValueError):
                raise serializers.ValidationError({"parent_folder": "Invalid folder ID."})
        # Create File Instance
        if file_id != -1:
            file_instance = File.objects.get(id=file_id)
            if parent_folder == -2:
                file_instance.parent_folder = None
                file_instance.save()
            elif parent_folder != file_instance.parent_folder and parent_folder != "":
                get_parent_folder = Folder.objects.get(id=parent_folder)
                file_instance.parent_folder = get_parent_folder
                file_instance.save()
            elif parent_folder == "":
                folder = file_instance.parent_folder
        else:
            file_instance = File.objects.create(
                parent_folder=folder
            )

        # Auto-calculate metadata
        if 'data' not in validated_data:
            fetched_old_file_data = FileVersion.objects.filter(original_file__id=file_id).order_by('original_file', '-version').distinct('original_file')
            if not fetched_old_file_data:
                raise serializers.ValidationError("No previous version to copy.")
            print("Getting old data: \n",fetched_old_file_data)
            data = fetched_old_file_data[0].data
            size = fetched_old_file_data[0].size
            filetype = fetched_old_file_data[0].filetype
            media_type = fetched_old_file_data[0].media_type
        else:
            uploaded_file = validated_data.pop('data')
            data = uploaded_file
            size = uploaded_file.size
            filetype = uploaded_file.content_type.split('/')[1]
            media_type = uploaded_file.content_type.split('/')[0]

        # Create FileVersion Instance
        file_vers = FileVersion.objects.create(
            original_file=file_instance,
            name=validated_data.get('name'),
            description=validated_data.get('description'),
            filetype=filetype,
            media_type=media_type,
            data=data,
            version=validated_data.get('version'),
            size=size,
            created_by=employee
        )
        return file_vers

class FolderSerializer(serializers.ModelSerializer):
    date_created = serializers.DateTimeField(format="%Y-%m-%d %H:%M", required=False)
    date_modified = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    parent_folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent_folder', 'date_created', 'date_modified']

    def create(self,validated_data):
        
        if validated_data.get('parent_folder'):
            fetched_parent_folder = validated_data.get('parent_folder')
        else:
            fetched_parent_folder = None

        folder = Folder.objects.create(
            name = validated_data.get('name'),
            parent_folder = fetched_parent_folder
        )
        return folder
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        if validated_data.get('parent_folder'):
            instance.parent_folder = validated_data.get('parent_folder', instance.parent_folder)
        else:
            instance.parent_folder = None
        instance.save()
        return instance