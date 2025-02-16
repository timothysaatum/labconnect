from django.db.models.signals import post_save
from django.dispatch import receiver
from labs.models import Branch, Laboratory
from hospital.models import Hospital, HospitalLab
from .utils import create_customer_subaccount


@receiver(post_save, sender=Branch)
@receiver(post_save, sender=Laboratory)
@receiver(post_save, sender=Hospital)
@receiver(post_save, sender=HospitalLab)
def create_subaccount(sender, instance, created, update_fields=None, **kwargs):
    """Trigger subaccount creation when account number is set or updated."""
    
    if created or (update_fields and "account_number" in update_fields):
        print("Executing subaccount creation task")
        create_customer_subaccount(instance)