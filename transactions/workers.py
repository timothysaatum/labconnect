#import requests
#import logging
#import time
#from django.conf import settings
#from concurrent.futures import ThreadPoolExecutor
#from modelmixins.models import Facility
#import uuid

#logger = logging.getLogger(__name__)
#executor = ThreadPoolExecutor(max_workers=10)  # Adjust workers based on traffic

#def is_internet_available():
#    """Check if the internet is available."""
#    try:
#        requests.get("https://www.google.com", timeout=5)
#        return True
#    except requests.ConnectionError:
#        return False

#def process_task(task):
#    """Process API calls asynchronously."""
#    if task.status != "pending":
#        return  # Skip tasks already processed

#    task.status = "processing"
#    task.save(update_fields=["status"])

#    url = settings.PAYSTACK_SUBACCOUNT_URL if task.task_type == "create_subaccount" else settings.PAYSTACK_TRANSFER_URL
#    headers = {
#        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
#        "Content-Type": "application/json",
#        "Idempotency-Key": task.idempotency_key or str(task.id)
#    }

#    for attempt in range(task.retries, 4):  # Max 3 retries
#        if not is_internet_available():
#            logger.warning("No internet connection. Retrying in 5 seconds...")
#            time.sleep(5)
#            continue  # Retry after 5 seconds

#        try:
#            response = requests.post(url, json=task.payload, headers=headers, timeout=10)
#            response.raise_for_status()
#            response_data = response.json()

#            if response_data.get("status"):
#                # facility = Facility.objects.get(id=uuid.UUID(task.parent))

#                subaccount_id = response_data.get("data", {}).get("subaccount_code")
#                Facility.objects.filter(id=uuid.UUID(task.parent)).update(subaccount_id=subaccount_id)
#                # facility.subaccount_id = subaccount_id
#                # facility.save(update_fields=['subaccount_id'])
#                task.status = "completed"
#                task.save(update_fields=["status"])
#                logger.info(f"Task {task.id} completed successfully.")
#                return response_data["data"]  # Return API response

#            logger.warning(f"Task {task.id} failed: {response_data}")
#        except requests.RequestException as e:
#            logger.error(f"Task {task.id} attempt {attempt} failed: {str(e)}")

#        task.retries += 1
#        task.save(update_fields=["retries"])
#        time.sleep(2 ** attempt)  # Exponential backoff (2s, 4s, 8s)

#    task.status = "failed"
#    task.save(update_fields=["status"])
#    logger.error(f"Task {task.id} permanently failed after 3 attempts.")
#    return None

import requests
import logging
import time
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor
from modelmixins.models import Facility
import uuid
from django.db import transaction

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=10)  # Adjust workers based on traffic

def is_internet_available():
    """Check if the internet is available."""
    try:
        requests.get("https://www.google.com", timeout=5)
        return True
    except requests.ConnectionError:
        return False

def process_task(task):
    """Process API calls asynchronously."""
    if task.status != "pending":
        return  # Skip tasks already processed

    task.status = "processing"
    task.save(update_fields=["status"])

    url = settings.PAYSTACK_SUBACCOUNT_URL if task.task_type == "create_subaccount" else settings.PAYSTACK_TRANSFER_URL
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
        "Content-Type": "application/json",
        "Idempotency-Key": task.idempotency_key or str(task.id)
    }

    for attempt in range(task.retries, 4):  # Max 3 retries
        if not is_internet_available():
            logger.warning("No internet connection. Retrying in 5 seconds...")
            time.sleep(5)
            continue  # Retry after 5 seconds

        try:
            response = requests.post(url, json=task.payload, headers=headers, timeout=10)
            response.raise_for_status()
            response_data = response.json()

            if response_data.get("status"):
                subaccount_id = response_data.get("data", {}).get("subaccount_code")
                if subaccount_id:  # Ensure subaccount_code exists before updating
                    # Use transaction.atomic to avoid race conditions
                    with transaction.atomic():
                        # Update Facility's subaccount_id within a transaction
                        Facility.objects.filter(id=uuid.UUID(task.parent)).update(subaccount_id=subaccount_id)
                        
                task.status = "completed"
                task.save(update_fields=["status"])
                logger.info(f"Task {task.id} completed successfully.")
                return response_data["data"]  # Return API response

            logger.warning(f"Task {task.id} failed: {response_data}")
        except requests.RequestException as e:
            logger.error(f"Task {task.id} attempt {attempt} failed: {str(e)}")

        task.retries += 1
        task.save(update_fields=["retries"])
        time.sleep(2 ** attempt)  # Exponential backoff (2s, 4s, 8s)

    task.status = "failed"
    task.save(update_fields=["status"])
    logger.error(f"Task {task.id} permanently failed after 3 attempts.")
    return None