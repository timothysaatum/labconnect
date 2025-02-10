import requests # type: ignore
import json
from uuid import UUID
from geographiclib.geodesic import Geodesic
from django.db.models import Q
from .constants import LEVEL_ORDER
import threading
import logging
import socket
import time

logger = logging.getLogger(__name__)


def is_internet_available(host="8.8.8.8", port=53, timeout=3):
    """
    Checks if the internet connection is available by attempting to reach a known DNS server (Google's 8.8.8.8).
    
    :param host: Host to ping (default is Google's DNS).
    :param port: Port to use (default is 53).
    :param timeout: Timeout in seconds.
    :return: True if internet is available, False otherwise.
    """
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
        return True
    except socket.error:
        return False

def get_gps_coords(digital_address, max_retries=5, retry_delay=2, callback=None, sync=False):
    """
    Fetch GPS coordinates using an API with retries and internet restoration handling.

    :param digital_address: The digital address to lookup.
    :param max_retries: Maximum retry attempts in case of failure.
    :param retry_delay: Delay (seconds) before retrying (exponential backoff).
    :param callback: Function to execute with the result (for async mode).
    :param sync: If True, runs synchronously and returns coordinates.
    :return: (latitude, longitude) if sync=True, else None (async mode).
    """

    def fetch_coordinates():
        """Handles the API request and retries, with automatic retry on internet restoration."""
        url = "https://ghanapostgps.sperixlabs.org/get-location"
        payload = f'address={digital_address}'
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        for attempt in range(1, max_retries + 1):
            try:
                response = requests.post(url, headers=headers, data=payload, timeout=10)
                response.raise_for_status()  # Raise error for non-200 responses

                try:
                    res = response.json()
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error for {digital_address}: {e}")
                    return None, None

                table_data = res.get("data", {}).get("Table", [{}])
                if not isinstance(table_data, list) or not table_data:
                    logger.warning(f"Unexpected API response format for {digital_address}: {res}")
                    return None, None

                table_entry = table_data[0]
                lat = table_entry.get("CenterLatitude")
                long = table_entry.get("CenterLongitude")

                if lat is not None and long is not None:
                    logger.info(f"GPS Coordinates for {digital_address}: {lat}, {long}")
                    return lat, long

                logger.warning(f"No coordinates found for {digital_address}")

            except requests.exceptions.ConnectionError:
                logger.error(f"Internet connection lost while fetching GPS for {digital_address}. Waiting for restoration...")
                wait_for_internet()  # Wait until internet is back
                continue  # Retry immediately after restoration

            except requests.exceptions.Timeout:
                logger.error(f"Timeout while fetching GPS for {digital_address}. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                continue

            except requests.exceptions.RequestException as e:
                logger.error(f"Attempt {attempt}: Error fetching GPS for {digital_address}: {e}")

            if attempt < max_retries:
                sleep_time = retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                logger.info(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                logger.error(f"Failed after {max_retries} attempts.")

        return None, None

    def wait_for_internet():
        """Waits until an internet connection is available before proceeding."""
        while not is_internet_available():
            logger.info("No internet connection. Retrying in 30 seconds...")
            time.sleep(30)
        logger.info("Internet connection restored. Resuming GPS fetch.")

    if sync:
        return fetch_coordinates()  # Runs synchronously for CLI usage

    # Run asynchronously with threading, catching errors inside the thread
    def async_task():
        try:
            coords = fetch_coordinates()
            if callback:
                callback(coords)
        except Exception as e:
            logger.error(f"Unhandled exception in thread for {digital_address}: {e}")

    thread = threading.Thread(target=async_task, daemon=True, name=f"GPSFetcher-{digital_address}")
    thread.start()
    logger.info(f"Thread {thread.name} started for {digital_address}")



def calculate_distance(lat1, lon1, lat2, lon2):
    geod = Geodesic.WGS84
    result = geod.Inverse(lat1, lon1, lat2, lon2)
    # print(int(result["s12"] / 1000))
    return result["s12"] / 1000  # Distance in kilometers


def filter_by_facility_level(query, facility_level):

    """
    Filter facilities by their level.
    """

    if facility_level not in LEVEL_ORDER:
        return query  # Return unfiltered query if the level is invalid

    level_value = LEVEL_ORDER[facility_level]
    valid_levels = [
        level for level, value in LEVEL_ORDER.items() if value >= level_value
    ]

    return query.filter(
        Q(hospitallab__level__in=valid_levels) | Q(branch__level__in=valid_levels)
    )


def get_nearby_branches(query=None, user_lat=None, user_long=None, max_distance_km=None):

    """
    Retrieve branches within max_distance_km from the user's location.
    """

    nearby_branches = []
    user_lat, user_long = float(user_lat), float(user_long)

    for facility in query:
        try:
            # Extract lat/lon and calculate distance
            branch = facility.branch
            if not branch or not facility.branch.gps_coordinates:
                continue  # Skip facilities without GPS coordinates

            lat, lon = map(float, facility.branch.gps_coordinates.split(","))
            distance = calculate_distance(user_lat, user_long, lat, lon)

            if distance <= max_distance_km:
                nearby_branches.append((facility, distance))

        except ValueError:
            # Handle invalid GPS data
            continue

    # Sort branches by distance and return the facilities
    return [branch[0] for branch in sorted(nearby_branches, key=lambda x: x[1])]


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)
