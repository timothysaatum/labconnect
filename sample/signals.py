from .models import Notification, Sample
from django.db.models.signals import post_save
from django.dispatch import receiver



receiver(post_save, sender=Sample)
def CreateNotificationForLab(sender, instance, created, **kwargs):

	if created:
		Notification.objects.create(
			message=f'New sample: {instance.sample_type}',
			user=instance.to_laboratory.branch_manager
        )

		Notification.objects.create(
			message=f'New sample: {instance.sample_type}',
			user=instance.delivery.created_by
        )
