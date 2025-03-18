from django.db import models
import uuid
from django.core.validators import RegexValidator
code_validator = RegexValidator(
    r"^[A-Z]{2}-\d{3,5}-\d{4,5}$",
    message="Format must be AA-XXXX-XXXX (e.g., XL-0745-0849)"
)
from user.models import Client
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



class Department(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    branch = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="departments")
    head_of_department = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('name', 'branch')  # Ensures a department name is unique within a branch

    def __str__(self):
        return f"{self.name} - {self.branch.name}"



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


class BaseSample(models.Model):
    sample_name = models.CharField(max_length=100)
    collection_procedure = models.TextField()
    sample_tube = models.CharField(max_length=100)
    collection_time = models.CharField(max_length=155, blank=True, null=True)
    storage_requirements = models.TextField(blank=True, null=True)
    transport_requirements = models.TextField(blank=True, null=True)
    collection_volume = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    collection_instructions = models.TextField(blank=True, null=True)
    required_fasting = models.BooleanField(default=False)
    storage_temperature = models.CharField(max_length=50, blank=True, null=True)
    maximum_storage_duration = models.CharField(max_length=50, blank=True, null=True)
    transport_medium = models.CharField(max_length=100, blank=True, null=True)
    packaging_requirements = models.TextField(blank=True, null=True)
    biosafety_level = models.CharField(
        max_length=10,
        choices=[('BSL-1', 'BSL-1'), ('BSL-2', 'BSL-2'), ('BSL-3', 'BSL-3')],
        blank=True,
        null=True
    )
    infectious_risk = models.BooleanField(default=True)

class SampleType(BaseSample):

    '''
	Sample:Is the various medical samples that can be used to perform a particular test.
	This is require to avoid sample mismatched when a test is being requested.
	'''
    

    def __str__(self):
        return f"{self.sample_name} sample"


class BasicTest(BaseModel):

	STATUS_CHOICES = [
		('active', 'active'),
		('inactive', 'inactive')
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
	test_code = models.CharField(max_length=100, null=True, blank=True)
	name = models.CharField(max_length=200, db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10)
	turn_around_time = models.CharField(max_length=200)
	patient_preparation = models.TextField(blank=True, null=True)
	sample_type = models.ManyToManyField(SampleType)
	test_status = models.CharField(max_length=10 ,choices=STATUS_CHOICES, default='active')

	class Meta:
		abstract = True


class SampleTypeTemplate(BaseSample):
    
    def __str__(self):
        return f"{self.sample_name} sample"
    

class TestTemplate(BasicTest):
    """
    A master list of predefined tests that users can use as templates 
    when creating tests.
    """
    sample_type = models.ManyToManyField(SampleTypeTemplate)
    discount_price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
    discount_percent = models.CharField(max_length=10, blank=True, null=True)
    
    def __str__(self):
        return self.name