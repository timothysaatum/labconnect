from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone
from .managers import ClientManager
from django.urls import reverse

SEX = [('Male', 'Male'), ('Female', 'Female')]

class Client(AbstractBaseUser):

	#setting the paramaters
	email = models.EmailField(unique=True)
	first_name = models.CharField(max_length=50)
	middle_name = models.CharField(max_length=50, blank=True, null=True)
	last_name = models.CharField(max_length=50)
	gender = models.CharField(max_length=7, choices=SEX)
	phone_number = models.CharField(max_length=13)
	digital_address = models.CharField(max_length=12)
	emmergency_number = models.CharField(max_length=13)
	facility_affiliated_with = models.CharField(max_length=200)
	staff_id = models.CharField(max_length=50)
	has_lab = models.BooleanField(default=False)
	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	is_admin = models.BooleanField(default=False)
	date_joined = models.DateTimeField(default=timezone.now) 

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = 	['phone_number']

	#mapping object manager
	objects = ClientManager()

	def __str__(self):
		return f'{self.last_name} {self.first_name}'


	def has_perm(self, perm, obj=None):
		return True


	def has_module_perms(self, app_label):
		return True
