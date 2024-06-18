from rest_framework import serializers
from sample.models import Sample
from labs.paginators import QueryPagination
from labs.models import Test



class SampleSerializer(serializers.ModelSerializer):

	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(read_only=True)
	sample_type = serializers.PrimaryKeyRelatedField(read_only=True)
	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all())

	class Meta:

		model = Sample

		fields = (
			'id', 
			'referring_facility',
			'facility_type', 
			'patient_name', 
			'patient_age',
			'sender_full_name',
			'sender_phone',
			'sender_email',
			'sample_type',
			'patient_sex',
			'delivery', 
			'is_paid',
			'collected_sample',
			'rejected_sample',
			'rejection_reason',
			'is_received_by_delivery', 
			'is_delivered_to_lab', 
			'is_accessed_by_lab',  
			'to_laboratory', 
			'tests', 
			'clinical_history', 
			'attachment', 
			'date_modified', 
			'date_created'
		)

	pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = instance.referring_facility.name
		data['sample_type'] = instance.sample_type.sample_name
		data['to_laboratory'] = instance.to_laboratory.name

		if data['delivery']:

			data['delivery'] = instance.delivery.name

		return data