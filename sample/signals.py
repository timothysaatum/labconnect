from .models import Notification, Sample, SampleTrackingHistory, ReferralTrackingHistory, Referral
from django.db.models.signals import post_save
from django.dispatch import receiver
#from labs.models import Branch
from django.db import transaction

@receiver(post_save, sender=Referral)
def create_notification_for_lab(sender, instance, created, **kwargs):

    if created:

        #branch = Branch.objects.get(id=instance.to_laboratory.id)

        with transaction.atomic():
            Notification.objects.create(
                title="New Sample",
                message=f"New sample from: {instance.referring_facility}",
                facility=str(instance.to_laboratory),
            )

            ReferralTrackingHistory.objects.create(
                referral=instance,
                status="Request Accepted",
                location=str(instance.referring_facility),
            )


@receiver(post_save, sender=Sample)
def create_notification_for_sample(sender, instance, created, **kwargs):

    if created:

        SampleTrackingHistory.objects.create(sample=instance, status="Pending")
