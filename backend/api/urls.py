from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'folders', views.FolderViewSet, basename='folder')
router.register(r'files', views.FileViewSet, basename='file')
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'tagtypes', views.TagTypeViewSet, basename='tagtype')
router.register(r'tags', views.TagViewSet, basename='tag')

appname = 'api'
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('storage/', views.StorageView.as_view(), name='storage'),
    path('download/', views.DownloadFileView.as_view(), name='download'),
]+router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)