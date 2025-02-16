from .workers import process_task
import uuid
from .models import BackgroundTask
from concurrent.futures import ThreadPoolExecutor
import logging
logger = logging.getLogger(__name__)

executor = ThreadPoolExecutor(max_workers=10)  # Adjust workers based on traffic

def enqueue_task(task_type, payload):
    """Create a task in the DB and process it asynchronously."""
    idempotency_key = str(uuid.uuid4())  # Prevent duplicates
    task = BackgroundTask.objects.create(
        task_type=task_type,
        payload=payload,
        idempotency_key=idempotency_key,
        status="pending"
    )
    executor.submit(process_task, task)  # Run in background
    logger.info(f"Task {task.id} submitted for processing.")
    return task.id