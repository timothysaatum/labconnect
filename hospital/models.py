from django.db import models
from django.contrib.auth import get_user_model
from labs.models import Test, Laboratory, Branch
from delivery.models import Delivery



user = get_user_model()



HOSPITAL_TYPES = [

	('Public', 'Public'),
	('Private', 'Private')
]

class Hospital(models.Model):

	'''
	Model: Representing a hospital
	'''
	administrator = models.ForeignKey(user, on_delete=models.CASCADE)
	name = models.CharField(max_length=200)
	hospital_type = models.CharField(max_length=10, choices=HOSPITAL_TYPES)
	account_number = models.CharField(max_length=100)
	referral_percent_discount = models.CharField(max_length=5)
	region_of_location = models.CharField(max_length=255)
	digital_address = models.CharField(max_length=15)
	postal_address = models.CharField(max_length=255)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	website = models.URLField(blank=True, null=True)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.name


class Sample(models.Model):

	'''
	Model representing a medical sample
	'''
	#0249653419
	hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
	sender_full_name = models.CharField(max_length=200)
	sender_phone = models.CharField(max_length=20)
	sender_email = models.EmailField()
	name_of_patient = models.CharField(max_length=200)
	patient_age = models.DateTimeField(auto_now=True)
	patient_sex = models.CharField(max_length=20)
	sample_type = models.CharField(max_length=200)
	delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, null=True, blank=True)
	lab = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='samples', db_index=True)
	tests = models.ManyToManyField(Test, related_name='tests')
	brief_description = models.TextField(null=True, blank=True)
	attachment = models.FileField(upload_to='sample/attachments', blank=True, null=True)
	is_rejected = models.BooleanField(default=False)
	rejection_reason = models.TextField(blank=True, null=True)
	is_paid = models.BooleanField(default=False)
	is_received_by_delivery = models.BooleanField(default=False)
	is_delivered_to_lab = models.BooleanField(default=False)
	is_accessed_by_lab = models.BooleanField(default=False)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.sample_type

	def delivery_phone(self) -> str:

		if self.delivery:

			del_phone = Delivery.objects.get(id=self.delivery.id).phone

			return del_phone

		return None

	def referral_percent_discount(self):
		return self.hospital.referral_percent_discount