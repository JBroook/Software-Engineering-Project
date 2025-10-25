from django.test import TestCase
from django.contrib.auth.models import User
from .models import Employee
from django.core.exceptions import ValidationError

class EmployeeModelTest(TestCase):
    def setUp(self):
        # create a Django user
        self.user = User.objects.create_user(
            username='johndoe',
            password='testpassword123',
            email='johndoe@example.com'
        )
        # create an Employee linked to that user
        self.employee = Employee.objects.create(
            user=self.user,
            role='editor'
        )

    def test_employee_creation(self):
        """test Employee creation and field values"""
        self.assertEqual(self.employee.user.username, 'johndoe')
        self.assertEqual(self.employee.role, 'editor')
        self.assertIsNotNone(self.employee.last_active)
        self.assertIsNotNone(self.employee.join_date)

    def test_employee_str_method(self):
        """test __str__ method returns username"""
        self.assertEqual(str(self.employee), 'johndoe')

    def test_employee_user_relationship(self):
        """test one-to-one relationship between Employee and User"""
        self.assertEqual(self.user.employee, self.employee)

    def test_role_choices(self):
        """test valid role choices"""
        valid_roles = ['viewer', 'editor', 'admin']
        for role in valid_roles:
            emp = Employee.objects.create(user=User.objects.create_user(f'user_{role}'), role=role)
            self.assertIn(emp.role, valid_roles)

    def test_invalid_role_raises_error(self):
        """test assigning an invalid role raises a ValueError"""
        invalid_user = User.objects.create_user(username='invaliduser')
        with self.assertRaises(ValidationError):
            Employee.objects.create(user=invalid_user, role='invalid_role')

    def test_auto_timestamps(self):
        """ensure join_date and last_active are automatically set"""
        self.assertIsNotNone(self.employee.join_date)
        self.assertIsNotNone(self.employee.last_active)
        self.assertLessEqual(self.employee.join_date, self.employee.last_active)
