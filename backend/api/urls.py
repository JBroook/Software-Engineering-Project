from django.urls import path
from .views import LoginView

appname = 'api'
urlpatterns = [
    path('login/', LoginView.as_view(), name='login')
]