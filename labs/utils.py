import requests
# import mimetypes
# from codecs import encode


# conn = requests.get('gps.sourcecodegh.com')

boundary = ''
payload = ''
access_token=None
headers = {
    'Accept': 'application/json',
    'Authorization': f'Bearer {access_token}'
}

data = requests.get('gps.sourcecodegh.com/v1?Action=GetLocation&GPSName=GN09206216', payload, headers)