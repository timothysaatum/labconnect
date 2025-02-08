from django.db import models
from django.contrib.auth import get_user_model


user = get_user_model()


class PriceModel(models.Model):

	distance = models.PositiveIntegerField()
	price = models.DecimalField(decimal_places=2, max_digits=10)
	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return str(self.distance)


class Delivery(models.Model):

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name = models.CharField(max_length=100)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.CharField(max_length=100)
	vehicle_registeration_number = models.CharField(max_length=100)
	licence_id = models.CharField(max_length=100)
	website = models.URLField()
	service_fee = models.ForeignKey(PriceModel, on_delete=models.CASCADE)
	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)


	def __str__(self) -> str:
		return self.name

	def owner_phone(self) -> str:
		return self.created_by.phone_number

	class Meta:
		verbose_name_plural = 'Deliveries'
