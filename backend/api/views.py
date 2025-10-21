from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from assets.models import Folder, File
from users.models import Employee
from . import serializers
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "username": user.username,
            "id": user.id
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
    
class EmployeeViewSet(ModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = serializers.EmployeeSerializer
    queryset = Employee.objects.all()
    
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
            queryset = queryset.none() 

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
    serializer_class = serializers.FileSerializer

    def get_queryset(self):
        queryset = File.objects.all()
        parent_id = self.request.query_params.get('parent_folder')

        if parent_id:
            if parent_id != "-1":
                queryset = queryset.filter(parent_folder=parent_id)
            else:
                queryset = queryset.filter(parent_folder__isnull=True)
        else:
            queryset = queryset.none() 

        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)
    
        media_type = self.request.query_params.get('media_type')
        if media_type:
            media_type = media_type.split('_')
            queryset = queryset.filter(media_type__in=media_type)

        file_type = self.request.query_params.get('file_type')
        if file_type:
            file_type = file_type.split('_')
            queryset = queryset.filter(filetype__in=file_type)

        sort_method = self.request.query_params.get('sort_method')
        if sort_method:
            sort_method, sort_order = sort_method.split('__')
            sort_order = "-" if sort_order=="asc" else ""
            queryset = queryset.order_by(sort_order+sort_method)


        return queryset