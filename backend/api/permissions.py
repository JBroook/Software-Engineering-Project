from rest_framework import permissions
from users.models import Employee

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        employee = Employee.objects.get(user=user)
        return employee.role=="admin"
    
class IsEditor(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        employee = Employee.objects.get(user=user)
        return employee.role=="editor"