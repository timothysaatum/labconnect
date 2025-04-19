from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import logging
from .models import Facility
from labs.models import Branch
from hospital.models import Hospital, HospitalLab
from .tasks import fetch_gps_coordinates





logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Branch)
@receiver(pre_save, sender=Hospital)
@receiver(pre_save, sender=HospitalLab)
def track_original_digital_address(sender, instance, **kwargs):
    if instance.pk:
        original = Facility.objects.get(pk=instance.pk)
        instance._original_digital_address = original.digital_address


@receiver(post_save, sender=Branch)
@receiver(post_save, sender=Hospital)
@receiver(post_save, sender=HospitalLab)
def update_gps_on_digital_address_change(sender, instance, created, **kwargs):
    if created or (hasattr(instance, "_original_digital_address") and instance.digital_address != instance._original_digital_address):
        if instance.digital_address:
            model_name = sender.__name__.lower()
            logger.info(f"Queueing GPS update task for {model_name} {instance.pk}")
            fetch_gps_coordinates.send(instance.digital_address, model_name, str(instance.pk))