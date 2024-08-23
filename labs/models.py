from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import validate_email# MinLengthValidator, MaxLengthValidator, 
import uuid
from hospital.models import Facility

user = get_user_model()

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
	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name = models.CharField(max_length=200)
	postal_address = models.CharField(max_length=255)
	main_phone = models.CharField(max_length=15)
	main_email = models.EmailField()
	website = models.URLField(blank=True, null=True)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)
	logo = models.ImageField(upload_to='labs/logo', default='logo.jpg')
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	description = models.TextField()

	class Meta:
		verbose_name_plural = 'Laboratories'
		unique_together = ('herfra_id', 'created_by')

	def __str__(self) -> str:
		return self.name


class Branch(Facility):
	'''
	A brach: is a local set up of a particular laboratory that carries out test within that enclave.
	Branch_name: refers to the name of a branch.
	'''
	branch_manager = models.ForeignKey(user, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE, related_name='branches')	

	class Meta:

		verbose_name_plural = 'Branches'

	def __str__(self) -> str:

		return f'{self.laboratory.name} - {self.town}'


class SampleType(models.Model):

	'''
	Sample:Is the various medical samples that can be used to perform a particular test. 
	This is require to avoid sample mismatched when a test is being requested.
	'''
	sample_name = models.CharField(max_length=100)
	collection_procedure = models.TextField()
	collection_time = models.CharField(max_length=155)

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
	STATUS_CHOICES = [
		('active', 'active'),
		('inactive', 'inactive')
	]
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	test_code = models.CharField(max_length=100, null=True, blank=True)
	name = models.CharField(max_length=200, db_index=True)
	branch = models.ManyToManyField(Branch, related_name='tests', db_index=True, through='BranchTest')
	price = models.DecimalField(decimal_places=2, max_digits=10)
	discount_price = models.DecimalField(decimal_places=2, max_digits=10)
	discount_percent = models.CharField(max_length=10)
	turn_around_time = models.CharField(max_length=200)
	patient_preparation = models.TextField(blank=True, null=True)
	sample_type = models.ManyToManyField(SampleType)
	test_status = models.CharField(max_length=10 ,choices=STATUS_CHOICES, default='active')

	def __str__(self) -> str:

		return self.name

	def laboratory(self) -> list:

		return [branch for branch in self.branch.all()]


class BranchTest(models.Model):
	STATUS_CHOICES = [
		('active', 'active'),
		('inactive', 'inactive')
	]
	test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='branch_test')
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
	test_status = models.CharField(max_length=10 ,choices=STATUS_CHOICES, default='active')
	price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
	discount_price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
	discount_percent = models.CharField(max_length=10, blank=True, null=True)
	turn_around_time = models.CharField(max_length=200, blank=True, null=True)

	class Meta:
		verbose_name_plural = 'Branch Tests'

	def __str__(self) -> str:
		return self.test.name


class BranchManagerInvitation(BaseModel):

	invitation_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
	sender = models.ForeignKey(user, on_delete=models.CASCADE)
	receiver_email = models.EmailField(validators=[validate_email])
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
	used = models.BooleanField(default=False)

	def __str__(self):
		return str(self.sender)


class Result(models.Model):

	'''
	A test result that can be generated in a branch within a lab:

	attrs:
	branch(str): The branch where this test result belongs to.
	test(str): The test this results belong to.
	'''

	send_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='sender',  db_index=True)
	hospital = models.ForeignKey('hospital.Hospital', on_delete=models.CASCADE, related_name='results', db_index=True)
	sample = models.ForeignKey('sample.Sample', on_delete=models.CASCADE, db_index=True)
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='results', db_index=True)
	test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results', db_index=True)
	result = models.FileField(upload_to='labs/results')
	comments = models.TextField(blank=True, null=True)
	is_verified = models.BooleanField(default=False)
	is_received = models.BooleanField(default=False)
	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	def __str__(self) -> str:
		return str(self.branch)