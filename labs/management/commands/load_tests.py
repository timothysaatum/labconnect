import os
import pdfplumber
from django.core.management.base import BaseCommand
from modelmixins.models import Department, TestTemplate
from decouple import config
from labs.utils import parse_price, infer_sample_types, guess_patient_preparation


ENV = config("DJANGO_ENV", default="development").lower()


class Command(BaseCommand):
    help = 'Load tests from PDF into the database'

    def handle(self, *args, **kwargs):
        
        pdf_path = "/home/ubuntu/labconnect/test.pdf" if ENV == "production" else "C:\\Users\\hashi\\Desktop\\tim\\labconnect\\test.pdf"

        if not os.path.exists(pdf_path):
            self.stdout.write(self.style.ERROR(f"PDF file not found at: {pdf_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"Using PDF at: {pdf_path}"))

        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                table = page.extract_table()
                if not table:
                    self.stdout.write(self.style.WARNING(f"No table found on page {page_num}"))
                    continue

                headers = table[0]
                rows = table[1:]

                for row in rows:
                    if len(row) < 6:
                        self.stdout.write(self.style.WARNING(f"Incomplete row skipped on page {page_num}: {row}"))
                        continue

                    try:
                        test_id, department_name, test_code, test_name, cash_price, labs_price = row[:6]

                        if not test_name:
                            self.stdout.write(self.style.WARNING(f"Row without test name skipped: {row}"))
                            continue

                        department, _ = Department.objects.get_or_create(name=department_name.strip())

                        test, created = TestTemplate.objects.get_or_create(
                            name=test_name.strip().title(),
                            defaults={
                                "test_code": test_code.strip() if test_code else None,
                                "price": parse_price(cash_price) if cash_price else 0,
                                "turn_around_time": "4 hours",
                                "department": department,
                                 "discount_price": parse_price(labs_price) if labs_price else None,
                                 "patient_preparation": guess_patient_preparation(test_name)
                            }
                        )

                        if not created:
                            # Optionally update department if it has changed
                            if test.department != department:
                                test.department = department
                                test.save()
                                self.stdout.write(self.style.SUCCESS(f"Updated department for: {test_name}"))
                
                            else:
                                self.stdout.write(self.style.WARNING(f"Skipped existing: {test_name}"))
                        else:
                            self.stdout.write(self.style.SUCCESS(f"Added: {test_name}"))
                        
                        sample_types = infer_sample_types(test_name)
                        test.sample_type.set(sample_types)
                        self.stdout.write(self.style.SUCCESS(f"Assigned sample types to {test_name}: {[s.sample_name for s in sample_types]}"))

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Error on row {row}: {e}"))