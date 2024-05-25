from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator, validate_email
user = get_user_model()
from delivery.models import Delivery
import uuid
from django.utils import timezone



class BaseModel(models.Model):

	date_added = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class Laboratory(BaseModel):

	'''
	A laboratory where tests are conducted.

	Attrs:
	name(str): the name of the laboratory
	'''
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	created_by = models.ForeignKey(user, on_delete=models.CASCADE, db_column='General manager', db_index=True)
	laboratory_name = models.CharField(max_length=200, db_index=True, validators=[MinLengthValidator(10), MaxLengthValidator(200)])
	main_phone = models.CharField(max_length=15)
	main_email = models.EmailField()
	logo = models.ImageField(upload_to='labs/logo', default='logo.png')
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	website = models.URLField(null=True, blank=True)
	description = models.TextField()

	def __str__(self) -> str:
		return self.laboratory_name

	class Meta:
		verbose_name_plural = 'Laboratories'
		unique_together = ('laboratory_name', )


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


class Branch(BaseModel):
	'''
	A brach: is a local set up of a particular laboratory that carries out test within that enclave.
	Branch_name: refers to the name of a branch.
	'''

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
	branch_manager = models.ForeignKey(user, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE, related_name='branches')
	branch_name = models.CharField(max_length=255)
	branch_phone = models.CharField(max_length=15)
	branch_email = models.CharField(max_length=150)
	location = models.CharField(max_length=255)
	digital_address = models.CharField(max_length=15)
	region = models.CharField(choices=REGIONS, max_length=100)

	class Meta:

		verbose_name_plural = 'Branches'

	def __str__(self) -> str:

		return self.branch_name

class SampleType(models.Model):
	sample_name = models.CharField(max_length=100)

	def __str__(self):
		return self.sample_name


class Test(BaseModel):

	'''
	A test than can be conducted in a branch.
	Attrs:
	branch(Branch): The branch that this test belongs to.
	name(str): The name of the test.
	price(float): The price of the test.
	dicount_price (float, optional): The discounted price of the test.
	'''

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	test_code = models.CharField(max_length=100)
	name = models.CharField(max_length=200, db_index=True)
	branch = models.ManyToManyField(Branch, related_name='tests', db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10)
	turn_around_time = models.CharField(max_length=200)
	patient_preparation = models.TextField()
	sample_type = models.ManyToManyField(SampleType)

	def __str__(self) -> str:

		return self.name

	def laboratory(self) -> str:

		return self.name



class LaboratorySample(BaseModel):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	send_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name_of_patient = models.CharField(max_length=200)
	patient_age = models.DateField()
	patient_sex = models.CharField(max_length=20)
	sample_type = models.CharField(max_length=200)
	delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, null=True, blank=True, db_index=True)
	to_lab = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='lab_samples', db_index=True)
	tests = models.ManyToManyField(Test, related_name='tests_requested')
	from_lab = models.ForeignKey(Branch, on_delete=models.CASCADE, db_index=True)
	brief_description = models.TextField(null=True, blank=True)
	attachment = models.FileField(upload_to='sample/attachments', blank=True, null=True)
	is_rejected = models.BooleanField(default=False)
	rejection_reason = models.TextField(blank=True, null=True)
	is_paid = models.BooleanField(default=False)
	is_received_by_delivery = models.BooleanField(default=False)
	is_delivered_to_lab = models.BooleanField(default=False)
	is_accessed_by_lab = models.BooleanField(default=False)

	def __str__(self) -> str:
		return self.sample_type

	def sender_phone(self) -> str:
		return self.from_lab.branch_phone

	def dispatched_time(self):
		return self.date_added

	def email(self):
		return self.from_lab.branch_email



class BranchManagerInvitation(BaseModel):

	invitation_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
	sender = models.ForeignKey(user, on_delete=models.CASCADE)
	receiver_email = models.EmailField(validators=[validate_email])
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
	used = models.BooleanField(default=False)

	def __str__(self):
		return str(self.sender)
