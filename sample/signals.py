from .models import Notification, Sample
from django.db.models.signals import post_save
from django.dispatch import receiver



@receiver(post_save, sender=Sample)
def create_notification_for_lab(sender, instance, created, **kwargs):
	
	if created:

		Notification.objects.create(
			message=f'New sample from: {instance.referring_facility}',
			user=instance.to_laboratory.branch_manager
        )

		if instance.delivery:
			Notification.objects.create(
				message=f'New sample from: {instance.referring_facility}',
				user=instance.delivery.created_by
        	)