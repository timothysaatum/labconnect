# import requests # type: ignore
import json
from uuid import UUID
# from geographiclib.geodesic import Geodesic
from django.db.models import Q
from .constants import LEVEL_ORDER
# from concurrent.futures import ThreadPoolExecutor
import logging
# import socket
# import time
from modelmixins.utils import calculate_distance

logger = logging.getLogger(__name__)


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
            # branch = facility.branch
            if not facility.gps_coordinates:
                continue  # Skip facilities without GPS coordinates

            lat, lon = map(float, facility.gps_coordinates.split(","))
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
