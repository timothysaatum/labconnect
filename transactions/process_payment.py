import requests
from django.conf import settings



class Paystack:
    SECRET_KEY = settings.PAYSTACK_SECRET_KEY
    BASE_URL = settings.PAYSTACK_BASE_URL

    @staticmethod
    def initialize_payment(email, amount, callback_url, reference, channels):

        headers = {
            "Authorization": f"Bearer {Paystack.SECRET_KEY}",
            "Content-Type": "application/json",
        }

        data = {
            "email": email,
            "amount": int(
                amount * 100
            ),  # Paystack expects amount in kobo (smallest currency unit)
            "callback_url": callback_url,
            "reference": reference,
            "channels": channels
        }
        print(data)
        url = f"{Paystack.BASE_URL}/transaction/initialize"

        response = requests.post(url, json=data, headers=headers)

        return response

    @staticmethod
    def verify_payment(reference):
        headers = {"Authorization": f"Bearer {Paystack.SECRET_KEY}"}
        url = f"{Paystack.BASE_URL}/transaction/verify/{reference}"
        response = requests.get(url, headers=headers)
        return response
