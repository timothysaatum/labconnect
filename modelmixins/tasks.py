import dramatiq
import logging
import requests
import uuid
from django.db import transaction
# from modelmixins.models import Facility
from labs.models import Branch
from hospital.models import Hospital, HospitalLab

logger = logging.getLogger(__name__)


@dramatiq.actor(
    max_retries=5, 
    min_backoff=1000, 
    max_backoff=60000,
    store_results=True
)
def fetch_gps_coordinates(digital_address, model, pk):
    url = "https://ghanapostgps.sperixlabs.org/get-location"
    payload = f'address={digital_address}'
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(url, headers=headers, data=payload, timeout=10)
    response.raise_for_status()

    res = response.json()
    table_data = res.get("data", {}).get("Table", [{}])

    if isinstance(table_data, list) and table_data:
        lat = table_data[0].get("CenterLatitude")
        lon = table_data[0].get("CenterLongitude")

        if lat and lon:
            gps = f"{lat}, {lon}"

            with transaction.atomic():
                ModelClass = {
                    "branch": Branch,
                    "hospital": Hospital,
                    "hospitallab": HospitalLab
                }.get(model.lower())

                if not ModelClass:
                    logger.error(f"Invalid model name: {model}")
                    return

                instance = ModelClass.objects.filter(pk=uuid.UUID(pk)).first()
                if instance:
                    instance.gps_coordinates = gps
                    instance.save(update_fields=["gps_coordinates"])
                    logger.info(f"Updated GPS for {model} {pk}: {gps}")
                else:
                    logger.warning(f"No instance found for {model} with id {pk}")
    else:
        raise ValueError("Invalid response structure or no coordinates found.")