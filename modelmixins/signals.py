# from django.db.models.signals import post_save, pre_save
# from django.dispatch import receiver
# import logging
# from .utils import get_gps_coords
# from .models import Facility
# from labs.models import Branch
# from hospital.models import Hospital, HospitalLab
# # from .tasks import fetch_gps_and_update_model


# logger = logging.getLogger(__name__)


# @receiver(pre_save, sender=Branch)
# @receiver(pre_save, sender=Hospital)
# @receiver(pre_save, sender=HospitalLab)
# def track_original_digital_address(sender, instance, **kwargs):
#     """ Store the original digital address before saving, to detect changes. """
#     if instance.pk:  # Ensure it's an update, not a new creation
#         original = Facility.objects.get(pk=instance.pk)
#         instance._original_digital_address = original.digital_address


# @receiver(post_save, sender=Branch)
# @receiver(post_save, sender=Hospital)
# @receiver(post_save, sender=HospitalLab)
# def update_gps_on_digital_address_change(sender, instance, created, **kwargs):
#     """ Fetch GPS coordinates if the digital address has changed. """
    
#     def update_instance(coords):
#         latitude, longitude = coords
#         if latitude is not None and longitude is not None:
#             instance.gps_coordinates = f"{latitude}, {longitude}"
#             instance.save(update_fields=['gps_coordinates'])
#             logger.info(f"Updated GPS coordinates for {instance}: {instance.gps_coordinates}")
#         else:
#             logger.error(f"Failed to fetch GPS coordinates for {instance}")

#     # Run GPS update only if digital_address has changed
#     if created or (hasattr(instance, "_original_digital_address") and instance.digital_address != instance._original_digital_address):
#         if instance.digital_address:  # Ensure it's not empty
#             logger.info(f"Fetching GPS coordinates for {instance.digital_address}")
#             get_gps_coords(instance.digital_address, callback=update_instance)
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import logging
from .models import Facility
from labs.models import Branch
from hospital.models import Hospital, HospitalLab
from .tasks import fetch_gps_coordinates  # dramatiq task

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
            # fetch_gps_coordinates.send(instance.digital_address, model_name, instance.pk)