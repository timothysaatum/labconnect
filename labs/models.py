from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, MaxLengthValidator
user = get_user_model()



class BaseModel(models.Model):

	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	class Meta:
		abstract = True




#REGIONS = [
#	('NR', 'Northern Region')
#]
#class Branch(BaseModel):
#
#	name = models.CharField(max_length=255)
#	manager = models.ForeignKey(user, on_delete=models.CASCADE)
#	location = models.CharField(max_length=255)
#	region = models.CharField(choices=REGIONS, max_length=100)
#	laboratory = models.ForeignKey('Laboratory', on_delete=models.CASCADE)
#
#
#	def __str__(self):
#		return self.branch_name



class Laboratory(BaseModel):

	'''
	A laboratory where tests are conducted.

	Attrs:
	name(str): the name of the laboratory
	'''

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	name = models.CharField(max_length=200, db_index=True, validators=[MinLengthValidator(10), MaxLengthValidator(200)])
	region_of_location = models.CharField(max_length=255)
	town_of_location = models.CharField(max_length=255)
	logo = models.ImageField(upload_to='labs/logo', default='logo.png')
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	website = models.URLField()
	description = models.TextField()

	def __str__(self):
		return f'{self.name} {self.town_of_location}({self.region_of_location})'


	class Meta:
		verbose_name_plural = 'Laboratories'
		unique_together = ('name', )



DEPARTMENT_NAME = [

	('Haematology', 'Haematology'),
	('Microbiology', 'Microbiology'),
	('Parasitology', 'Parasitology'),
	('Clinical Chemistry', 'Clinical Chemistry'),
	('Molecular Biology', 'Molecular Biology')

]

class Department(BaseModel):

	'''
	A department within a laboratory.

	Attrs:
	laboratory(Laboratory): The laboratory that this department belongs to.
	department_name(str): The name of the department.
	'''

	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE, related_name='departments', db_index=True)
	heard_of_department = models.CharField(max_length=200)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	department_name = models.CharField(choices=DEPARTMENT_NAME, max_length=100, db_index=True)

	class Meta:
		unique_together = ('laboratory', 'department_name')


	def __str__(self):
		return self.department_name


	def tests(self):

		lab_tests = [test for test in Test.objects.filter(department=self.id)]

		return lab_tests

	def laboratory_name(self):

		return self.laboratory


class Test(BaseModel):

	'''
	A test than can be conducted in a department.
	Attrs:
	department(Department): The department that this test belongs to.
	name(str): The name of the test.
	price(float): The price of the test.
	dicount_price (float, optional): The discounted price of the test.
	'''

	department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='tests', db_index=True)
	name = models.CharField(max_length=200, db_index=True)
	price = models.FloatField()
	discount_price = models.FloatField(blank=True, null=True)


	class Meta:
		unique_together = ('department', 'name')

	def __str__(self):

		return f'{self.name} = {self.price}ghs'

	def laboratory(self):

		return self.department.laboratory

	def current_price(self):
	
		if self.discount_price is not None:

			return (self.price - self.discount_price)

		else:

			return self.price


	def discount_percent(self):

		if self.discount_price is not None:

			percentage = round((self.discount_price / self.price) * 100)

			return f'{percentage}%'