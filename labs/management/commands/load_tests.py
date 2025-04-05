import uuid
from django.core.management.base import BaseCommand
#from labs.models import TestTemplate
from modelmixins.models import Department, SampleType, TestTemplate
from decimal import Decimal
import pdfplumber


class Command(BaseCommand):
    help = 'Load tests from the ADVANZ Diagnostics PDF into the database'

    def handle(self, *args, **kwargs):
        pdf_path = "/home/ubuntu/labconnect/test.pdf"#'/data/data/com.termux/files/home/storage/documents/projects/labconnect/test.pdf'

        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                table = page.extract_table()
                if not table:
                    continue

                headers = table[0]
                rows = table[1:]

                for row in rows:
                    try:
                        # Map by header names (update index if needed)
                        test_id, department_name, test_code, test_name, cash_price, labs_price = row[:6]

                        if not test_name:
                            continue

                        department, _ = Department.objects.get_or_create(name=department_name.strip())

                        test, created = TestTemplate.objects.get_or_create(
                            name=test_name.strip(),
                            defaults={
                               # "department": department,
                                "test_code": test_code.strip() if test_code else None,
                                "price": Decimal(cash_price.replace(',', '')) if cash_price else 0,
                                "turn_around_time": "24 hours",  # or extract if available
                            }
                        )

                        if created:
                            self.stdout.write(self.style.SUCCESS(f"Added: {test_name}"))
                        else:
                            self.stdout.write(self.style.WARNING(f"Skipped existing: {test_name}"))

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Error on row {row}: {e}"))