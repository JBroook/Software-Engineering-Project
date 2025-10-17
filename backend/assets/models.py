from django.db import models

# Create your models here.
class Folder(models.Model):
    name = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    folder = models.ForeignKey('self', on_delete=models.CASCADE)

    def __str__(self):
        return self.foldername

class File(models.Model):
    name = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    size = models.IntegerField()
    filetype = models.CharField(max_length=5)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)

    def __str__(self):
        return self.filename

class TagType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Tag(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    type = models.ForeignKey(TagType, on_delete=models.CASCADE)

    def __str__(self):
        return self.type.name