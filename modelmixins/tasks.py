# import uuid
import requests
# from geographiclib.geodesic import Geodesic
import logging
import socket
import time
import dramatiq
from .utils import is_internet_available, get_gps_coords
logger = logging.getLogger(__name__)




@dramatiq.actor(
    max_retries=5, 
    min_backoff=10000,
    # store_results=True
)  # 10s backoff, 5 retries
def fetch_gps_and_update_model(model_class_path, instance_id, digital_address):
    """
    Background task that fetches GPS coordinates and updates the model instance.
    """
    from django.apps import apps
    from django.db import transaction

    logger = logging.getLogger(__name__)
    logger.info(f"Starting GPS fetch for {model_class_path} with ID {instance_id}")

    if not digital_address or len(digital_address.strip()) < 5:
        logger.warning(f"Skipping GPS fetch due to invalid address: {digital_address}")
        return

    try:
        model_class = apps.get_model(*model_class_path.split("."))
    except LookupError:
        logger.error(f"Invalid model path: {model_class_path}")
        return

    try:
        lat, lon = get_gps_coords(digital_address)
        if lat is None or lon is None:
            logger.warning(f"Could not fetch GPS for {digital_address}")
            return

        with transaction.atomic():
            instance = model_class.objects.select_for_update().get(id=instance_id)
            instance.gps_coordinates = f"{lat}, {lon}"
            instance.save(update_fields=["gps_coordinates"])
            logger.info(f"Successfully updated {model_class_path} (ID {instance_id}) with coordinates: {lat}, {lon}")

    except model_class.DoesNotExist:
        logger.warning(f"{model_class_path} with ID {instance_id} no longer exists.")
    except Exception as e:
        logger.exception(f"Unexpected error updating {model_class_path} with ID {instance_id}: {e}")
