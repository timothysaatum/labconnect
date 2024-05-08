from django.db import models
from django.contrib.auth import get_user_model


user = get_user_model()


class PriceModel(models.Model):

	distance = models.PositiveIntegerField()
	price = models.DecimalField(decimal_places=2, max_digits=10)
	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.distance} => {self.price}'


class Delivery(models.Model):

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name = models.CharField(max_length=100)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.CharField(max_length=100)
	website = models.URLField()
	service_fee = models.ForeignKey(PriceModel, on_delete=models.CASCADE)
	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)


	def __str__(self):
		return f'{self.name} @ {self.service_fee}ghs'

	def owner_phone(self):
		return self.created_by.phone_number

	class Meta:
		verbose_name_plural = 'Deliveries'
