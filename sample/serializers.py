from rest_framework import serializers
from sample.models import Sample
from labs.paginators import QueryPagination
from labs.models import Test, SampleType



class SampleSerializer(serializers.ModelSerializer):

	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(read_only=True)
	sample_type = serializers.PrimaryKeyRelatedField(queryset=SampleType.objects.all())
	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all())
	sender_full_name = serializers.CharField(required=False)
	sender_phone = serializers.CharField(required=False)
	sender_email = serializers.CharField(required=False)

	class Meta:

		model = Sample

		fields = (
			'id', 
			'patient_name', 
			'patient_age',
			'patient_sex',
			'referring_facility',
			'facility_type', 
			'to_laboratory', 
			'sender_full_name',
			'sender_phone',
			'sender_email',
			'sample_type',  
			'tests', 
			'clinical_history', 
			'attachment',
			'sample_status',
			'payment_mode',
			'payment_status',
			'delivery', 
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