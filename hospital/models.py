from django.db import models
from django.contrib.auth import get_user_model
from modelmixins.models import BasicTest, Facility


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


HOSPITAL_TYPES = [

	('Public', 'Public'),
	('Private', 'Private')

]

class Hospital(Facility):

    '''
	Model: Representing a hospital
	'''
    created_by = models.ForeignKey(user, on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=200)
    region = models.CharField(choices=REGIONS, max_length=100)
    town = models.CharField(max_length=200)
    hospital_type = models.CharField(max_length=10, choices=HOSPITAL_TYPES)
    # account_number = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    digital_address = models.CharField(max_length=15)
    # referral_percent_discount = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        unique_together = ("name", )


class HospitalLab(Facility):
	"""
	A model representing a hospital's laboratory.
    Reuses the hospital's address and contact details by default.
    """
	name = models.CharField(max_length=155)
	accreditation_number = models.CharField(max_length=100)
	level = models.CharField(max_length=100)
	hospital_reference  = models.OneToOneField(Hospital, on_delete=models.CASCADE, related_name='hospital_lab', db_index=True)
	
	def __str__(self) -> str:
		return str(self.hospital_reference.name)


class HospitalLabTest(BasicTest):
	hospital_lab = models.ForeignKey(HospitalLab, on_delete=models.CASCADE, db_index=True)
