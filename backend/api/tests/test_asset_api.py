from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from assets.models import File, Folder, TagType, Tag
from django.test import override_settings
from tempfile import mkdtemp
from users.models import Employee
from django.contrib.auth.models import User

temp_dir = mkdtemp(prefix='django_test_media_')

@override_settings(MEDIA_ROOT=temp_dir)
class FolderAPITests(APITestCase):
    def setUp(self):
        self.root_folder = Folder.objects.create(name="Root Folder")
        self.sub_folder = Folder.objects.create(name="Sub Folder", parent_folder=self.root_folder)
        self.folder_list_url = reverse('folder-list')
        self.folder_detail_url = reverse('folder-detail', args=[self.root_folder.id])

        self.client = APIClient()
        self.user = User.objects.create_user(
            username='admin', 
            email='admin@gmail.com',
            password='lettuce123'
            )
        self.employee = Employee.objects.create(user=self.user, role='admin')
        self.client.force_authenticate(user=self.user)

    def test_list_folders(self):
        response = self.client.get(self.folder_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertIn('name', response.data[0])

    def test_retrieve_folder(self):
        response = self.client.get(self.folder_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.root_folder.name)

    def test_create_folder(self):
        data = {"name": "New Folder", "parent_folder": self.root_folder.id}
        response = self.client.post(self.folder_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Folder.objects.count(), 3)
        self.assertEqual(Folder.objects.last().name, "New Folder")
    
    def test_create_folder_as_viewer(self):
        data = {"name": "New Folder", "parent_folder": self.root_folder.id}
        viewer_client = APIClient()
        viewer_user = User.objects.create_user(
            username='viewer', 
            email='viewer@gmail.com',
            password='lettuce123'
            )
        Employee.objects.create(user=viewer_user, role='viewer')
        viewer_client.force_authenticate(user=viewer_user)
        
        response = viewer_client.post(self.folder_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

@override_settings(MEDIA_ROOT=temp_dir)
class FileAPITests(APITestCase):
    def setUp(self):
        self.folder = Folder.objects.create(name="My Folder")
        self.file_list_url = reverse('file-list')
        self.test_file = SimpleUploadedFile("test.txt", b"Hello world!", content_type="text/plain")
        self.file_instance = File.objects.create(
            name="Existing File",
            size=11,
            filetype="txt",
            media_type="text",
            parent_folder=self.folder,
            data=self.test_file
        )
        self.file_detail_url = reverse('file-detail', args=[self.file_instance.id])
        
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='admin', 
            email='admin@gmail.com',
            password='lettuce123'
            )
        self.employee = Employee.objects.create(user=self.user, role='admin')
        self.client.force_authenticate(user=self.user)

    def test_list_files(self):
        response = self.client.get(self.file_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Existing File")

    def test_upload_file(self):
        new_file = SimpleUploadedFile("new.txt", b"Another file", content_type="text/plain")
        data = {
            "name": "New File",
            "filetype": "txt",
            "media_type": "text",
            "data": new_file,
            "parent_folder": self.folder.id
        }
        response = self.client.post(self.file_list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(File.objects.count(), 2)
        self.assertEqual(File.objects.last().name, "New File")

    def test_retrieve_file(self):
        response = self.client.get(self.file_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Existing File")

    def test_delete_file(self):
        url = reverse('file-detail',args=[self.file_instance.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(File.objects.filter(id=self.file_instance.id).exists())

    def test_create_file_as_viewer(self):
        new_file = SimpleUploadedFile("new.txt", b"Another file", content_type="text/plain")
        data = {
            "name": "New File",
            "filetype": "txt",
            "media_type": "text",
            "data": new_file,
            "parent_folder": self.folder.id
        }
        viewer_client = APIClient()
        viewer_user = User.objects.create_user(
            username='viewer', 
            email='viewer@gmail.com',
            password='lettuce123'
            )
        Employee.objects.create(user=viewer_user, role='viewer')
        viewer_client.force_authenticate(user=viewer_user)
        
        response = viewer_client.post(self.file_list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

@override_settings(MEDIA_ROOT=temp_dir)
class TagTypeAPITests(APITestCase):
    def setUp(self):
        self.tag_type = TagType.objects.create(name="Important", description="Important files")
        self.another_type = TagType.objects.create(name="Personal", description="Private stuff")
        self.file = File.objects.create(
            name="Tagged File",
            size=10,
            filetype="txt",
            media_type="text",
            data=SimpleUploadedFile("tagged.txt", b"tagged"),
        )
        Tag.objects.create(file=self.file, type=self.tag_type)
        self.tagtype_list_url = reverse('tagtype-list')
        self.tagtype_detail_url = reverse('tagtype-detail', args=[self.tag_type.id])

        self.client = APIClient()
        self.user = User.objects.create_user(
            username='admin', 
            email='admin@gmail.com',
            password='lettuce123'
            )
        self.employee = Employee.objects.create(user=self.user, role='admin')
        self.client.force_authenticate(user=self.user)

    def test_list_tagtypes(self):
        response = self.client.get(self.tagtype_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        tagtype_data = next(item for item in response.data if item['id'] == self.tag_type.id)
        self.assertEqual(tagtype_data['tag_count'], 1)

    def test_retrieve_tagtype(self):
        response = self.client.get(self.tagtype_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Important")
        self.assertEqual(response.data['tag_count'], 1)
