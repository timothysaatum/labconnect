import requests
import logging
import time
import uuid
from django.conf import settings
# from concurrent.futures import ThreadPoolExecutor
from django.db import transaction
from modelmixins.models import Facility
from labs.models import Laboratory
from .models import Transaction
from .process_payment import Paystack
 


logger = logging.getLogger(__name__)
# executor = ThreadPoolExecutor(max_workers=10)  # Adjust workers based on traffic

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

    url = {
        "refund_transaction": settings.PAYSTACK_REFUND_URL,
        "create_subaccount": settings.PAYSTACK_SUBACCOUNT_URL,
        "transfer_funds": settings.PAYSTACK_TRANSFER_URL
    }.get(task.task_type)
    
    if not url:

        logger.error(f"Unknown task type: {task.task_type}")
        return

    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
        "Content-Type": "application/json",
        "Idempotency-Key": task.idempotency_key or str(task.id)
    }

    for attempt in range(task.retries, 11):  # Max 10 retries
        if not is_internet_available():
            logger.warning("No internet connection. Retrying in 5 seconds...")
            time.sleep(5)
            continue  # Retry after 5 seconds

        try:
            if task.task_type == "create_subaccount":
                paystack = Paystack()
                resolved_data = paystack.verify_account(
                    task.payload.get("account_number"),
                    task.payload.get("settlement_bank")
                )

                if not resolved_data.get("status"):  # Check if verification failed
                    logger.error(f"Account verification failed: {resolved_data}")
                    task.status = "failed"
                    task.save(update_fields=["status"])
                    return

                account_name = resolved_data["data"]["account_name"]
                task.payload["account_name"] = account_name  # Add verified account name

            if task.task_type == "refund_transaction":
                task.payload["transaction"] = task.transaction_ref
                task.payload["customer_note"] = "Refund for rejected sample"

            # print(task.payload)
            response = requests.post(url, json=task.payload, headers=headers, timeout=10)
            print(response.json())
            response.raise_for_status()
            response_data = response.json()
            # print(response_data)
            

            if response_data.get("status"):  # API call successful
                if task.task_type == "create_subaccount":
                    
                    subaccount_id = response_data.get("data", {}).get("subaccount_code")
                    if subaccount_id:
                        with transaction.atomic():
                            parent_id = uuid.UUID(task.parent)
                            facility = Facility.objects.filter(id=parent_id).first()
                            laboratory = Laboratory.objects.filter(id=parent_id).first()

                            if facility:
                                facility.subaccount_id = subaccount_id
                                facility.save(update_fields=["subaccount_id"])
                                logger.info(f"Facility {facility.id} updated successfully.")
                            elif laboratory:
                                laboratory.subaccount_id = subaccount_id
                                laboratory.save(update_fields=["subaccount_id"])
                                logger.info(f"Laboratory {laboratory.id} updated successfully.")
                            else:
                                logger.error(f"No matching Facility or Laboratory found for task {task.id}")

                elif task.task_type == "transfer_funds":

                    logger.info(f"Funds transfer successful for transaction {task.transaction_ref}.")

                elif task.task_type == "refund_transaction":
                    transaction_ref = task.transaction_ref
                    with transaction.atomic():
                        txn = Transaction.objects.filter(reference=transaction_ref).first()
                        if txn:
                            txn.payment_status = "Refunded"
                            txn.save(update_fields=["payment_status"])
                            logger.info(f"Transaction {txn.reference} refunded successfully.")
                        else:
                            logger.error(f"Transaction {transaction_ref} not found.")

                task.status = "completed"
                task.save(update_fields=["status"])
                logger.info(f"Task {task.id} completed successfully.")
                return response_data["data"]

            logger.warning(f"Task {task.id} failed: {response_data}")
        except requests.RequestException as e:
            logger.error(f"Task {task.id} attempt {attempt} failed: {str(e)}")

        task.retries += 1
        task.save(update_fields=["retries"])
        time.sleep(2 ** attempt)  # Exponential backoff (2s, 4s, 8s, ...)

    task.status = "failed"
    task.save(update_fields=["status"])
    logger.error(f"Task {task.id} permanently failed after 10 attempts.")
    return None
