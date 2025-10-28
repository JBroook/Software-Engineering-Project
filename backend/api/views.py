from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsEditor

from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from assets.models import Folder, File, FileVersion, TagType, Tag
from users.models import Employee
from . import serializers
from django.db.models import Q, Sum, Count, OuterRef, Subquery

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        employee = Employee.objects.get(user=user)
        return Response({
            "email": user.email,
            "username": user.username,
            "id": user.id,
            "role": employee.role
        }, status=status.HTTP_200_OK)

class StorageView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    # returns info on storage size and file number
    def get(self, request):
        storage_size = FileVersion.objects.distinct('original_file').aggregate(total_size=Sum('size'))['total_size']
        file_number = len(File.objects.all())
        tag_count = len(Tag.objects.all())
        tag_types = len(TagType.objects.all())
        return Response({
            'storageSize':storage_size, 
            'fileNumber': file_number,
            'tagCount' : tag_count,
            'tagTypes' : tag_types
        }, status=status.HTTP_200_OK)

class LoginView(APIView):
    #user logging in
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        username = get_object_or_404(User, email=email).username

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Logged in successfully"},status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credentials error"},status=status.HTTP_401_UNAUTHORIZED)
        
    #return csrf token
    def get(self, request):
        csrf_token = get_token(request)
        return Response({'csrfToken':csrf_token})
    
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        print("Logged out")
        return Response({"message" : "Logged out successfully"}, status=status.HTTP_200_OK)

class TagTypeViewSet(ModelViewSet):
    serializer_class = serializers.TagTypeSerializer

    def get_queryset(self):
        queryset = TagType.objects.all()

        # search
        search_keyword = self.request.query_params.get('search')
        if search_keyword:
            queryset = queryset.filter(name__icontains=search_keyword)

        # sort
        sort_criteria = self.request.query_params.get('sort_criteria')
        sort_order = self.request.query_params.get('sort_order')
        if sort_criteria:
            sort_order = "-" if sort_order=="desc" else ""
            if sort_criteria!="tag_count":
                queryset = queryset.order_by(sort_order+sort_criteria)
            else:
                queryset = queryset.annotate(
                    tag_count=Count('tag')
                ).order_by(sort_order+sort_criteria)

        return queryset
    
class EmployeeViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = serializers.EmployeeSerializer

    def get_queryset(self):
        queryset = Employee.objects.all()

        # search
        search_keyword = self.request.query_params.get('search')
        if search_keyword:
            queryset = queryset.filter(Q(user__first_name__icontains=search_keyword) | Q(user__last_name__icontains=search_keyword))

        # sort
        sort_criteria = self.request.query_params.get('sort_criteria')
        sort_order = self.request.query_params.get('sort_order')
        if sort_criteria:
            sort_order = "-" if sort_order=="desc" else ""
            if sort_criteria!='name':
                user_fields = ['email','username']
                # extra handling for fields from user model
                if sort_criteria in user_fields:
                    sort_criteria = "user__" + sort_criteria

                queryset = queryset.order_by(sort_order+sort_criteria)
            else:
                # name field has to be handled differently as it is two fields combined (first and last name)
                queryset = queryset.order_by(sort_order+'user__first_name', sort_order+'user__last_name')

        # filter
        roles = self.request.query_params.get('roles')
        if roles:
            roles = roles.split('_')
            queryset = queryset.filter(role__in=roles)

        return queryset
    
    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()
        return Response({"message" : "Delete successful"}, status=status.HTTP_200_OK)
    
class FolderViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.FolderSerializer

    def get_queryset(self):
        queryset = Folder.objects.all()
        parent_id = self.request.query_params.get('parent_folder')

        if parent_id is not None:
            if parent_id != "-1":
                queryset = queryset.filter(parent_folder=parent_id)
            else:
                queryset = queryset.filter(parent_folder__isnull=True)
        else:
            queryset = queryset.all() 

        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)

        sort_method = self.request.query_params.get('sort_method')
        if sort_method:
            sort_method, sort_order = sort_method.split('__')
            sort_order = "-" if sort_order=="asc" else ""
            queryset = queryset.order_by(sort_order+sort_method)

        return queryset

class FileViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = serializers.FileVersionSerializer
    

    def get_queryset(self):
        queryset = FileVersion.objects.all()
        
        parent_id = self.request.query_params.get('parent_folder')

        if parent_id:
            if parent_id != "-1":
                queryset = queryset.filter(original_file_id__parent_folder=parent_id)
            else:
                queryset = queryset.filter(original_file_id__parent_folder__isnull=True)

        # search
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)
    
        # filter
        media_type = self.request.query_params.get('media_type')
        if media_type:
            media_type = media_type.split('_')
            queryset = queryset.filter(media_type__in=media_type)

        file_type = self.request.query_params.get('file_type')
        if file_type:
            file_type = file_type.split('_')
            queryset = queryset.filter(filetype__in=file_type)

        tag_type = self.request.query_params.get('tag_type')
        if tag_type:
            tag_type = tag_type.split('_')
            queryset = queryset.filter(tag__type__name__in=tag_type)

        # sort
        sort_method = self.request.query_params.get('sort_method')
        if sort_method:
            sort_method, sort_order = sort_method.split('__')
            sort_order = "-" if sort_order=="asc" else ""
            queryset = FileVersion.objects.filter(id__in=queryset).order_by(sort_order+sort_method)
            
        # Focused File
        activated_file = self.request.query_params.get('file')
        if activated_file:
            queryset = FileVersion.objects.filter(original_file=activated_file).order_by('-version')

        queryset = queryset.order_by('original_file', '-version').distinct('original_file')
        return queryset
    
    def perform_destroy(self, instance):
        file = instance.file
        instance.delete()
        file.delete()
        return Response({"message" : "Delete successful"}, status=status.HTTP_200_OK)
    
    def get(self, request):
        csrf_token = get_token(request)
        return Response({'csrfToken':csrf_token})