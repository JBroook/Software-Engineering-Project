from django.contrib import admin
from .models import Folder, File, TagType, Tag


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent_folder', 'date_created', 'date_modified')
    list_filter = ('date_created', 'date_modified')
    search_fields = ('name',)
    ordering = ('-date_modified',)


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'filetype', 'size', 'parent_folder', 'date_created', 'date_modified', 'data')
    list_filter = ('filetype', 'date_created')
    search_fields = ('name',)
    ordering = ('-date_modified',)


@admin.register(TagType)
class TagTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'type')
    list_filter = ('type',)
    search_fields = ('file__name', 'type__name')
