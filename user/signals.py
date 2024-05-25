from .utils import send_code_to_user
from .models import Client
from profiles.models import HealthWorkerProfile, LabUserProfile, DeliveryUserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver




@receiver(post_save, sender=Client)
def create_room(sender, instance, created, **kwargs):

	if created:
		email = instance.email
		send_code_to_user(email)
		if instance.account_type == 'Health Worker':
			HealthWorkerProfile.objects.create(client=instance)

		if instance.account_type == 'Laboratory':
			LabUserProfile.objects.create(client=instance)

		if instance.account_type == 'Delivery':
			DeliveryUserProfile.objects.create(client=instance)