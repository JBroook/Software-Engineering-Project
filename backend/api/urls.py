from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'folders', views.FolderViewSet, basename='folder')
router.register(r'files', views.FileViewSet, basename='file')

appname = 'api'
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
]+router.urls