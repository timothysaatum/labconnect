from django.db import models
from django.contrib.auth import get_user_model
from labs.models import Test, Laboratory
from delivery.models import Delivery




user = get_user_model()


class BaseModel(models.Model):

	name = models.CharField(max_length=200)
	date_created = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	class Meta:
		abstract=True

HOSPITAL_TYPES = [

	('Government', 'Government'),
	('Private', 'Private')
]

class Hospital(BaseModel):

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	hospital_type = models.CharField(max_length=50, choices=HOSPITAL_TYPES)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	website = models.URLField()

	def __str__(self):
		return self.name


WARD_TYPES = [

	('Male Ward', 'Male Ward'),
	('Female Ward', 'Female Ward'),
	('Surgical Ward', 'Surgical Ward'),
	('Children Ward', 'Children Ward')
	
]

class Ward(models.Model):

	hospital  = models.ForeignKey(Hospital, on_delete=models.CASCADE)
	ward_type = models.CharField(max_length=200, choices=WARD_TYPES)
	phone = models.CharField(max_length=15)
	ward_manager = models.CharField(max_length=200)
	date_created = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	def __str__(self):
		return self.ward_type


SEX = [('Male', 'Male'), ('Female', 'Female')]

class Sample(models.Model):

	send_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name_of_patient = models.CharField(max_length=200)
	patient_age = models.PositiveIntegerField()
	patient_sex = models.CharField(max_length=20, choices=SEX)
	sample_type = models.CharField(max_length=200)
	sample_container = models.CharField(max_length=100)
	delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE)
	lab = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
	tests = models.ManyToManyField(Test)
	hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
	ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
	brief_description = models.TextField()
	is_received_by_delivery = models.BooleanField(default=False)
	is_delivered_to_lab = models.BooleanField(default=False)
	is_access_by_lab = models.BooleanField(default=False)
	date_created = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	def __str__(self):
		return self.sample_type


	def sender_phone(self):

		phone = self.send_by.phone_number

		return phone