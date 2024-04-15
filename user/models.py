from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Permission
from django.utils import timezone
from .managers import ClientManager
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken




SEX = [('Male', 'Male'), ('Female', 'Female')]
USER_TYPE = [
	('Laboratory', 'Laboratory'),
	('Clinician', 'Clinician'),
	('Delivery', 'Delivery')
]

class Client(AbstractBaseUser, PermissionsMixin):

	#setting the paramaters
	email = models.EmailField(unique=True)
	first_name = models.CharField(max_length=50)
	middle_name = models.CharField(max_length=50, blank=True, null=True)
	last_name = models.CharField(max_length=50)
	gender = models.CharField(max_length=7, choices=SEX)
	phone_number = models.CharField(max_length=13)
	digital_address = models.CharField(max_length=12)
	emmergency_number = models.CharField(max_length=13)
	current_facility = models.CharField(max_length=200)
	staff_id = models.CharField(max_length=50)
	profile_picture = models.ImageField(upload_to='clients/profile/picture', default='default.png')
	account_type = models.CharField(max_length=100, choices=USER_TYPE)
	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	is_admin = models.BooleanField(default=False)
	is_verified = models.BooleanField(default=False)
	date_joined = models.DateTimeField(default=timezone.now)
	last_login = models.DateTimeField(auto_now=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = 	['phone_number']

	#mapping object manager
	objects = ClientManager()

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)

		if self.account_type == 'Laboratory':

			permission = Permission.objects.get(codename='add_client')

			self.user_permissions.add(permission)


	def __str__(self):
		return f'{self.last_name} {self.first_name}'


	def has_perm(self, perm, obj=None):
		return True


	def has_module_perms(self, app_label):
		return True


	def tokens(self):

		refresh = RefreshToken.for_user(self)

		return {

			'refresh': str(refresh),
			'access': str(refresh.access_token)
		}


	@property
	def full_name(self):

		return f'{self.first_name} {self.last_name}'

	@property
	def profile_picture_url(self):
		
		return f'http://127.0.0.1:8000{self.profile_picture.url}'




class OneTimePassword(models.Model):

	user = models.OneToOneField(Client, on_delete=models.CASCADE)
	code = models.CharField(max_length=6, unique=True)
	secrete = models.CharField(max_length=100)

	def __str__(self):

		return f'{self.user.last_name} => {self.code}'

	def user_for(self):
		return self.user


	def email_for(self):
		return self.user.email
