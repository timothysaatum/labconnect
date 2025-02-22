import requests
import time
from django.conf import settings
from django.core.management.base import BaseCommand
from transactions.models import Bank
from django.db.utils import IntegrityError

PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET
MAX_RETRIES = 5

class Command(BaseCommand):
    help = "Fetch or Update Paystack Supported Banks"

    def handle(self, *args, **options):
        url = "https://api.paystack.co/bank?country=ghana"
        headers = {
            "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"
        }

        total_banks = 0
        retries = 0

        self.stdout.write(self.style.NOTICE("Fetching banks from Paystack..."))

        while retries < MAX_RETRIES:
            try:
                response = requests.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                self.stdout.write(self.style.SUCCESS("Successfully connected to Paystack API!"))  # ✅ Success message
                break  # Exit the loop if the request is successful
            except requests.ConnectionError:
                self.stdout.write(self.style.WARNING("No internet connection. Retrying..."))
            except requests.Timeout:
                self.stdout.write(self.style.WARNING("Request timed out. Retrying in 5 seconds..."))
            except requests.RequestException as e:
                self.stdout.write(self.style.ERROR(f"API request failed: {e}"))
                return  # Stop execution if a critical error occurs

            retries += 1
            time.sleep(5)

        if retries == MAX_RETRIES:
            self.stdout.write(self.style.ERROR("Failed to fetch banks after multiple retries"))
            return  # Exit early if all retries are exhausted

        data = response.json()
        banks = data.get("data", [])

        if not banks:
            self.stdout.write(self.style.ERROR("API response contains no bank data"))
            return  # Exit if there are no banks to update

        self.stdout.write(self.style.NOTICE("Processing bank data..."))

        for bank in banks:
            try:
                Bank.objects.update_or_create(
                    bank_name=bank["name"],  # Ensure your model has 'bank_name' and 'code'
                    defaults={"code": bank["code"]}
                )
                total_banks += 1
            except IntegrityError:
                self.stdout.write(self.style.WARNING(f'Skipping duplicate bank: {bank["name"]}'))

        self.stdout.write(self.style.SUCCESS(f"Successfully updated {total_banks} Ghanaian banks"))
