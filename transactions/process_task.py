from .workers import process_task
import uuid
from .models import BackgroundTask
from concurrent.futures import ThreadPoolExecutor
import logging
logger = logging.getLogger(__name__)
from decimal import Decimal

executor = ThreadPoolExecutor(max_workers=10)  # Adjust workers based on traffic
# from .executor import executor

def convert_decimal_to_float(data):
    """Recursively convert Decimal values to float in a dictionary or list."""
    if isinstance(data, dict):
        return {key: convert_decimal_to_float(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_decimal_to_float(item) for item in data]
    elif isinstance(data, Decimal):
        return float(data)  # Convert Decimal to float
    return data

def enqueue_task(task_type, payload):

    """Create a task in the DB and process it asynchronously."""
    idempotency_key = str(uuid.uuid4())  # Prevent duplicates
    payload = convert_decimal_to_float(payload)
    task = BackgroundTask.objects.create(
        task_type=task_type,
        payload=payload,
        idempotency_key=idempotency_key,
        status="pending",
        parent=payload.pop("parent", None),
        transaction_ref=payload.pop("transaction_ref", None),
    )
    executor.submit(process_task, task)  # Run in background
    logger.info(f"Task {task.id} submitted for processing.")
    return task.id
