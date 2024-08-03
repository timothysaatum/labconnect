from django.db import models
from django.contrib.auth import get_user_model
#from labconnect.mixin import Facility
import uuid




user = get_user_model()


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

class Facility(models.Model):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	region = models.CharField(choices=REGIONS, max_length=100)
	postal_address = models.CharField(max_length=255)
	phone = models.CharField(max_length=15)
	email = models.EmailField()
	town = models.CharField(max_length=200)
	digital_address = models.CharField(max_length=15)
	date_created = models.DateTimeField(auto_now_add=True)
	date_modified = models.DateTimeField(auto_now=True)

	def get_facility_name(self):
		if hasattr(self, 'hospital'):
			return f'{self.hospital.name} - {self.town}'

		elif hasattr(self, 'branch'):
			return f'{self.branch.laboratory.name} - {self.town}'

	def __str__(self):
		return self.get_facility_name()



HOSPITAL_TYPES = [

	('Public', 'Public'),
	('Private', 'Private')
]

class Hospital(Facility):

	'''
	Model: Representing a hospital
	'''
	created_by = models.ForeignKey(user, on_delete=models.CASCADE)
	name = models.CharField(max_length=200)
	hospital_type = models.CharField(max_length=10, choices=HOSPITAL_TYPES)
	account_number = models.CharField(max_length=100)
	website = models.URLField(blank=True, null=True)
	referral_percent_discount = models.CharField(max_length=5)
	

	def __str__(self) -> str:
		return self.name

	class Meta:
		unique_together = ('account_number', )