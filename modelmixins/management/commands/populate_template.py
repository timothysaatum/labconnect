import random
from django.core.management.base import BaseCommand
from modelmixins.models import TestTemplate, SampleTypeTemplate
import json

class Command(BaseCommand):
    help = 'Generates test templates with real-world and random sample types.'

    def handle(self, *args, **kwargs):
        african_tests_json = """
        [
            {
                "test_code": "GLUCOSE_RANDOM",
                "name": "Random Blood Glucose",
                "price": 60.00,
                "turn_around_time": "1 hour",
                "patient_preparation": "No specific preparation required.",
                "sample_type": {
                    "sample_name": "Plasma",
                    "collection_procedure": "Collect blood in a fluoride oxalate tube.",
                    "sample_tube": "Gray top",
                    "collection_time": "Anytime",
                    "storage_requirements": "Store at 2-8°C.",
                    "transport_requirements": "Transport on ice.",
                    "collection_volume": 2.00,
                    "collection_instructions": "Prompt processing.",
                    "required_fasting": false,
                    "storage_temperature": "2-8°C",
                    "maximum_storage_duration": "24 hours",
                    "transport_medium": "Ice pack",
                    "packaging_requirements": "Biohazard bag.",
                    "biosafety_level": "BSL-1",
                    "infectious_risk": false
                },
                "discount_price": 50.00,
                "discount_percent": "16.7%",
                "test_status": "active"
            }
        ]
        """
        try:
            tests_data = json.loads(african_tests_json)
            for test_data in tests_data:
                sample_data = test_data.pop('sample_type')
                sample_type, created = SampleTypeTemplate.objects.get_or_create(**sample_data)

                test_template, created = TestTemplate.objects.get_or_create(
                    test_code=test_data['test_code'],
                    defaults={
                        'name': test_data['name'],
                        'price': test_data['price'],
                        'turn_around_time': test_data['turn_around_time'],
                        'patient_preparation': test_data['patient_preparation'],
                        'discount_price': test_data.get('discount_price'),
                        'discount_percent': test_data.get('discount_percent'),
                        'test_status': test_data.get('test_status', 'active'),
                    }
                )

                test_template.sample_type.set([sample_type]) # Corrected to use .set()

                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created test template: {test_template.name}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Test template already exists: {test_template.name}"))

        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Invalid JSON format in african_tests_json."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
