import requests
import logging
from django.conf import settings
from requests.exceptions import RequestException
import time
from decimal import Decimal
from modelmixins.models import Facility
from .process_task import enqueue_task


logger = logging.getLogger(__name__)

def is_internet_available():
    """Check if the internet is available by pinging Google's DNS."""
    try:
        requests.get("https://www.google.com", timeout=5)
        return True
    except requests.ConnectionError:
        return False

def wait_for_internet():
    """Wait until the internet connection is restored before proceeding."""
    logger.warning("No internet connection. Waiting to retry...")
    while not is_internet_available():
        time.sleep(5)  # Check every 5 seconds
    logger.info("Internet restored. Resuming operations.")

def create_subaccount_request(data):
    """Handles the API request for creating a subaccount."""
    url = settings.PAYSTACK_SUBACCOUNT_URL
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=data, headers=headers, timeout=10)
        response.raise_for_status()
        subaccount_data = response.json().get("data", {})
        return subaccount_data.get("subaccount_code")

    except RequestException as e:
        logger.error(f"Request error while creating subaccount: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error while creating subaccount: {str(e)}")

    return None


def create_customer_subaccount(instance):
    """Enqueue task to create a Paystack subaccount."""
    print(f"I am executing {instance.id}")
    if not all([instance.account_number, instance.bank_code, str(instance)]):
        logger.warning(f"Missing required fields for {instance}")
        return None

    data = {
        "business_name": str(instance),
        "settlement_bank": instance.bank_code,
        "account_number": instance.account_number,
        "percentage_charge": 100,
        "parent": str(instance.id)
    }

    return enqueue_task("create_subaccount", data)



def commandline_utility(data):
    """Handles subaccount creation from CLI input."""

    try:
        facility = Facility.objects.get(pk=data["id"])
    except Facility.DoesNotExist:
        logger.error(f"Facility with id: {data['id']} -- not found")
        return

    if not all([data.get("account_number"), data.get("bank_code"), data.get("business_name")]):
        logger.warning(f"Missing required fields for creating subaccount: {facility}")
        return

    if not is_internet_available():
        wait_for_internet()

    subaccount_id = create_subaccount_request(data)

    if subaccount_id:
        facility.subaccount_id = subaccount_id
        facility.save(update_fields=['subaccount_id'])
    else:
        logger.error(f"Failed to create subaccount for {facility}")


def transfer_funds_to_lab(lab_subaccount_id, amount, reason, parent):
    """Enqueue fund transfer task."""
    data = {
        "source": "balance",
        "amount": Decimal(amount) * 100,
        "recipient": lab_subaccount_id,
        "reason": reason,
        "parent": parent
    }
    return enqueue_task("transfer_funds", data)
