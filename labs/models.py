from django.db import models
from django.contrib.auth import get_user_model
user = get_user_model()


class BaseModel(models.Model):

	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	class Meta:
		abstract = True


class Laboratory(BaseModel):

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	name = models.CharField(max_length=200)
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	website = models.URLField()
	description = models.TextField()

	def __str__(self):
		return self.name


	class Meta:
		verbose_name_plural = 'Laboratories'


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
	discount_price = models.FloatField()

	def __str__(self):
		return f'{self.name} = {self.price}ghs'

	def laboratory(self):
		return self.department.laboratory

	def current_price(self):

		c_price = self.price - self.discount_price

		return c_price

	def discount_percent(self):

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