from django.db import models
from labs.models import Branch, Test
from hospital.models import Facility
from delivery.models import Delivery
from django.contrib.auth import get_user_model


client = get_user_model()



PATIENT_SEX = [
	('Male', 'Male'),
	('Female', 'Female')
]
REFERRING_FACILITY_TYPE = [
	('Laboratory', 'Laboratory'),
	('Hospital', 'Hospital')
]
SAMPLE_STATUS = [
	('Received by delivery', 'Received by delivery'),
	('Received by laboratory', 'Received by laboratory'),
	('Rejected by laboratory', 'Rejected by laboratory')
]

PRIORITIES = [
	('Express', 'Express'),
	('Normal', 'Normal')
]
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
			on_delete=models.CASCADE,
			null=True,
			blank=True
		)
	to_laboratory = models.ForeignKey(Branch, on_delete=models.CASCADE)
	tests = models.ManyToManyField(Test, related_name='tests')
	clinical_history = models.TextField(null=True, blank=True)
	attachment = models.FileField(
		upload_to='sample/attachments',
		blank=True,
		null=True
	)
	is_marked_sent = models.BooleanField(default=False)
	sample_status = models.CharField(max_length=50, choices=SAMPLE_STATUS)
	is_rejected = models.BooleanField(default=False)
	rejection_reason = models.TextField(blank=True, null=True)
	priority = models.CharField(max_length=50, choices=PRIORITIES)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.patient_name

	def delivery_phone(self) -> str:

		return Delivery.objects.get(id=self.delivery.id).phone if self.delivery else None


class Notification(models.Model):

	branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
	message = models.CharField(max_length=150)
	is_read = models.BooleanField(default=False)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.user.full_name
