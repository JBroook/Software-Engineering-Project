from django.db import models
from users.models import Employee

# Create your models here.
class Folder(models.Model):
    name = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    parent_folder = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

class File(models.Model):
    parent_folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True)

class FileVersion(models.Model):
    original_file = models.ForeignKey(File, on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True)
    size = models.PositiveBigIntegerField(editable=False, default=0)
    filetype = models.CharField(max_length=30)
    media_type = models.CharField(max_length=30)
    data = models.FileField(upload_to='uploads')
    version = models.PositiveSmallIntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Employee, on_delete=models.PROTECT)

class TagType(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)

    def __str__(self):
        return self.name

class Tag(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='tag')
    type = models.ForeignKey(TagType, on_delete=models.CASCADE, related_name='tag')

    def __str__(self):
        return self.type.name