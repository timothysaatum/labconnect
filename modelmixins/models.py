from django.db import models
import uuid


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
    # calendar = models.DurationField(blank=True, null=True)
    email = models.EmailField()
    facility_type = models.CharField(max_length=155, choices=FACILITY_TYPE)
    account_number = models.CharField(max_length=255, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    bank_code = models.CharField(max_length=155, blank=True, null=True)
    subaccount_id = models.CharField(max_length=155, blank=True, null=True)
    deleted_at = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    
    def account_number_has_changed(self):
        if not self.pk:
            return False  # New instance
        
        old_account_number = Facility.objects.filter(pk=self.pk).values_list('account_number', flat=True).first()
        
        return old_account_number != self.account_number

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
