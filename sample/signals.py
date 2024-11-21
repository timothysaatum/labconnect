from .models import Notification, Sample, SampleTrackingHistory, ReferralTrackingHistory
from django.db.models.signals import post_save
from django.dispatch import receiver
from labs.models import Branch


@receiver(post_save, sender=Sample)
def create_notification_for_lab(sender, instance, created, **kwargs):

    if created:
        branch = Branch.objects.get(id=instance.referral.to_laboratory.id)
        Notification.objects.create(
            title="New Sample",
            message=f"New sample from: {instance.referral.referring_facility}",
            facility=branch,
        )

        SampleTrackingHistory.objects.create(sample=instance, sample_status="Pending")
        if instance.referral.delivery:
            Notification.objects.create(
                message=f"New sample from: {instance.referral.referring_facility}",
                user=instance.delivery.created_by,
            )
