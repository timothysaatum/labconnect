from .models import Test, Branch
from hospital.models import Hospital, Sample
from django.contrib.auth import get_user_model
from django.db import models



class TestResult(models.Model):

	'''
	A test result that can be generated in a branch within a lab:

	attrs:
	branch(str): The branch where this test result belongs to.
	test(str): The test this results belong to.
	'''

	send_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='sender',  db_index=True)
	hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='results', db_index=True)
	sample = models.ForeignKey(Sample, on_delete=models.CASCADE, db_index=True)
	branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='results', db_index=True)
	test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results', db_index=True)
	result = models.FileField(upload_to='labs/results')
	comments = models.TextField(blank=True, null=True)
	is_verified = models.BooleanField(default=False)
	is_received = models.BooleanField(default=False)
	date_added = models.DateField(auto_now_add=True)
	date_modified = models.DateField(auto_now=True)


	def __str__(self) -> str:
		return self.branch