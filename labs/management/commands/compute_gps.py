from django.core.management.base import BaseCommand
from labs.models import Branch
from modelmixins.utils import get_gps_coords

class Command(BaseCommand):
    help = "Recalculate GPS coordinates for labs with missing coordinates"

    def handle(self, *args, **kwargs):
        labs_with_missing_gps = Branch.objects.filter(gps_coordinates__isnull=True)
        total_labs = labs_with_missing_gps.count()

        if not total_labs:
            self.stdout.write("No labs with missing GPS coordinates found.")
            return

        self.stdout.write(f"Found {total_labs} labs with missing GPS coordinates.")
        for lab in labs_with_missing_gps:
            try:
                latitude, longitude = get_gps_coords(lab.digital_address, sync=True)  # Sync mode
                if latitude is not None and longitude is not None:
                    lab.gps_coordinates = f"{latitude}, {longitude}"
                    lab.save(update_fields=['gps_coordinates'])
                    self.stdout.write(f"Updated lab {lab.id} with GPS: {latitude}, {longitude}")
                else:
                    self.stdout.write(f"Failed to calculate GPS for lab: {lab.id}")
            except Exception as e:
                self.stderr.write(f"Error processing lab {lab.id}: {e}")

        self.stdout.write("GPS recalculation process completed.")
