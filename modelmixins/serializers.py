from rest_framework import serializers
from modelmixins.models import Facility, SampleType
from labs.models import Branch


class FacilitySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

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
    
    def get_name(self, instance):
        """
        Dynamically return the name of the facility:
        - If the facility is related to a Branch, return branch_name (if available).
        - Otherwise, use the __str__ representation.
        """
        # Check if this Facility has a related Branch
        if hasattr(instance, "branch"):  
            branch = instance.branch  # Get related Branch instance
            return branch.branch_name if branch.branch_name else str(instance)

        # For other cases, fall back to __str__ of Facility
        return str(instance)


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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["sample_name"] = str(instance)
        return data


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
