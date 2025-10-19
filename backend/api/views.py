from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ReadOnlyModelViewSet
from assets.models import Folder, File
from . import serializers
from django.db.models import Q

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
    
class FolderViewSet(ReadOnlyModelViewSet):
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

        # Apply other filters 
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset

class FileViewSet(ReadOnlyModelViewSet):
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

        # Apply other filters 
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset