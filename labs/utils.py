# import requests
# import mimetypes
# from codecs import encode


# conn = requests.get('gps.sourcecodegh.com')
# End Point URL: https://ghanapostgps.sperixlabs.org/get-location
# Method: POST
# API Parameters: address (GhanaPostGPS Address)
# Content-Type: application/x-www-form-urlencoded

import requests # type: ignore
import json
from uuid import UUID
from geographiclib.geodesic import Geodesic
# from labs.models import Branch


# digital_address = "XL-0476-0842"
def get_gps_coords(digital_address):

    url = "https://ghanapostgps.sperixlabs.org/get-location"

    payload = f'address={digital_address}'
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data = payload)
    print(response)

    res = response.json()
    table_data = res.get("data", {}).get("Table", [{}])[0]
    lat, long = table_data.get("CenterLatitude", None), table_data.get(
        "CenterLongitude", None
    )

    return (lat, long)


def calculate_distance(lat1, lon1, lat2, lon2):
    geod = Geodesic.WGS84
    result = geod.Inverse(lat1, lon1, lat2, lon2)
    return result["s12"] / 1000  # Distance in kilometers


def get_nearby_branches(query=None, user_lat=None, user_long=None, max_distance_km=None):
    """
    Retrieve branches within max_distance_km from the user's location.
    """
    # branches = Branch.objects.exclude(gps_coordinates=None)
    nearby_branches = []

    for branch in query:
        try:
            # Extract lat/lon from the gps_coordinates field
            lat, lon = map(float, branch.gps_coordinates.split(","))
            distance = calculate_distance(user_lat, user_long, lat, lon)
            if distance <= max_distance_km:
                nearby_branches.append((branch, distance))

        except ValueError:
            continue

    # Sort branches by distance
    return sorted(nearby_branches, key=lambda x: x[1])


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)
