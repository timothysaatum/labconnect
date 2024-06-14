from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator, validate_email
import uuid
from hospital.models import Facility
from django.core.exceptions import ValidationError

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
	logo = models.ImageField(upload_to='labs/logo', default='logo.png')
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	description = models.TextField()

	class Meta:
		verbose_name_plural = 'Laboratories'
		unique_together = ('herfra_id', 'created_by')

	def __str__(self) -> str:
		return self.name
	
	#def save(self, *args, **kwargs):
	#	if not self.pk and Laboratory.objects.filter(created_by=self.created_by).exists():
	#		raise ValidationError('You can only have one laboratory.')
	#	return super().save(*args, **kwargs)


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

		return self.name


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

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	test_code = models.CharField(max_length=100)
	name = models.CharField(max_length=200, db_index=True)
	branch = models.ManyToManyField(Branch, related_name='tests', db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10)
	turn_around_time = models.CharField(max_length=200)
	patient_preparation = models.TextField(blank=True, null=True)
	sample_type = models.ManyToManyField(SampleType)

	def __str__(self) -> str:

		return self.name

	def laboratory(self) -> list:

		return [branch for branch in self.branch.all()]



class BranchManagerInvitation(BaseModel):

	invitation_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
	sender = models.ForeignKey(user, on_delete=models.CASCADE)
	receiver_email = models.EmailField(validators=[validate_email])
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
	used = models.BooleanField(default=False)

	def __str__(self):
		return str(self.sender)
