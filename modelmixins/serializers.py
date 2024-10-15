from rest_framework import serializers
from modelmixins.models import Facility, SampleType
# from labs.models import BranchTest, Branch
# from hospital.serializers import HospitalSerializer, HospitalLabSerializer
# from hospital.models import HospitalLab, Hospital



class FacilitySerializer(serializers.ModelSerializer):
	name = serializers.StringRelatedField(read_only=True, source='__str__')
	class Meta:
		model = Facility
		fields = (
			'id',
			'name',
			'phone',
			'email',
			'facility_type',
			'date_added'
		)

	# def to_representation(self, instance):
	# 	print(instance)
	# 	if isinstance(instance, Branch):
	# 		from labs.serializers import BranchSerializer
	# 		print(BranchSerializer(instance).data)
	# 		return BranchSerializer(instance).data

	# 	elif isinstance(instance, HospitalLab):
	# 		return HospitalLabSerializers(instance).data

	# 	elif isinstance(instance, Hospital):
	# 		return HospitalSerializer(instance).data

	# 	else:
	# 		print("i'm here")
	# 		return super().to_representation(instance)

class SampleTypeSerializer(serializers.ModelSerializer):

	class Meta:
		model = SampleType

		fields = (
			'id',
			'sample_name',
			'collection_procedure',
			'collection_time'
		)



class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
