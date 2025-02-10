import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from transactions.models import Bank
from django.db.utils import IntegrityError
import time


PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET
MAX_RETRIES = 5

class Command(BaseCommand):
    help('Fetch or Update Paystack Supported Banks')


    def handle(self, *args, **options):
        url = "https://api.paystack.co/bank?country=ghana"
        headers = {
            "Authorization":f"Bearer {PAYSTACK_SECRET_KEY}"
        }

        total_banks = 0

        retries = 0

        while retries < MAX_RETRIES:

            try:
                response = requests.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                break
            except requests.ConnectionError:
                self.stdout.write("No internet Connection")
            except requests.Timeout:
                self.stdout.write("Request Timed Out. Retrying in 5seconds")
            except requests.RequestException:
                self.stdout.write("API Request Failed")
                return
            
            retries += 1
            time.sleep(5)
        if retries == MAX_RETRIES:
            self.stdout.write(self.style.ERROR("Failed to Fetch Banks After Multiple Retries"))

        data = response.json()
        banks = data.get("data", [])

        if not banks:
            self.stdout.write(self.style.ERROR("API Response Contains no Bank Data"))
        
        for bank in banks:
            try:
                Bank.objects.update_or_create(
                    bank_name=bank["name"], defaults={
                        "code": bank["code"]
                    }
                )
                total_banks += 1
            except IntegrityError:
                self.stdout.write(self.style.WARNING(f"Skipping duplicated Bank {bank["name"]}"))
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {total_banks} Ghanain Banks"))
