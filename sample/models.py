from django.db import models
from labs.models import Branch, Test
from hospital.models import Facility
from delivery.models import Delivery

OPTIONS = [
	('is_received', 'receive sample'),
	('is_rejected', 'reject sample')
]

PATIENT_SEX = [
	('Male', 'Male'),
	('Female', 'Female')
]

class Sample(models.Model):

	'''
	Model representing a medical sample
	'''

	referring_facility = models.ForeignKey(

			Facility, on_delete=models.CASCADE, 
			related_name='facilities', 
			db_index=True

		)

	sender_full_name = models.CharField(max_length=200)
	sender_phone = models.CharField(max_length=20)
	sender_email = models.EmailField()
	patient_name = models.CharField(max_length=200)
	patient_age = models.DateField()
	patient_sex = models.CharField(max_length=20, choices=PATIENT_SEX)
	sample_type = models.CharField(max_length=200)

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

	options = models.CharField(max_length=30, choices=OPTIONS)
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

		return 'Not selected'
	