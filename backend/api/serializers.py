from rest_framework import serializers
from assets.models import File, Folder
from users.models import Employee

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'size', 'filetype', 'data', 'date_created', 'date_modified', 'parent_folder']

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent_folder', 'date_created', 'date_modified']

class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id','role','full_name', 'email', 'username']

    def get_full_name(self, obj):
        return obj.user.first_name+" "+obj.user.last_name
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_username(self, obj):
        return obj.user.username