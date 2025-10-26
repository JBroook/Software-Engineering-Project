from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from assets.models import File, Folder, Tag, TagType
from users.models import Employee
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from tempfile import mkdtemp

temp_dir = mkdtemp(prefix='django_test_media_')

@override_settings(MEDIA_ROOT=temp_dir)
class AssetAPITestCase(APITestCase):
    def setUp(self):
        self.folder1 = Folder.objects.create(
            name='Folder 1'
        )

        self.folder2 = Folder.objects.create(
            name='Folder 2'
        )

        test_file1 = SimpleUploadedFile("example.txt", b"Dummy content")
        self.file1 = File.objects.create(
            name='File 1',
            size=len(b"Dummy content"),
            filetype='txt',
            media_type='document',
            parent_folder=self.folder1,
            data = test_file1
        )

        test_file2 = SimpleUploadedFile("example2.txt", b"Dummy content 2")
        self.file2 = File.objects.create(
            name='File 2',
            size=len(b"Dummy content 2"),
            filetype='txt',
            media_type='document',
            parent_folder=self.folder1,
            data = test_file2
        )

        self.user = User.objects.create_superuser(username='admin',password='Lettuce123')
        self.employee = Employee.objects.create(user=self.user, role='admin')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_file(self):
        test_file = SimpleUploadedFile("example.txt", b"Dummy content")

        url = reverse('file-list')
        response = self.client.post(
            url,
            {
                'name' : 'New file',
                'size' : len(b"Dummy content"),
                'filetype' : 'txt',
                'media_type' : 'document',
                'data' : test_file
            },
            format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)