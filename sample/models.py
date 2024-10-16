from django.db import models
from labs.models import Branch, Test
from modelmixins.models import Facility
from modelmixins.models import SampleType
# from modelmixins.encryption import AESEncryptedField, FernetEncryptedField
from delivery.models import Delivery
from django.contrib.auth import get_user_model
# from django_cryptography.fields import encrypt
import uuid
import random, string
import datetime


client = get_user_model()


PATIENT_SEX = [
	('Male', 'Male'),
	('Female', 'Female')
]

PHLEBOTOMIST_REQUIREMENTS = [
	('Yes', 'Yes'),
	('No', 'No')
]

REPORT_DELIVERY_MODE = [
	('hard_copy', 'Hard Copy'),
	('soft_copy', 'Soft Copy')
]

REFERRING_FACILITY_TYPE = [
	('Laboratory', 'Laboratory'),
	('Hospital', 'Hospital')
]

SAMPLE_STATUS = [
	('Pending', 'Pending'),
	('Received', 'Received'),
	('Rejected', 'Rejected')
]

TEST_STATUS = [
    ("Not Initialized", "Not Initialized"),
    ("Pending Results Upload", "Pending Results Upload"),
    ("Completed", "Completed"),
]

REQUEST_STATUS = [
	('Request Made', 'Request Made'),
    ('Request Accepted', 'Request Accepted'),
	('Sample Received by Delivery', 'Sample Received by Delivery'),
	('Sample Received by Lab', 'Sample Received by Lab'),
	('Request Completed', 'Request Completed')
]

def generate_referral_id():
    '''
    Generates a unique id that comprises: SAM-24-10-2V5
    '''
    date_part = datetime.datetime.now().strftime('%y-%m')

    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))

    referral_id = f"SAM-{date_part}-{random_part}"

    return referral_id

class Patient(models.Model):
    '''
    This Table holds information about the patient including their insuarance
    '''
    patient_id = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    contact_number = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField(null=True, blank=True)
    health_insuarance = models.CharField(max_length=255)
    def __str__(self) -> str:
        return self.full_name


class Referral(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referral_id = models.CharField(max_length=50, unique=True, editable=False, default=generate_referral_id)
    referring_facility = models.ForeignKey(
        Facility, on_delete=models.CASCADE, related_name="referrals", db_index=True
    )
    facility_type = models.CharField(max_length=255, choices=REFERRING_FACILITY_TYPE)
    patient_name = models.CharField(max_length=200)
    patient_age = models.CharField(max_length=10)
    patient_sex = models.CharField(max_length=20, choices=PATIENT_SEX)
    clinical_history = models.TextField(null=True, blank=True)
    to_laboratory = models.ForeignKey(Facility, on_delete=models.CASCADE, db_index=True)
    delivery = models.ForeignKey(
        Delivery, on_delete=models.SET_NULL, null=True, blank=True, db_index=True
    )
    attachment = models.URLField(null=True, blank=True)
    requires_phlebotomist = models.BooleanField(default=False)
    sender_full_name = models.CharField(max_length=200, null=True, blank=True)
    sender_phone = models.CharField(max_length=20, null=True, blank=True)
    sender_email = models.EmailField(null=True, blank=True)
    referral_status = models.CharField(max_length=100, choices=REQUEST_STATUS)
    date_referred = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Referral for {self.patient_name}"


class Sample(models.Model):
    referral = models.ForeignKey(
        Referral, related_name="samples", on_delete=models.CASCADE, db_index=True
    )
    sample_type = models.ForeignKey(SampleType, on_delete=models.CASCADE)  # e.g., EDTA, gel tube
    sample_status = models.CharField(
        max_length=50, choices=SAMPLE_STATUS, default="Pending", db_index=True
    )
    rejection_reason = models.TextField(blank=True, null=True)
    date_collected = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sample_type} Sample: {self.referral.patient_name}"


class SampleTest(models.Model):

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_index=True
    )
    sample = models.ForeignKey(Sample, related_name='sample_tests', on_delete=models.CASCADE, db_index=True)
    test = models.ForeignKey(Test, related_name='sample_tests', on_delete=models.CASCADE, db_index=True)
    status = models.CharField(
        max_length=50, choices=TEST_STATUS, default="Pending", db_index=True
    )  # Status of the test
    result = models.URLField(blank=True, null=True)  # To store test result (optional)
    date_completed = models.DateTimeField(null=True, blank=True)  # When the test was completed

    def __str__(self):
        return f"{self.test.name} - Status: {self.status}"


class SampleTrackingHistory(models.Model):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
	sample = models.ForeignKey(Sample, related_name="tracking_history", on_delete=models.CASCADE, db_index=True)
	status = models.CharField(max_length=50, choices=REQUEST_STATUS, db_index=True)
	location = models.CharField(max_length=255, null=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name_plural = 'Sample Trackings'

	def __str__(self) -> str:
		return self.status


class Notification(models.Model):

	facility = models.ForeignKey(Facility, on_delete=models.CASCADE, db_index=True)
	title = models.CharField(max_length=200)
	message = models.CharField(max_length=150)
	is_read = models.BooleanField(default=False)
	is_hidden = models.BooleanField(default=False)
	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return (f'{self.facility.branch.town} - {self.facility.branch.laboratory.name}' if self.facility.branch 
		  else self.facility.hospital)
