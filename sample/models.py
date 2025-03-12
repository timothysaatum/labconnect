from django.db import models
from labs.models import Test
from modelmixins.models import Facility
from modelmixins.models import SampleType
from delivery.models import Delivery
from django.contrib.auth import get_user_model
from encrypted_model_fields.fields import (
    EncryptedCharField,
    EncryptedTextField,
    EncryptedBooleanField,
)
from django.core.exceptions import ValidationError
import uuid
import random, string
import datetime
from simple_history.models import HistoricalRecords



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
    ("Request Made", "Request Made"),
    ("Request Terminated", "Request Terminated"),
    ("Request Accepted", "Request Accepted"),
    ("Delivery Pick-up", "Delivery Pick-up"),
    ("Request Completed", "Request Completed"),
    ("Sample Received", "Sample Received"),
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

def referral_attachment_upload_path(instance, filename):
    """Generate file upload path for attachments"""
    return f"referrals/{instance.referral_id}/{filename}"


def validate_attachment(value):
    allowed_types = ["image/jpeg", "image/png", "application/pdf"]
    if value.content_type not in allowed_types:
        raise ValidationError("Only JPEG, PNG, and PDF files are allowed.")

class Referral(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referral_id = models.CharField(max_length=50, unique=True, editable=False, default=generate_referral_id)
    referring_facility = models.ForeignKey(
        Facility, on_delete=models.CASCADE, related_name="referrals", db_index=True
    )
    facility_type = models.CharField(max_length=255, choices=REFERRING_FACILITY_TYPE)
    patient_name = EncryptedCharField(max_length=200)
    patient_age = EncryptedCharField(max_length=10)
    patient_sex = EncryptedCharField(max_length=20, choices=PATIENT_SEX)
    clinical_history = EncryptedTextField(null=True, blank=True)
    to_laboratory = models.ForeignKey(Facility, on_delete=models.CASCADE, db_index=True)
    delivery = models.ForeignKey(
        Delivery, on_delete=models.SET_NULL, null=True, blank=True, db_index=True
    )
    referral_attachment = models.FileField(upload_to=referral_attachment_upload_path, null=True, blank=True, validators=[validate_attachment])
    attachment = EncryptedCharField(max_length=500, null=True, blank=True)
    requires_phlebotomist = EncryptedBooleanField(default=False)
    sender_full_name = EncryptedCharField(max_length=200, null=True, blank=True)
    sender_phone = EncryptedCharField(max_length=20, null=True, blank=True)
    sender_email = EncryptedCharField(max_length=100, null=True, blank=True)
    referral_status = models.CharField(max_length=100, choices=REQUEST_STATUS)
    date_referred = models.DateTimeField(auto_now_add=True, db_index=True)
    is_completed = models.BooleanField(default=False, db_index=True)
    is_archived = models.BooleanField(default=False, db_index=True)
    history = HistoricalRecords()

    def __str__(self):
        return self.patient_name


class Sample(models.Model):
    REJECTION_REASONS = [
        (1, "Incorrect Patient Identification"),
        (2, "Improper Labeling"),
        (3, "Hemolysis"),
        (4, "Clotted Samples"),
        (5, "Insufficient Sample Volume"),
        (6, "Contaminated Samples"),
        (7, "Improper Storage and Transport"),
        (8, "Wrong Collection Tube or Container"),
        (9, "Lipemia"),
        (10, "Delayed Processing"),
        (11, "Improper pH or Dilution"),
        (12, "Microbial Contamination"),
        (13, "Leaking or Damaged Containers"),
        (14, "Mismatched Test Request and Sample Type"),
        (15, "Coagulated CSF or Synovial Fluid")
    ]

    referral = models.ForeignKey(
        Referral, related_name="samples", on_delete=models.CASCADE, db_index=True
    )
    sample_type = models.ForeignKey(SampleType, on_delete=models.CASCADE)  # e.g., EDTA, gel tube
    sample_status = models.CharField(
        max_length=50, choices=SAMPLE_STATUS, default="Pending", db_index=True
    )
    rejection_reason = models.TextField(blank=True, null=True)
    rejection_reason_code = models.JSONField(default=list, blank=True, null=True)
    date_collected = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.referral.referral_id
   

    def get_rejection_reason(self):
        """Returns human-readable rejection reasons."""
        if self.rejection_reason_code:
            reasons = [dict(self.REJECTION_REASONS).get(code, f"Unknown ({code})") for code in self.rejection_reason_code]
            return ", ".join(reasons)
        return self.rejection_reason


class SampleTest(models.Model):

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_index=True
    )
    sample = models.ForeignKey(Sample, related_name='sample_tests', on_delete=models.CASCADE, db_index=True)
    test = models.ForeignKey(Test, related_name='tests', on_delete=models.CASCADE, db_index=True)
    status = models.CharField(
        max_length=50, choices=TEST_STATUS, default="Pending", db_index=True
    )  # Status of the test
    test_result = models.FileField(upload_to=referral_attachment_upload_path, null=True, blank=True, validators=[validate_attachment])
    result = EncryptedCharField(
        max_length=500, null=True, blank=True
    )  # To store test result (optional)
    date_completed = models.DateTimeField(null=True, blank=True)  # When the test was completed

    def __str__(self):
        return f"{self.test.name} - Status: {self.status}"


class ReferralTrackingHistory(models.Model):

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_index=True
    )
    referral = models.ForeignKey(
        Referral, related_name="referral_history", on_delete=models.CASCADE, db_index=True
    )
    status = models.CharField(max_length=50, choices=REQUEST_STATUS, db_index=True)
    location = EncryptedCharField(max_length=500, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Referral Trackings'

    def __str__(self) -> str:
        return self.status


class SampleTrackingHistory(models.Model):

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_index=True
    )
    sample = models.ForeignKey(
        Sample, related_name="sample_history", on_delete=models.CASCADE, db_index=True
    )
    status = models.CharField(max_length=50, choices=SAMPLE_STATUS, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Sample Trackings'

    def __str__(self) -> str:
        return self.status


class Notification(models.Model):

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, db_index=True)
    title = EncryptedCharField(max_length=200)
    message = EncryptedCharField(max_length=150)
    is_read = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.facility)
