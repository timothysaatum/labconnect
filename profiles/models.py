from django.db import models
from django.contrib.auth import get_user_model
from hospital.models import Hospital

client = get_user_model()


SEX = [('Male', 'Male'), ('Female', 'Female')]
class BaseModel(models.Model):

	client = models.OneToOneField(client, on_delete=models.CASCADE)
	gender = models.CharField(max_length=7, choices=SEX)
	id_number = models.CharField(max_length=50)
	digital_address = models.CharField(max_length=12)
	emmergency_contact = models.CharField(max_length=20)
	bio = models.TextField()

	class Meta:
		abstract = True


class LabUserProfile(BaseModel):
	
	def __str__(self):
		return str(self.client)	


class DeliveryUserProfile(BaseModel):
	
	def __str__(self):
		return str(self.client)	
