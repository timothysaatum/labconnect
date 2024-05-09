from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator
user = get_user_model()
from delivery.models import Delivery
import uuid



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
	created_by = models.ForeignKey(user, on_delete=models.CASCADE, db_column='General manager')
	laboratory_name = models.CharField(max_length=200, db_index=True, validators=[MinLengthValidator(10), MaxLengthValidator(200)])
	main_phone = models.CharField(max_length=15)
	main_email = models.EmailField()
	logo = models.ImageField(upload_to='labs/logo', default='logo.png')
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	website = models.URLField()
	description = models.TextField()

	def __str__(self):
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

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	branch_manager = models.ForeignKey(user, on_delete=models.CASCADE)
	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE, related_name='branches')
	branch_name = models.CharField(max_length=255)
	branch_phone = models.CharField(max_length=15)
	branch_email = models.CharField(max_length=150)
	location = models.CharField(max_length=255)
	digital_address = models.CharField(max_length=15)
	region = models.CharField(choices=REGIONS, max_length=100)

	class Meta:

		verbose_name_plural = 'Branches'

	def __str__(self) ->str:

		return self.branch_name



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
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='tests', db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10)
	turn_around_time = models.DurationField(default='2 hours')
	patient_preparation = models.TextField()

	def __str__(self):

		return f'Code: {self.test_code} | Price: {self.price}ghs | turn arount time: {self.turn_around_time}'

	def laboratory(self):

		return self.branch



class LaboratorySample(BaseModel):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	send_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name_of_patient = models.CharField(max_length=200)
	patient_age = models.PositiveIntegerField()
	patient_sex = models.CharField(max_length=20)
	sample_type = models.CharField(max_length=200)
	delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, null=True, blank=True)
	to_lab = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='lab_samples', db_index=True)
	tests = models.ManyToManyField(Test, related_name='tests_requested')
	from_lab = models.ForeignKey(Branch, on_delete=models.CASCADE)
	brief_description = models.TextField(null=True, blank=True)
	attachment = models.FileField(upload_to='sample/attachments', blank=True, null=True)
	is_rejected = models.BooleanField(default=False)
	rejection_reason = models.TextField(blank=True, null=True)
	is_paid = models.BooleanField(default=False)
	is_received_by_delivery = models.BooleanField(default=False)
	is_delivered_to_lab = models.BooleanField(default=False)
	is_access_by_lab = models.BooleanField(default=False)

	def __str__(self):
		return f'{self.sample_type} | {self.from_lab}'


	def sender_phone(self):
		return from_lab.branch_phone


	def dispatched_time(self):
		return self.date_added


	def email(self):
		return self.branch_email