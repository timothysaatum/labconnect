from rest_framework import serializers
from modelmixins.models import Facility, BasicTest, SampleType
from labs.models import BranchTest, Branch
from hospital.serializers import HospitalSerializer, HospitalLabSerializers
from hospital.models import HospitalLab, Hospital



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
			'postal_address',
			'date_created'
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


class BasicTestSerializer(serializers.ModelSerializer):

	sample_type = serializers.PrimaryKeyRelatedField(many=True, queryset=SampleType.objects.all(), required=True)
	discount_price = serializers.DecimalField(decimal_places=2, max_digits=10, required=False)
	
	class Meta:

		model = BasicTest
		fields = (
			'id',
			'test_code',
			'name',
			'turn_around_time',
			'price',
			'discount_price',
			'patient_preparation',
			'sample_type',
			'branch',
			'test_status',
			'date_modified',
			'date_added'
		)

		# pagination_class = QueryPagination
	def get_branch_specific_data(self, obj):
		branch_id = self.context.get('pk')

		data = {
			'price': obj.price,
			'discount_price': obj.discount_price,
			'discount_percent': obj.discount_percent,
			'test_status': obj.test_status,
			'turn_around_time': obj.turn_around_time,
		}

		if branch_id:

			try:

				branch_test = BranchTest.objects.get(test=obj, branch_id=branch_id)
				data['price'] = branch_test.price or obj.price
				data['discount_price'] = branch_test.discount_price or obj.discount_price
				data['discount_percent'] = branch_test.discount_percent or obj.discount_percent
				data['test_status'] = branch_test.test_status or obj.test_status
				data['turn_around_time'] = branch_test.turn_around_time or obj.turn_around_time

			except BranchTest.DoesNotExist:
				raise('No such branch')

		return data

	def to_representation(self, instance):
		data = super().to_representation(instance)
		data['name'] = str(instance)
		branch_test_details = self.get_branch_specific_data(instance)
		data.update(branch_test_details)
		data['sample_type'] = SampleTypeSerializer(instance.sample_type.all(), many=True).data
		return data
