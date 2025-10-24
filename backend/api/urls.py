from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'folders', views.FolderViewSet, basename='folder')
router.register(r'files', views.FileViewSet, basename='file')
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'tagtypes', views.TagTypeViewSet, basename='tagtype')

appname = 'api'
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('storage/', views.StorageView.as_view(), name='storage'),
]+router.urls