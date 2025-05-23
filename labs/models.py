from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
import uuid
from modelmixins.models import Facility, BasicTest, BaseModel
from modelmixins.utils import calculate_distance
from django.core.validators import RegexValidator


user = get_user_model()


code_validator = RegexValidator(
    regex=r"^[A-Z]{2}-\d{4}-\d{4}$",
    message="Format must be AA-XXXX-XXXX (e.g., XL-0745-0849)"
)

class Laboratory(BaseModel):

	'''
	An institution where tests are conducted. A laboratory can have multiple branches

	Attrs:
	name(str): the name of the laboratory
	'''
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	created_by = models.OneToOneField(user, on_delete=models.CASCADE)
	name = models.CharField(max_length=200, unique=True)
	account_number = models.CharField(max_length=255, blank=True, null=True)
	bank_name = models.CharField(max_length=255, blank=True, null=True)
	bank_code = models.CharField(max_length=155, blank=True, null=True)
	subaccount_id = models.CharField(max_length=155, blank=True, null=True)
	main_phone = models.CharField(max_length=15)
	main_email = models.EmailField()
	website = models.URLField(blank=True, null=True, unique=True)
	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)
	lab_logo = models.ImageField(upload_to='logos/', blank=True, null=True)
	logo = models.URLField()
	description = models.CharField(max_length=900)

	class Meta:
		verbose_name_plural = 'Laboratories'
		unique_together = ('created_by', 'name', 'website')

	def account_number_has_changed(self):
		if not self.pk:
			return False  # New instance
		print('Executing!!!')
		old_account_number = Laboratory.objects.filter(pk=self.pk).values_list('account_number', flat=True).first()
		print(old_account_number)
		print(old_account_number != self.account_number)
		return old_account_number != self.account_number

	def __str__(self) -> str:
		return self.name


REGIONS = [

	('Northern', 'Northern'),
	('Upper West', 'Upper West'),
	('Upper East', 'Upper East'),
	('Savannah', 'Savannah'),
	('Bono', 'Bono'),
	('Greater Accra', 'Greater Accra'),
	('Western', 'Western'),
	('Central', 'Central'),
	('Volta', 'Volta'),
	('North East', 'North East'),
	('Bono East', 'Bono East'),
	('Oti', 'Oti'),
	('Ashanti', 'Ashanti'),

]

LEVEL_CHOICES = [
    ("Basic", "Basic"),
    ("Primary", "Primary"),
    ("Secondary", "Secondary"),
    ("Tertiary", "Tertiary"),
]


ACCREDITATION_BODIES = [
    # Ghana-specific accreditation bodies
    ("HeFRA", "Health Facilities Regulatory Agency (HeFRA) - Ghana"),
    ("GSA", "Ghana Standards Authority (GSA)"),
    ("GHS", "Ghana Health Service (GHS)"),
    # African accreditation bodies
    ("SANAS", "South African National Accreditation System (SANAS)"),
    ("NAFDAC", "National Agency for Food and Drug Administration and Control - Nigeria"),
    # International accreditation bodies
    ("ISO", "ISO 15189 Medical Laboratories"),
    ("WHO", "World Health Organization (WHO)"),
    ("ILAC", "International Laboratory Accreditation Cooperation (ILAC)")
]

class Branch(Facility):
	"""
    A branch: is a local set up of a particular laboratory that carries out test within that enclave.
    Branch_name: refers to the name of a branch.
    """
	accreditation_number = models.CharField(max_length=155, unique=True)
	issuing_body = models.CharField(max_length=255, null=True, blank=True, choices=ACCREDITATION_BODIES)
	expiry_date = models.DateField(null=True, blank=True)
	accreditation_certificate = models.FileField(upload_to='accreditation_documents/', null=True, blank=True)
	level = models.CharField(max_length=100, db_index=True, choices=LEVEL_CHOICES)
	branch_name = models.CharField(max_length=155, blank=True)
	region = models.CharField(choices=REGIONS, max_length=100)
	town = models.CharField(max_length=200)
    # digital_address = models.CharField(max_length=15, unique=True, validators=[code_validator])
    # gps_coordinates = models.CharField(max_length=100, null=True, blank=True)
	branch_manager = models.ForeignKey(
        user, on_delete=models.SET_NULL, null=True, blank=True, db_index=True
    )
	laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE, related_name="branches"
    )
	workers = models.ManyToManyField(
        user, related_name='work_branches', db_index=True
    )

	class Meta:
		verbose_name_plural = "Branches"
		unique_together = ("accreditation_number", "branch_name")
        
	def get_branch_distance(self, user_lat, user_lon):
        
		if self.gps_coordinates:
            
			branch_lat, branch_long = map(float, self.gps_coordinates.split(","))
			d = int(calculate_distance(user_lat, user_lon, branch_lat, branch_long))
			print(d)
            
		return d
        
	def __str__(self) -> str:
        
		return f"{self.laboratory.name} - {self.town}"


class Test(BasicTest):

	'''
	A test that can be conducted in a branch of a laboratory.
	Attrs:
	branch(Branch): The branch that this test belongs to.
	name(str): The name of the test.
	price(float): The price of the test.
	dicount_price (float, optional): The discounted price of the test.
	'''
	discount_price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
	discount_percent = models.CharField(max_length=10, blank=True, null=True)
	branch = models.ManyToManyField(Branch, related_name='tests', db_index=True, through='BranchTest')

	def active_tests(self):
		"""
        Returns all active tests for this branch.
        """
		return self.tests.filter(branch_test__test_status='active').distinct()


	def __str__(self) -> str:

		return self.name

	def laboratory(self) -> list:

		return [branch for branch in self.branch.all()]


class BranchTest(models.Model):

	STATUS_CHOICES = [
		('active', 'active'),
		('inactive', 'inactive')
	]

	test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='branch_test', db_index=True)
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, db_index=True)
	test_status = models.CharField(max_length=10 ,choices=STATUS_CHOICES, default='active', db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
	discount_price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
	discount_percent = models.CharField(max_length=10, blank=True, null=True)
	turn_around_time = models.CharField(max_length=200, blank=True, null=True)


	class Meta:
		verbose_name_plural = 'Branch Tests'
		unique_together = ('branch', 'test')

	@staticmethod
	def get_active_tests_for_branch(branch_id):
		"""
        Returns active tests for a given branch ID.
        """
		return BranchTest.objects.filter(branch_id=branch_id, test_status='active')

	@staticmethod
	def get_discounted_tests_for_branch(branch_id):
		"""
        Returns tests with discounts for a given branch ID.
        """
		return BranchTest.objects.filter(branch_id=branch_id).exclude(discount_price__isnull=True)

	def __str__(self) -> str:
		return self.test.name


class BranchManagerInvitation(BaseModel):

	invitation_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
	sender = models.ForeignKey(user, on_delete=models.CASCADE, db_index=True)
	receiver_email = models.EmailField(validators=[validate_email])
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, db_index=True)
	used = models.BooleanField(default=False)

	def mark_as_used(self):
		"""
        Marks the invitation as used.
        """
		self.used = True
		self.save(update_fields=['used'])

	def __str__(self):
		return str(self.sender)
