from .models import Notification, Sample
from django.db.models.signals import post_save
from django.dispatch import receiver
from labs.models import Branch



@receiver(post_save, sender=Sample)
def create_notification_for_lab(sender, instance, created, **kwargs):
	
	if created:
		branch = Branch.objects.get(id=instance.to_laboratory.id)
		Notification.objects.create(
			message=f'New sample from: {instance.referring_facility}',
			branch=branch
        )

		if instance.delivery:
			Notification.objects.create(
				message=f'New sample from: {instance.referring_facility}',
				user=instance.delivery.created_by
        	)