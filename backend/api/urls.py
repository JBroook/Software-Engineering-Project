from django.urls import path
from .views import LoginView, FolderViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'folders', FolderViewSet, basename='folder')

appname = 'api'
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
]+router.urls