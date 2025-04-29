from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Permission
from django.utils import timezone
from .managers import ClientManager
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken


SEX = [('Male', 'Male'), ('Female', 'Female')]

USER_TYPE = [
	('Laboratory', 'Laboratory'),
	('Hospital', 'Hospital'),
	('Delivery', 'Delivery'),
	('As an Individual', 'As an Individual')
]

class Client(AbstractBaseUser, PermissionsMixin):

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=13)
    email = models.EmailField(unique=True, db_index=True)
    id_number = models.CharField(max_length=50, null=True, blank=True)
    digital_address = models.CharField(max_length=12, null=True, blank=True)
    emmergency_contact = models.CharField(max_length=20, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    account_type = models.CharField(max_length=100, choices=USER_TYPE, db_index=True)
    is_admin = models.BooleanField(default=False, db_index=True)
    is_staff = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    is_verified = models.BooleanField(default=False, db_index=True)
    is_branch_manager = models.BooleanField(default=False, db_index=True)
    is_worker = models.BooleanField(default=False, db_index=True)
    is_an_individual = models.BooleanField(default=False, db_index=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone_number"]

    # mapping object manager
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


class OneTimePassword(models.Model):

	user = models.OneToOneField(Client, on_delete=models.CASCADE, unique=True)
	code = models.CharField(max_length=6, unique=True, db_index=True)
	secrete = models.CharField(max_length=100)
	expires_at = models.DateTimeField()

	def save(self, *args, **kwargs):
		if not self.expires_at:
			self.expires_at = timezone.now() + timezone.timedelta(minutes=3)
		super(OneTimePassword, self).save(*args, **kwargs)

	@staticmethod
	def get_instance():
		return OneTimePassword.objects.get_or_create(id=1)[0]

	def is_expired(self):
		return timezone.now() > self.expires_at

	def __str__(self):

		return f'{self.user.last_name} | {self.code}'

	def user_for(self):
		return self.user

	def email_for(self):
		return self.user.email
		

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    customer = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="complaints")
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Complaint by {self.customer} - {self.subject}"
    

class WaitList(models.Model):

    full_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    facility_name = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    contacted      = models.BooleanField(default=False)
    contacted_at   = models.DateTimeField(null=True, blank=True)
    joint_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name or "Anonymous"



class CustomerSupport(models.Model):
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="customer_support")
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['subject', 'message'],
                name='unique_support_message'
            )
        ]

    def __str__(self):
        return self.subject