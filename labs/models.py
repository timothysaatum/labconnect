from django.db import models
from django.contrib.auth import get_user_model
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

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	name = models.CharField(max_length=200)
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


	def departments(self):

		labs = Laboratory.objects.filter(id=self.id)
			
		deptm = []

		for lab in labs:

			deptm = [department for department in lab.department_set.all()]

		return deptm




DEPARTMENT_NAME = [

	('Haematology', 'Haematology'),
	('Microbiology', 'Microbiology'),
	('Parasitology', 'Parasitology'),
	('Clinical Chemistry', 'Clinical Chemistry'),
	('Molecular Biology', 'Molecular Biology')

]

class Department(BaseModel):

	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
	heard_of_department = models.CharField(max_length=200)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	department_name = models.CharField(choices=DEPARTMENT_NAME, max_length=100)


	def __str__(self):
		return self.department_name


	def tests(self):

		lab_tests = [test for test in Test.objects.filter(department=self.id)]

		return lab_tests

	def laboratory_name(self):

		return self.laboratory


class Test(BaseModel):

	department = models.ForeignKey(Department, on_delete=models.CASCADE)
	name = models.CharField(max_length=200)
	price = models.FloatField()
	discount_price = models.FloatField(blank=True, null=True)

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


class TestResult(BaseModel):
	
	send_by = models.ForeignKey(user, on_delete=models.CASCADE, related_name='sender')
	department = models.ForeignKey(Department, on_delete=models.CASCADE)
	laboratory = models.CharField(max_length=200)
	test = models.ForeignKey(Test, on_delete=models.CASCADE)
	result = models.FileField(upload_to='labs/results')
	comments = models.TextField()
	is_verified = models.BooleanField(default=False)
	is_received = models.BooleanField(default=False)

	def __str__(self):
		return self.laboratory