from rest_framework import serializers
from modelmixins.models import Facility, SampleType, FacilityWorkingHours
from labs.models import Branch
from hospital.models import HospitalLab

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
        """
        Ensure correct subclass (Branch or HospitalLab) is used before serialization.
        """

        # Check if instance is a Branch or HospitalLab before accessing attributes
        is_branch = hasattr(instance, "branch")
        is_hospital_lab = hasattr(instance, "hospitallab")

        request = self.context.get("request")
        gps_coord = request.GET.get("gps_coordinates") if request else None

        data = super().to_representation(instance)

        # Ensure correct town value
        if is_branch:
            data["town"] = instance.branch.town
            data["logo"] = instance.branch.laboratory.logo if instance.branch.laboratory else None
        elif is_hospital_lab:
            data["town"] = instance.hospitallab.hospital_reference.town

        # Ensure correct distance calculation
        if gps_coord and instance.gps_coordinates:
            try:
                user_lat, user_long = map(float, gps_coord.split(","))
                data["distance"] = f"{instance.get_branch_distance(user_lat, user_long)} km"
            except ValueError:
                data["distance"] = "Invalid GPS coordinates"
        else:
         data["distance"] = "Null"

        # Ensure working hours serialization
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
