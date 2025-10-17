from rest_framework import serializers
from assets.models import File, Folder

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'size', 'filetype', 'data', 'date_created', 'date_modified', 'parent_folder']

class FolderSerializer(serializers.ModelSerializer):
    subfolders = serializers.SerializerMethodField()
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent_folder', 'date_created', 'date_modified', 'subfolders', 'files']

    def get_subfolders(self, obj):
        subfolders = Folder.objects.filter(parent_folder=obj)
        return FolderSerializer(subfolders, many=True).data
