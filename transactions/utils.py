import requests
import logging
from django.conf import settings
from requests.exceptions import RequestException, Timeout
import threading
import time
from modelmixins.models import Facility
import uuid


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

def create_customer_subaccount(instance, max_retries=3, retry_delay=2):
    """
    Creates a customer Paystack subaccount asynchronously in a separate thread.
    Uses retries with exponential backoff and waits for internet restoration.
    """

    def task():
        """Runs the actual request in a background thread."""
        if not all([instance.account_number, instance.bank_code, str(instance)]):
            logger.warning(f"Missing required fields for creating subaccount: {instance}")
            return

        data = {
            "business_name": str(instance),
            "settlement_bank": instance.bank_code,
            "account_number": instance.account_number,
            "percentage_charge": 100
        }

        for attempt in range(1, max_retries + 1):
            if not is_internet_available():
                wait_for_internet()

            try:
                subaccount_id = create_subaccount_request(data)

                if subaccount_id:
                    instance.subaccount_id = subaccount_id
                    instance.save(update_fields=['subaccount_id'])
                    logger.info(f"Subaccount successfully created for {instance} with ID {subaccount_id}")
                    return  # Exit loop if successful

                logger.warning(f"Subaccount creation response missing ID for {instance}")

            except (RequestException, Timeout) as e:
                logger.error(f"Attempt {attempt}: Error creating subaccount for {instance}: {str(e)}")

            if attempt < max_retries:
                sleep_time = retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                logger.info(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                logger.error(f"Failed to create subaccount for {instance} after {max_retries} attempts.")

    # Run the task in a separate background thread
    thread = threading.Thread(target=task, daemon=True, name=f"SubaccountThread-{instance.id}")
    thread.start()
    logger.info(f"Thread {thread.name} started for {instance}")

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


def transfer_funds_to_lab(lab_subaccount_id, amount, reason, max_retries=-1, retry_delay=5):
    """
    Transfers funds to the lab's Paystack subaccount with idempotency to prevent duplicates.
    
    :param lab_subaccount_id: The Paystack subaccount ID of the lab.
    :param amount: The amount to transfer (in kobo).
    :param reason: Reason for the transfer.
    :param max_retries: Maximum retry attempts (-1 for infinite retries).
    :param retry_delay: Delay in seconds before retrying.
    """

    def task():
        attempt = 0
        idempotency_key = str(uuid.uuid4())  # Generate a unique request ID

        while True:
            if not is_internet_available():
                wait_for_internet()

            try:
                url = settings.PAYSTACK_TRANSFER_URL
                headers = {
                    "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
                    "Content-Type": "application/json",
                    "Idempotency-Key": idempotency_key  # Prevent duplicate transfers
                }
                data = {
                    "source": "balance",
                    "amount": amount,
                    "recipient": lab_subaccount_id,
                    "reason": reason
                }

                response = requests.post(url, json=data, headers=headers, timeout=10)
                response.raise_for_status()

                transfer_data = response.json()
                if transfer_data.get("status"):
                    logger.info(f"Transfer successful: {amount / 100:.2f} to {lab_subaccount_id}")
                    return  # Exit loop on success
                
                logger.warning(f"Transfer response failed: {transfer_data}")

            except (RequestException, Timeout) as e:
                logger.error(f"Error transferring funds to {lab_subaccount_id}: {str(e)}")

            attempt += 1
            if max_retries != -1 and attempt >= max_retries:
                logger.error(f"Max retries reached. Transfer failed for {lab_subaccount_id}.")
                break

            sleep_time = retry_delay * (2 ** (attempt - 1))  # Exponential backoff
            logger.info(f"Retrying transfer in {sleep_time} seconds...")
            time.sleep(sleep_time)

    # Run transfer in a background thread
    thread = threading.Thread(target=task, daemon=True, name=f"TransferThread-{lab_subaccount_id}")
    thread.start()
    logger.info(f"Thread {thread.name} started for lab {lab_subaccount_id}")
