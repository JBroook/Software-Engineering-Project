from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from assets.models import File, Folder
from users.models import Employee
from django.contrib.auth.models import User

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'size', 'filetype', 'data', 'date_created', 'date_modified', 'parent_folder']

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent_folder', 'date_created', 'date_modified']

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
        print("update triggered")
        user_data = validated_data.pop('user')
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()
        
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name