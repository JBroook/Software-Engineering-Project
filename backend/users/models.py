from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Employee(models.Model):
    role_choices = [
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
        ('admin', 'Admin')
    ]
    role = models.CharField(choices=role_choices)
    last_active = models.DateTimeField(auto_now_add=True)
    join_date = models.DateTimeField(auto_now_add=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')

    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)