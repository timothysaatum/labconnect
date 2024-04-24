from .models import Laboratory, Department, Test
from hospital.models import Hospital, Sample
from django.contrib.auth import get_user_model
from django.db import models




class TestResult(models.Model):

	'''
	A test result that can be generated in a department withina lab:

	attrs:
	department(str): The department where this test result belongs to.
	test(str): The test this results belong to.
	'''

	send_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='sender',  db_index=True)
	hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='results', db_index=True)
	sample = models.ForeignKey(Sample, on_delete=models.CASCADE, db_index=True)
	department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='results', db_index=True)
	laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
	test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results', db_index=True)
	result = models.FileField(upload_to='labs/results')
	comments = models.TextField()
	is_verified = models.BooleanField(default=False)
	is_received = models.BooleanField(default=False)
	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)


	def __str__(self):
		return self.laboratory