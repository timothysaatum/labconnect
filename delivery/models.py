from django.db import models
from django.contrib.auth import get_user_model


user = get_user_model()

class Delivery(models.Model):

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)
	name = models.CharField(max_length=100)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.CharField(max_length=100)
	website = models.URLField()
	cost_per_delivery = models.PositiveIntegerField()


	def __str__(self):
		return f'{self.name} @ {self.cost_per_delivery}ghs'


	def delivery_phone(self):
		return self.created_by.phone_number