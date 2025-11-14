from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from .models import Folder, File, FileVersion, TagType, Tag, Employee
from django.test import override_settings
from tempfile import mkdtemp

temp_dir = mkdtemp(prefix='django_test_media')

@override_settings(MEDIA_ROOT=temp_dir)
class FolderModelTest(TestCase):
    def setUp(self):
        self.root_folder = Folder.objects.create(name="Root Folder")
        self.sub_folder = Folder.objects.create(name="Sub Folder", parent_folder=self.root_folder)

    def test_folder_creation(self):
        self.assertEqual(self.root_folder.name, "Root Folder")
        self.assertIsNone(self.root_folder.parent_folder)
        self.assertEqual(self.sub_folder.parent_folder, self.root_folder)

    def test_str_method(self):
        self.assertEqual(str(self.root_folder), "Root Folder")

    def test_auto_timestamps(self):
        self.assertIsNotNone(self.root_folder.date_created)
        self.assertIsNotNone(self.root_folder.date_modified)

@override_settings(MEDIA_ROOT=temp_dir)
class FileModelTest(TestCase):
    def setUp(self):
        # create a Django user
        self.user = User.objects.create_user(
            username='johndoe',
            password='testpassword123',
            email='johndoe@example.com'
        )
        # create an Employee linked to that user
        self.employee = Employee.objects.create(
            user=self.user,
            role='editor',
        )
    
        self.folder = Folder.objects.create(name="Test Folder") # Create Folder Object
        test_file = SimpleUploadedFile("example.txt", b"Dummy content")
        self.file = File.objects.create(parent_folder=self.folder) # Create File Object
        self.fileVersion = FileVersion.objects.create( # Create FileVersion Object
            original_file=self.file,
            name="example.txt",
            description="this is a sample description",
            size=test_file.size,
            filetype="txt",
            media_type="text",
            data=test_file,
            version=1,
            created_by= self.employee
        )

    def test_file_creation(self):
        self.assertEqual(self.file.parent_folder , self.folder)

    def test_file_detail(self):
        self.assertEqual(self.fileVersion.original_file, self.file)
        self.assertEqual(self.fileVersion.name, "example.txt")
        self.assertEqual(self.fileVersion.description, "this is a sample description")
        self.assertEqual(self.fileVersion.filetype, "txt")
        self.assertEqual(self.fileVersion.media_type, "text")
        self.assertEqual(self.fileVersion.created_by, self.employee)

    def test_str_method(self):
        self.assertEqual(str(self.fileVersion),"example.txt")
        
    def test_file_upload_path(self):
        self.assertIn("uploads/", self.fileVersion.data.name)

    def test_auto_timestamps(self):
        self.assertIsNotNone(self.fileVersion.date_created)

@override_settings(MEDIA_ROOT=temp_dir)
class TagTypeModelTest(TestCase):
    def setUp(self):
        self.tag_type = TagType.objects.create(
            name="Important",
            description="Marks important files"
        )

    def test_tag_type_creation(self):
        self.assertEqual(self.tag_type.name, "Important")
        self.assertEqual(self.tag_type.description, "Marks important files")

    def test_str_method(self):
        self.assertEqual(str(self.tag_type), "Important")


@override_settings(MEDIA_ROOT=temp_dir)
class TagModelTest(TestCase):
    def setUp(self):
       # create a Django user
        self.user = User.objects.create_user(
            username='johndoe',
            password='testpassword123',
            email='johndoe@example.com'
        )
        # create an Employee linked to that user
        self.employee = Employee.objects.create(
            user=self.user,
            role='editor',
        )
    
        self.folder = Folder.objects.create(name="Test Folder") # Create Folder Object
        test_file = SimpleUploadedFile("example.txt", b"Dummy content")
        self.file = File.objects.create(parent_folder=self.folder) # Create File Object
        self.fileVersion = FileVersion.objects.create( # Create FileVersion Object
            original_file=self.file,
            name="example.txt",
            description="this is a sample description",
            size=test_file.size,
            filetype="txt",
            media_type="text",
            data=test_file,
            version=1,
            created_by= self.employee
        )

        self.tag_type = TagType.objects.create(name="Category", description="File category")
        self.tag = Tag.objects.create(file_version=self.fileVersion, type=self.tag_type)

    def test_tag_creation(self):
        self.assertEqual(self.tag.file_version, self.fileVersion)
        self.assertEqual(self.tag.type, self.tag_type)
        self.assertEqual(str(self.tag), "Category")

    def test_related_name_access(self):
        self.assertIn(self.tag, self.fileVersion.tag.all())
        self.assertIn(self.tag, self.tag_type.tag.all())