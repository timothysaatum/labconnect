from django.db import models
from django.contrib.auth import get_user_model
user = get_user_model()





class Plan(models.Model):

	name = models.CharField(max_length=100, default='Free Plan')
	duration = models.DurationField(default='9999 days')
	price = models.FloatField(default=0.00)
	date_added = models.DateTimeField(auto_now=True)


	def __str__(self):
		return self.name



class Subscription(models.Model):

	plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
	subscriber = models.ForeignKey(user, on_delete=models.CASCADE)
	price = models.FloatField(default=0.00)
	balance = models.FloatField(default=0.00)
	is_renewed = models.BooleanField(default=False)
	is_cancelled = models.BooleanField(default=False)
	is_paid = models.BooleanField(default=False)
	has_expired = models.BooleanField(default=False)
	date_of_subscription = models.DateTimeField(auto_now=True)


	def __str__(self):
		return self.plan.name


	def save(self, *args, **kwargs):
		
		self.price = self.plan.price

		super().save(*args, **kwargs)



class Incentive(models.Model):

	beneficient = models.ForeignKey(user, on_delete=models.CASCADE)
	number_of_requests = models.PositiveIntegerField(default=0)
	amortized_amount = models.FloatField(default=0.00)
	is_withdrawn = models.BooleanField(default=False)
	balance = models.FloatField(default=0.00)
	date_withdrawn = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.beneficient.last_name


	@property
	def emmergency_contact(self):
		return self.beneficient.emmergency_number


	@property
	def email(self):
		return self.beneficient.email


	@property
	def tel(self):
		return self.beneficient.phone_number
