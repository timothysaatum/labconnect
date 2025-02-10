from django.db.models.signals import post_save
from django.dispatch import receiver
from labs.models import Branch, Laboratory
from hospital.models import Hospital, HospitalLab
from .utils import create_customer_subaccount


@receiver(post_save, sender=Branch)
@receiver(post_save, sender=Laboratory)
@receiver(post_save, sender=Hospital)
@receiver(post_save, sender=HospitalLab)
def create_subaccount(sender, instance, created, **kwargs):

    # Ensure the function runs for new entries or if account_number has changed
    if (created and instance.account_number) or instance.account_number_has_changed():

        print('Executing')
        create_customer_subaccount(instance)
