from django.db import models
import uuid
from django.core.validators import RegexValidator
code_validator = RegexValidator(
    regex=r"^[A-Z]{2}-\d{3,4}-\d{4,5}$",
    message="Format must be AA-XXXX-XXXX (e.g., XL-0745-0849)"
)
from .utils import calculate_distance


class BaseModel(models.Model):

	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


FACILITY_TYPE = [
      ('Laboratory', 'Laboratory'),
      ('Hospital', 'Hospital')
]
class Facility(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    facility_type = models.CharField(max_length=155, choices=FACILITY_TYPE)
    digital_address = models.CharField(max_length=15, unique=True, validators=[code_validator])
    gps_coordinates = models.CharField(max_length=100, null=True, blank=True)
    account_number = models.CharField(max_length=255, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    bank_code = models.CharField(max_length=155, blank=True, null=True)
    subaccount_id = models.CharField(max_length=155, blank=True, null=True)
    deleted_at = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
         unique_together = ("digital_address",)
    
    def get_facility_distance(self, user_lat, user_lon):
        """
        Calculate distance only if the instance has `gps_coordinates`.
        Works for both Branch and HospitalLab.
        """
        if not self.gps_coordinates:
            return None  # No coordinates, return None

        try:
            lat, lon = map(float, self.gps_coordinates.split(","))
            return int(calculate_distance(user_lat, user_lon, lat, lon))  # Convert to int
        except ValueError:
            return None  # Invalid GPS format

    def get_facility_name(self):

        if hasattr(self, 'hospital'):

            return f'{self.hospital.name} - {self.hospital.town}'

        elif hasattr(self, 'branch'):

            return f'{self.branch.laboratory.name} - {self.branch.town}'

        else:
            return self.hospitallab.name

    def __str__(self)->str:

        return self.get_facility_name()



class FacilityWorkingHours(models.Model):
    WEEKDAYS = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="working_hours")
    day = models.CharField(max_length=10, choices=WEEKDAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ("facility", "day")  # Ensures only one schedule per day per facility
        verbose_name_plural = "Working Hours"

    def __str__(self):
        return f"{self.facility} - {self.day}: {self.start_time} to {self.end_time}"


class SampleType(models.Model):

    '''
	Sample:Is the various medical samples that can be used to perform a particular test. 
	This is require to avoid sample mismatched when a test is being requested.
	'''
    sample_name = models.CharField(max_length=100)
    collection_procedure = models.TextField()
    sample_tube = models.CharField(max_length=100)
    collection_time = models.CharField(max_length=155)

    def __str__(self):
        return f"{self.sample_name} sample"


class BasicTest(BaseModel):

	STATUS_CHOICES = [
		('active', 'active'),
		('inactive', 'inactive')
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	test_code = models.CharField(max_length=100, null=True, blank=True)
	name = models.CharField(max_length=200, db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10)
	turn_around_time = models.CharField(max_length=200)
	patient_preparation = models.TextField(blank=True, null=True)
	sample_type = models.ManyToManyField(SampleType)
	test_status = models.CharField(max_length=10 ,choices=STATUS_CHOICES, default='active')

	class Meta:
		abstract = True
