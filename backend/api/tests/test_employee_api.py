from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from users.models import Employee
from django.urls import reverse

class EmployeeAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin', 
            email='admin@gmail.com',
            password='lettuce123'
            )
        self.employee = Employee.objects.create(user=self.user, role='admin')

        self.user2 = User.objects.create_user(
            username='dummysecond', 
            email='dummysecond@gmail.com',
            password='lettuce123')
        self.employee2 = Employee.objects.create(user=self.user2, role='editor')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list_employee(self):
        url = reverse('employee-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_specific_employee(self):
        url = reverse('employee-detail', kwargs={'pk': self.employee.id}) 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_employee(self):
        url = reverse('employee-detail', kwargs={'pk': self.employee.id}) 
        response = self.client.patch(
            url,
            data={
                'user' : {
                    'username' : 'admin2',
                    'email' : 'fakeemail@gmail.com',
                    'first_name' : 'Jake',
                    'last_name' : 'Paul'
                },
                'role' : 'editor'
            },
            format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # refresh to latest data before testing
        self.employee = Employee.objects.get(pk=self.employee.id)

        self.assertEqual(self.employee.role, 'editor')
        self.assertEqual(self.employee.user.username, 'admin2')
        self.assertEqual(self.employee.user.email, 'fakeemail@gmail.com')
        self.assertEqual(self.employee.user.first_name, 'Jake')
        self.assertEqual(self.employee.user.last_name, 'Paul')

    def test_delete_employee(self):
        employee_pk = self.employee.id
        user_pk = self.employee.user.id
        url = reverse('employee-detail', kwargs={'pk': self.employee.id}) 
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Employee.DoesNotExist):
            Employee.objects.get(pk=employee_pk)

        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=user_pk)

    def test_create_employee(self):
        url = reverse('employee-list')
        response = self.client.post(
            url,
            {
                "user" : {
                    "username" : "johnsmith",
                    "email" : "johnsmith@gmail.com",
                    "first_name" : "John",
                    "last_name" : "Smith",
                    "password" : "Lettuce123"
                },
                "role" : "viewer"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_employee = Employee.objects.get(user__username="johnsmith")
        new_user = User.objects.get(username="johnsmith")

        self.assertEqual(new_employee.role, "viewer")
        self.assertEqual(new_user.email, "johnsmith@gmail.com")
        self.assertEqual(new_user.first_name, "John")
        self.assertEqual(new_user.last_name, "Smith")

    def test_create_existing_employee(self):
        url = reverse('employee-list')
        response = self.client.post(
            url,
            {
                'user' : {
                    'username' : 'admin',
                    'email' : 'dummysecond@gmail.com',
                    'first_name' : 'Jake',
                    'last_name' : 'Paul'
                },
                'role' : 'editor'
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username',response.json())
        self.assertIn("This field must be unique.",response.json()['username'])

        self.assertIn('email',response.json())
        self.assertIn("This field must be unique.",response.json()['email'])

    def test_update_existing_employee(self):
        url = reverse('employee-detail', kwargs={'pk':self.employee.id})
        response = self.client.patch(
            url,
            {
                'user' : {
                    'username' : 'dummysecond',
                    'email' : 'dummysecond@gmail.com',
                    'first_name' : 'Jake',
                    'last_name' : 'Paul'
                },
                'role' : 'editor'
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username',response.json())
        self.assertIn("This field must be unique.",response.json()['username'])

        self.assertIn('email',response.json())
        self.assertIn("This field must be unique.",response.json()['email'])