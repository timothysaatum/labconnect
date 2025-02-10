from decimal import Decimal
import requests
from django.conf import settings
import logging

logger = logging.getLogger("labs")


class Paystack:

    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.base_url = settings.PAYSTACK_BASE_URL

    def initialize_payment(self, email, amount, callback_url, reference, channels):
        if not isinstance(amount, Decimal):
            raise ValueError("Amount must be a Decimal value")

        try:
            headers = {
                "Authorization": f"Bearer {self.secret_key}",
                "Content-Type": "application/json",
            }

            data = {
                "email": email,
                "amount": int(
                    amount * 100
                ),  # Paystack expects amount in kobo (smallest currency unit)
                "callback_url": callback_url,
                "reference": reference,
                "channels": channels,
            }

            url = f"{self.base_url}/transaction/initialize"

            response = requests.post(url, json=data, headers=headers)

            response.raise_for_status()

            return response

        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    def verify_payment(self, reference):

        headers = {"Authorization": f"Bearer {self.secret_key}"}
        url = f"{self.base_url}/transaction/verify/{reference}"
        response = requests.get(url, headers=headers)

        return response
