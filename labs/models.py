from django.db import models
from django.contrib.auth import get_user_model


user = get_user_model()


class BaseModel(models.Model):

	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)

	class Meta:
		abstract = True



class Laboratory(BaseModel):

	digital_address = models.CharField(max_length=15)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	name = models.CharField(max_length=200)
	departments = models.ManyToManyField('Department', related_name='lab_departments')
	herfra_id = models.CharField('HERFRA ID', max_length=100)
	website = models.URLField()
	description = models.TextField()

	def __str__(self):
		return self.name



class Department(models.Model):

	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
	department_name = models.CharField(max_length=100)
	tests = models.ManyToManyField('Test')
	

	def __str__(self):
		return self.department_name


class Test(BaseModel):
	
	name = models.CharField(max_length=200)
	price = models.FloatField()

	def __str__(self):
		return f'{self.name} @ {self.price}ghs'


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
