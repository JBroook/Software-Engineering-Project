from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Folder, File, TagType, Tag
from django.test import override_settings
from tempfile import mkdtemp

temp_dir = mkdtemp(prefix='django_test_media_')

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
        self.folder = Folder.objects.create(name="Test Folder")
        test_file = SimpleUploadedFile("example.txt", b"Dummy content")
        self.file = File.objects.create(
            name="example.txt",
            filetype="txt",
            media_type="text",
            parent_folder=self.folder,
            data=test_file,
            size=len(b"Dummy content")
        )

    def test_file_creation(self):
        self.assertEqual(self.file.name, "example.txt")
        self.assertEqual(self.file.parent_folder, self.folder)
        self.assertEqual(self.file.filetype, "txt")
        self.assertEqual(self.file.media_type, "text")

    def test_str_method(self):
        self.assertEqual(str(self.file), "example.txt")

    def test_file_upload_path(self):
        self.assertIn("uploads/", self.file.data.name)

    def test_auto_timestamps(self):
        self.assertIsNotNone(self.file.date_created)
        self.assertIsNotNone(self.file.date_modified)


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
        self.folder = Folder.objects.create(name="Folder")
        test_file = SimpleUploadedFile("file.txt", b"Tag content")
        self.file = File.objects.create(
            name="file.txt",
            filetype="txt",
            media_type="text",
            parent_folder=self.folder,
            data=test_file
        )
        self.tag_type = TagType.objects.create(name="Category", description="File category")
        self.tag = Tag.objects.create(file=self.file, type=self.tag_type)

    def test_tag_creation(self):
        self.assertEqual(self.tag.file, self.file)
        self.assertEqual(self.tag.type, self.tag_type)
        self.assertEqual(str(self.tag), "Category")

    def test_related_name_access(self):
        self.assertIn(self.tag, self.file.tag.all())
        self.assertIn(self.tag, self.tag_type.tag.all())
