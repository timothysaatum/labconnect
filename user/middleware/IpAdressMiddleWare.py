from .finder import find_ip_address
from django.contrib.gis.geoip2 import GeoIP2
from django.utils import timezone


class FindUserIpAddress:


	def __init__(self, get_response):

		self.get_response = get_response

	def __call__(self, request):

		response = self.get_response(request)

		try:
			user_info = find_ip_address(request)
			
		except Exception as e:
			raise e

		g = GeoIP2()

		ip = user_info.get('ip')
		device = user_info.get('device')

		if ip != '127.0.0.1':

			city_info = g.city(ip)

		else:
			city_info = 'Local Machine => 127.0.0.1'


		with open('user_logs.txt', 'a+') as f:

				f.write(f'Location: {city_info} [{timezone.now()}] \n{device}\n' + '\n')

		return response