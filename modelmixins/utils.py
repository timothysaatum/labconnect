import uuid
import requests # type: ignore
from geographiclib.geodesic import Geodesic
from concurrent.futures import ThreadPoolExecutor
import logging
import socket
import time


logger = logging.getLogger(__name__)

def ensure_uuid(value):
    if isinstance(value, uuid.UUID):
        return str(value)
    
    try:
        return str(uuid.UUID(value))
    except ValueError:
        return None
    



# Use a thread pool for better async handling
executor = ThreadPoolExecutor(max_workers=5)

def is_internet_available(host="8.8.8.8", port=53, timeout=3):
    """
    Checks if the internet connection is available by attempting to reach a known DNS server.
    """
    try:
        socket.create_connection((host, port), timeout=timeout)
        return True
    except OSError:
        return False


def get_gps_coords(digital_address, max_retries=5, retry_delay=2, callback=None, sync=False):
    """
    Fetch GPS coordinates using an API with retries and internet restoration handling.

    :param digital_address: The digital address to lookup.
    :param max_retries: Maximum retry attempts in case of failure.
    :param retry_delay: Initial delay (seconds) before retrying (exponential backoff).
    :param callback: Function to execute with the result (for async mode).
    :param sync: If True, runs synchronously and returns coordinates.
    :return: (latitude, longitude) if sync=True, else None (async mode).
    """
    url = "https://ghanapostgps.sperixlabs.org/get-location"
    payload = f'address={digital_address}'
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    session = requests.Session()  # Reuse session to optimize connections

    def fetch_coordinates():
        """Handles the API request and retries, with automatic retry on internet restoration."""
        for attempt in range(1, max_retries + 1):
            if not is_internet_available():
                logger.warning("No internet connection. Retrying in 30 seconds...")
                time.sleep(30)
                continue  # Wait for internet restoration

            try:
                response = session.post(url, headers=headers, data=payload, timeout=10)
                response.raise_for_status()  # Raise error for non-200 responses

                res = response.json()
                table_data = res.get("data", {}).get("Table", [{}])

                if isinstance(table_data, list) and table_data:
                    lat, long = table_data[0].get("CenterLatitude"), table_data[0].get("CenterLongitude")

                    if lat is not None and long is not None:
                        logger.info(f"GPS Coordinates for {digital_address}: {lat}, {long}")
                        return lat, long

                logger.warning(f"No valid coordinates found for {digital_address}")

            except requests.exceptions.RequestException as e:
                logger.error(f"Attempt {attempt}: Error fetching GPS for {digital_address}: {e}")

            if attempt < max_retries:
                sleep_time = retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                logger.info(f"Retrying in {sleep_time} seconds...")
                time.sleep(min(sleep_time, 60))  # Cap backoff at 60 seconds
            else:
                logger.error(f"Failed after {max_retries} attempts.")

        return None, None

    if sync:
        return fetch_coordinates()

    # Run asynchronously with a thread pool
    def async_task():
        coords = fetch_coordinates()
        if callback:
            callback(coords)

    executor.submit(async_task)
    logger.info(f"Task submitted for {digital_address}")
# def get_gps_coords(digital_address, max_retries=5, retry_delay=2, sync=True):
#     """
#     Fetch GPS coordinates using an API with retries and exponential backoff.
#     Returns (latitude, longitude) tuple.
#     """
#     if not digital_address or not isinstance(digital_address, str) or len(digital_address) < 5:
#         logger.warning(f"Invalid digital address: {digital_address}")
#         return None, None

#     url = "https://ghanapostgps.sperixlabs.org/get-location"
#     payload = f'address={digital_address}'
#     headers = {"Content-Type": "application/x-www-form-urlencoded"}
#     session = requests.Session()

#     def fetch_coordinates():
#         for attempt in range(1, max_retries + 1):
#             if not is_internet_available():
#                 logger.warning("No internet connection. Retrying in 30 seconds...")
#                 time.sleep(30)
#                 continue

#             try:
#                 response = session.post(url, headers=headers, data=payload, timeout=10)
#                 response.raise_for_status()

#                 res = response.json()
#                 table_data = res.get("data", {}).get("Table", [{}])

#                 if isinstance(table_data, list) and table_data:
#                     lat = table_data[0].get("CenterLatitude")
#                     lon = table_data[0].get("CenterLongitude")

#                     if lat is not None and lon is not None:
#                         logger.info(f"GPS Coordinates for {digital_address}: {lat}, {lon}")
#                         return lat, lon

#                 logger.warning(f"No valid coordinates found for {digital_address}")

#             except requests.exceptions.RequestException as e:
#                 logger.error(f"Attempt {attempt}: Error fetching GPS for {digital_address}: {e}")

#             if attempt < max_retries:
#                 sleep_time = retry_delay * (2 ** (attempt - 1))
#                 logger.info(f"Retrying in {sleep_time} seconds...")
#                 time.sleep(min(sleep_time, 60))

#         logger.error(f"Failed to fetch GPS coordinates for {digital_address} after {max_retries} attempts.")
#         return None, None

#     return fetch_coordinates()
    

def calculate_distance(lat1, lon1, lat2, lon2):
    geod = Geodesic.WGS84
    result = geod.Inverse(lat1, lon1, lat2, lon2)
    # print(int(result["s12"] / 1000))
    return result["s12"] / 1000  # Distance in kilometers

