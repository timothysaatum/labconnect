from django.db import models
from labs.models import Branch, Test
from modelmixins.models import Facility
from modelmixins.encryption import AESEncryptedField, FernetEncryptedField
from delivery.models import Delivery
from django.contrib.auth import get_user_model
# from django_cryptography.fields import encrypt
import uuid


client = get_user_model()



PATIENT_SEX = [
	('Male', 'Male'),
	('Female', 'Female')
]

PHLEBOTOMIST_REQUIREMENTS = [
	('Yes', 'Yes'),
	('No', 'No')
]

REPORT_DELIVERY_MODE = [
	('hard_copy', 'Hard Copy'),
	('soft_copy', 'Soft Copy')
]

REFERRING_FACILITY_TYPE = [
	('Laboratory', 'Laboratory'),
	('Hospital', 'Hospital')
]

SAMPLE_STATUS = [
	('Pending', 'Pending'),
	('Received', 'Received'),
	('Processed', 'Processed'),
	('Rejected', 'Rejected')
]


REQUEST_STATUS = [

	('Request Made', 'Request Made'),
	('Sample Received by Delivery', 'Sample Received by Delivery'),
	('Sample Received by Lab', 'Sample Received by Lab'),
	('Testing Sample', 'Testing Sample'),
	('Request Completed', 'Request Completed'),
	('Request Accepted', 'Request Accepted')

]

PRIORITIES = [
	('Express', 'Express'),
	('Normal', 'Normal')
]



class Patient(models.Model):
    patient_id = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    contact_number = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField(null=True, blank=True)



class Sample(models.Model):

	'''
	Model representing a medical sample
	'''

	referring_facility = models.ForeignKey(
			Facility,
			on_delete=models.CASCADE, 
			related_name='facilities',
			db_index=True
		)
	# test_field = AESEncryptedField()
	facility_type = models.CharField(
			max_length=50,
			choices=REFERRING_FACILITY_TYPE
		)

	sender_full_name = models.CharField(
		max_length=200, 
		null=True, 
		blank=True
	)

	sender_phone = models.CharField(max_length=20, null=True, blank=True)

	sender_email = models.EmailField(null=True, blank=True)

	patient_name = models.CharField(max_length=200)

	patient_age = models.DateField()

	patient_sex = models.CharField(max_length=20, choices=PATIENT_SEX)

	delivery = models.ForeignKey(
			Delivery,
			on_delete=models.SET_NULL,
			null=True,
			blank=True, db_index=True
		)
	
	to_laboratory = models.ForeignKey(Facility, on_delete=models.CASCADE, db_index=True)

	tests = models.ManyToManyField(Test, related_name='tests')

	clinical_history = models.TextField(null=True, blank=True)

	attachment = (models.FileField(
		upload_to='sample/attachments',
		blank=True,
		null=True
	))

	sample_status = models.CharField(max_length=50, choices=SAMPLE_STATUS, default='Pending', db_index=True)

	requires_phlebotomist = models.CharField(max_length=10, choices=PHLEBOTOMIST_REQUIREMENTS)

	request_status = models.CharField(max_length=155, choices=REQUEST_STATUS, default='Request Accepted', db_index=True)

	report_delivery_mode = models.CharField(max_length=55, choices=REPORT_DELIVERY_MODE)

	referring_signature = models.BooleanField(default=False)

	referror_signature = models.BooleanField(default=False)

	rejection_reason = (models.TextField(blank=True, null=True))

	priority = models.CharField(max_length=50, choices=PRIORITIES)

	date_created = models.DateTimeField(auto_now_add=True)

	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.patient_name

	def delivery_phone(self) -> str:

		return Delivery.objects.get(id=self.delivery.id).phone if self.delivery else None


class SampleTrackingHistory(models.Model):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
	sample = models.ForeignKey(Sample, related_name="tracking_history", on_delete=models.CASCADE, db_index=True)
	status = models.CharField(max_length=50, choices=REQUEST_STATUS, db_index=True)
	location = models.CharField(max_length=255, null=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name_plural = 'Sample Tracking Histories'

	def __str__(self) -> str:
		return self.status


class Notification(models.Model):

	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, db_index=True)
	message = models.CharField(max_length=150)
	is_read = models.BooleanField(default=False)
	is_hidden = models.BooleanField(default=False)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f'{self.branch.town} - {self.branch.laboratory.name}'
