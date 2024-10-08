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




def get_gps_coords(digital_address):
    
    url = "https://ghanapostgps.sperixlabs.org/get-location"

    payload = f'address={digital_address}'
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data = payload)

    return response


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)
    
