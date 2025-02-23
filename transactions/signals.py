# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from labs.models import Branch, Laboratory
# from hospital.models import Hospital, HospitalLab
# from .utils import create_customer_subaccount


# @receiver(post_save, sender=Branch)
# @receiver(post_save, sender=Laboratory)
# @receiver(post_save, sender=Hospital)
# @receiver(post_save, sender=HospitalLab)
# def create_subaccount(sender, instance, created, update_fields=None, **kwargs):
#     """Trigger subaccount creation when account number is set or updated."""
    
#     if created or (update_fields and "account_number" in update_fields):
#         print("Executing subaccount creation task")
#         create_customer_subaccount(instance)

from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from labs.models import Branch, Laboratory
from hospital.models import Hospital, HospitalLab
from .utils import create_customer_subaccount

@receiver(pre_save, sender=Branch)
@receiver(pre_save, sender=Laboratory)
@receiver(pre_save, sender=Hospital)
@receiver(pre_save, sender=HospitalLab)
def track_original_account_number(sender, instance, **kwargs):
    """ Store the original account number before saving, to detect changes. """
    if instance.pk:  # Ensure it's an update, not a new creation
        original = sender.objects.get(pk=instance.pk)
        instance._original_account_number = original.account_number

@receiver(post_save, sender=Branch)
@receiver(post_save, sender=Laboratory)
@receiver(post_save, sender=Hospital)
@receiver(post_save, sender=HospitalLab)
def create_subaccount(sender, instance, created, **kwargs):
    """ Trigger subaccount creation only if account_number has changed. """

    # Run only if the instance is new OR if account_number has changed
    if created or (hasattr(instance, "_original_account_number") and instance.account_number != instance._original_account_number):
        if instance.account_number:  # Ensure it's not empty
            print("Executing subaccount creation task")
            create_customer_subaccount(instance)
