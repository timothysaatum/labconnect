from rest_framework import serializers
from modelmixins.models import Facility, SampleType


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


class SampleTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SampleType

        fields = (
            "id",
            "sample_name",
            "sample_tube",
            "collection_procedure",
            "collection_time",
        )


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
