from rest_framework import serializers
from modelmixins.models import Facility, SampleType, FacilityWorkingHours


class FacilityWorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityWorkingHours
        fields = ["id", "day", "start_time", "end_time"]

    def validate(self, data):
        """Ensure start_time is before end_time."""
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError("Start time must be before end time.")
        return data


class FacilitySerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    logo = serializers.URLField(read_only=True)
    town = serializers.CharField(read_only=True)
    working_hours = FacilityWorkingHoursSerializer(many=True, required=False)
    distance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    

    class Meta:

        model = Facility

        fields = (
            "id",
            "name",
            "logo",
            "distance",
            "town",
            "account_number",
            "bank_name",
            "bank_code",
            "working_hours",
            "phone",
            "email",
            "facility_type",
            "date_added",
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

    def to_representation(self, instance):

        request = self.context.get("request")
        user_lat = request.GET.get("user_lat")
        user_long = request.GET.get("user_long")

        data = super().to_representation(instance)

        data["town"] = instance.branch.town
        data["distance"] = (
            instance.branch.get_branch_distance(float(user_lat), float(user_long))
            if user_lat and user_long
            else "Null"
        )
        data["logo"] = (
            instance.branch.laboratory.logo if instance.branch.laboratory else "None"
        )
        data["working_hours"] = FacilityWorkingHoursSerializer(
            instance.working_hours.all(), many=True
        ).data

        return data


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
