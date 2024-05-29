from rest_framework import serializers
from sample.models import Sample
from labs.paginators import QueryPagination
from labs.models import Test



class SampleSerializer(serializers.ModelSerializer):

	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(read_only=True)
	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all())

	class Meta:

		model = Sample

		fields = (
			'id', 
			'referring_facility', 
			'patient_name', 
			'patient_age',
			'sender_full_name',
			'sender_phone',
			'sender_email',
			'sample_type',
			'patient_sex',
			'delivery', 
			'is_paid', 
			'is_received_by_delivery', 
			'is_delivered_to_lab', 
			'is_accessed_by_lab', 
			'sample_type', 
			'to_laboratory', 
			'tests', 
			'brief_description', 
			'attachment', 
			'date_modified', 
			'date_created'
		)

	pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = instance.referring_facility.name
		data['lab'] = instance.to_laboratory.name

		if data['delivery']:

			data['delivery'] = instance.delivery.name

		return data