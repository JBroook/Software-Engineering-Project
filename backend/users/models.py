from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Employee(models.Model):
    role_choices = [
        ('Viewer', 'viewer'),
        ('Editor', 'editor'),
        ('Admin', 'admin')
    ]
    role = models.CharField(choices=role_choices)
    last_active = models.DateTimeField(auto_now_add=True)
    join_date = models.DateTimeField(auto_now_add=True, editable=False)
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username