from django.core.management.base import BaseCommand
from modelmixins.models import Facility
# from labs.models import Laboratory
# from django.db.models import Q
from transactions.utils import commandline_utility

class Command(BaseCommand):
    help = "Create subaccount ids"

    def handle(self, *args, **kwargs):
        
        labs_with_missing_subaccount_id = Facility.objects.filter(subaccount_id__isnull=True)
        total_labs = labs_with_missing_subaccount_id.count()

        if not total_labs:
            self.stdout.write("No labs with missing subaccount id found.")
            return

        self.stdout.write(f"Found {total_labs} labs with missing subaccount id.")
        for lab in labs_with_missing_subaccount_id:

            try:
                data = {
                    "business_name": str(lab),
                    "settlement_bank": lab.bank_code,
                    "account_number": lab.account_number,
                    "percentage_charge": 100,
                    "id": lab.id
                }
                print(data)

                commandline_utility(data)

            except Exception as e:
                self.stderr.write(f"Error processing lab: {lab.id}: {e} :")

        self.stdout.write("Subaccount process completed.")
