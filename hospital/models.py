from django.db import models
from django.contrib.auth import get_user_model
from labs.models import Test, Laboratory
from delivery.models import Delivery
#from django.utils import timezone



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

	hospital_type = models.CharField(max_length=50, choices=HOSPITAL_TYPES)
	region_of_location = models.CharField(max_length=255)
	digital_address = models.CharField(max_length=15)
	mailing_address = models.CharField(max_length=255)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	website = models.URLField()

	def __str__(self):
		return self.name



class Sample(models.Model):

	send_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name_of_patient = models.CharField(max_length=200)
	patient_age = models.DateField()
	patient_sex = models.CharField(max_length=20)
	sample_type = models.CharField(max_length=200)
	sample_container = models.CharField(max_length=100)
	delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, null=True, blank=True)
	lab = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
	tests = models.ManyToManyField(Test, related_name='tests')
	hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
	brief_description = models.TextField()
	attachment = models.FileField(upload_to='sample/attachments', blank=True, null=True)
	is_paid = models.BooleanField(default=False)
	is_received_by_delivery = models.BooleanField(default=False)
	is_delivered_to_lab = models.BooleanField(default=False)
	is_access_by_lab = models.BooleanField(default=False)
	date_created = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	def __str__(self):
		return self.sample_type


	#def save(self, *args, **kwargs):
	#	super().save(*args, **kwargs)

	#	self.test.set(self.tests.all() | set(kwargs.get('tests', [])))


	def sender_phone(self):

		phone = self.send_by.phone_number

		return phone

	def delivery_phone(self):

		if self.delivery:
			del_phone = Delivery.objects.get(id=self.delivery.id).phone

			return del_phone
		return 'Self Sent'