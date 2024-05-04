from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator
user = get_user_model()



class BaseModel(models.Model):

	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	class Meta:
		abstract = True


class Laboratory(BaseModel):

	'''
	A laboratory where tests are conducted.

	Attrs:
	name(str): the name of the laboratory
	'''

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

	def __str__(self):

		return f'{self.laboratory} | {self.branch_name}'



class Test(BaseModel):

	'''
	A test than can be conducted in a branch.
	Attrs:
	branch(Branch): The branch that this test belongs to.
	name(str): The name of the test.
	price(float): The price of the test.
	dicount_price (float, optional): The discounted price of the test.
	'''

	test_code = models.CharField(max_length=100)
	name = models.CharField(max_length=200, db_index=True)
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='tests', db_index=True)
	price = models.DecimalField(decimal_places=2, max_digits=10)
	turn_around_time = models.DurationField(default='2 hours')
	patient_preparation = models.TextField()

	class Meta:
		unique_together = ('branch', 'name')

	def __str__(self):

		return f'{self.name} | {self.price}ghs | {turn_around_time}'

	def laboratory(self):

		return self.branch
