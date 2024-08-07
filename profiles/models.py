from django.db import models
from django.contrib.auth import get_user_model


client = get_user_model()


SEX = [('Male', 'Male'), ('Female', 'Female')]
class ClientProfile(models.Model):

	client = models.OneToOneField(client, on_delete=models.CASCADE)
	gender = models.CharField(max_length=7, choices=SEX)
	id_number = models.CharField(max_length=50)
	digital_address = models.CharField(max_length=12)
	emmergency_contact = models.CharField(max_length=20)
	bio = models.TextField()

	# class Meta:
	# 	abstract = True

	def __str__(self) -> str:
		return self.client.full_name
