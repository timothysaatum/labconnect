import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
#import json



class ProcessPayments:

	AUTH_SECRET_KEY = settings.PAYSTACK_SECRET_KEY

	headers = {
            "Authorization": f"Bearer {AUTH_SECRET_KEY}",
            "Content-Type": "application/json",
        }
	

	def __init__(self, amount, email):
		self.amount = amount
		self.email = email


	def initialize_transaction(self):

		url = 'https://api.paystack.co/transaction/initialize'

		data = {
		"amount": self. amount,
		"email": self.email
		}
		

		try:
			response = requests.post(url, headers=self.headers, json=data)
			if response:
				print(response.json())
			#return res

		except Exception as e:
			return Response({'error' :'connection error'}, status=status.HTTP_404_NOT_FOUND)

		if response.status_code == 200:

			data = response.json()
			print(data)
			authorization_url = data['data']['authorization_url']

			return authorization_url
		return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)