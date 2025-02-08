from django.db.models.signals import post_save
from django.dispatch import receiver
import requests
from labs.models import Branch
from hospital.models import Hospital, HospitalLab
from django.conf import settings
import logging
from .utils import create_customer_subaccount
from requests.exceptions import RequestException

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Branch)
@receiver(post_save, sender=Hospital)
@receiver(post_save, sender=HospitalLab)
def create_subaccount(sender, instance, created, **kwargs):
    
    # Ensure the function runs for new entries or if account_number has changed
    if created or instance.account_number_has_changed():
        create_customer_subaccount(instance)
        # print(instance.account_number_has_changed())
        # PAYSTACK_SECRET = settings.PAYSTACK_SECRET
        # url = "https://api.paystack.co/subaccount"

        # headers = {
        #     "Authorization": f"Bearer {PAYSTACK_SECRET}",
        #     "Content-Type": "application/json"
        # }

        # try:
        #     account = instance.account_number
        #     bank_code = instance.bank_code  # Ensure 'code' refers to the correct bank code
        #     business_name = str(instance)  # Use the __str__ method of the instance

        #     if account and bank_code and business_name:
        #         data = {
        #             "business_name": business_name,
        #             "settlement_bank": bank_code,
        #             "account_number": account,
        #             "percentage_charge": 100
        #         }

        #         try:
        #             response = requests.post(url, json=data, headers=headers)
                    
        #             response.raise_for_status()  # Raises an HTTPError for bad responses

        #             if response.status_code in [200, 201]:
        #                 subaccount_data = response.json().get("data", {})
        #                 subaccount_id = subaccount_data.get("subaccount_code")

        #                 if subaccount_id:
        #                     # Update without triggering post_save again
        #                     instance.subaccount_id = subaccount_id
        #                     instance.save(update_fields=['subaccount_id'])

        #             else:
        #                 logger.error(f"Failed to create subaccount for {instance}: Status code {response.status_code}, Response: {response.text}")

        #         except RequestException as e:
        #             # Handle network or other request-related errors
        #             logger.error(f"Network error while creating subaccount for {instance}: {str(e)}")

        #     else:
        #         logger.warning(f"Missing required fields for creating subaccount: {instance}")

        # except Exception as e:
        #     logger.error(f"Unexpected error occurred while updating subaccount ID for {instance}: {str(e)}")
