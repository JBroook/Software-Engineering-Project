from rest_framework import permissions
from users.models import Employee

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        employee = Employee.objects.get(user=user)
        return employee.role=="admin"

# for accessing tags, files and folders
class AssetPermission(permissions.BasePermission):
    def has_permission(self, request, view):            
        if not request.user.is_authenticated:
            return False

        employee = request.user.employee
        if employee.role=='admin' or employee.role=='editor':
            return True
        
        if employee.role=='viewer' and request.method in permissions.SAFE_METHODS:
            return True
        
        return False

class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        employee = request.user.employee
        if employee.role=='admin':
            return True
        
        return False