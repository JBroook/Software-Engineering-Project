from rest_framework import serializers
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
    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','username','password']
        extra_kwargs = {
            'password' : {'write_only' : True}
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class EmployeeSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    user = UserSerializer()
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
        print(validated_data)
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name