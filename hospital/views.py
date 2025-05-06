from .serializers import HospitalSerializer, HospitalLabSerializer, HospitalLabTestSerializer
from sample.serializers import  SampleSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import status
from .models import Hospital, HospitalLab, HospitalLabTest
from sample.models import Sample
from modelmixins.paginators import QueryPagination
import logging

logger = logging.getLogger('labs')



class RoleBasedPermission(permissions.BasePermission):
    """
    Custom permission for managing hospitals, hospital labs, and hospital lab tests.
    """

    def has_permission(self, request, view):
        """
        Grants general permission only to authenticated users with account_type 'Hospital'.
        """
        return request.user.is_authenticated and request.user.account_type == 'Hospital'

    def has_object_permission(self, request, view, obj):
        """
        Ensures the user is authorized to:
        - Edit a hospital if they created it.
        - Edit a hospital lab if they are the hospital owner.
        - Edit a hospital lab test if they are the owner of the hospital lab.
        """
        user = request.user

        # Check if object is a Hospital
        if hasattr(obj, 'created_by') and obj.__class__.__name__ == "Hospital":
            return obj.created_by == user

        # Check if object is a HospitalLab
        if hasattr(obj, 'hospital_reference') and obj.__class__.__name__ == "HospitalLab":
            return obj.hospital_reference.created_by == user

        # Check if object is a HospitalLabTest
        if hasattr(obj, 'hospital_lab') and obj.__class__.__name__ == "HospitalLabTest":
            return obj.hospital_lab.hospital_reference.created_by == user

        return False


class HospitalMixin(generics.GenericAPIView):
	'''Mixins class for common logic in sample views'''

	serializer_class = SampleSerializer

	def get_queryset(self):
		facility_id = self.request.user.hospital_set.first()
		return Sample.objects.filter(referring_facility_id=facility_id)


class AddHospitalView(HospitalMixin, generics.CreateAPIView):
    permission_classes = [RoleBasedPermission]
    serializer_class = HospitalSerializer

    def post(self, request):
        logger.info(
            f"Hospital creation attempt | User ID: {request.user.id} | Data: {request.data}"
        )
        return self.create(request)

    def perform_create(self, serializer):
        try:
            hospital = serializer.save(
                created_by=self.request.user, facility_type=self.request.user.account_type
            )
            logger.info(
                f"Hospital created successfully | Hospital ID: {hospital.id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to create hospital | User ID: {self.request.user.id} | Error: {str(e)}"
            )
            raise


class UpdateHospitalView(HospitalMixin, generics.UpdateAPIView):
    permission_classes = [RoleBasedPermission]
    serializer_class = HospitalSerializer

    def get_queryset(self):
        return Hospital.objects.filter(created_by=self.request.user)

    def patch(self, request, pk):
        logger.info(
            f"Hospital update attempt | User ID: {request.user.id} | Hospital ID: {pk} | Data: {request.data}"
        )
        return super().patch(request, pk)

    def perform_update(self, serializer):
        hospital_id = self.kwargs.get('pk')
        try:
            hospital = serializer.save()
            logger.info(
                f"Hospital updated successfully | Hospital ID: {hospital.id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to update hospital | Hospital ID: {hospital_id} | User ID: {self.request.user.id} | Error: {str(e)}"
            )
            raise


class DeleteHospitalView(HospitalMixin, generics.DestroyAPIView):
    permission_classes = [RoleBasedPermission]

    def get_queryset(self):
        return Hospital.objects.filter(created_by=self.request.user)

    def delete(self, request, pk, format=None):
        logger.info(
            f"Hospital deletion attempt | User ID: {request.user.id} | Hospital ID: {pk}"
        )
        return super().delete(request, pk, format=None)

    def perform_destroy(self, instance):
        hospital_id = instance.id
        try:
            instance.delete()
            logger.info(
                f"Hospital deleted successfully | Hospital ID: {hospital_id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to delete hospital | Hospital ID: {hospital_id} | User ID: {self.request.user.id} | Error: {str(e)}"
            )
            raise


class HospitalSerializerView(generics.ListAPIView):
    '''List view for Hospitals.'''
    serializer_class = HospitalSerializer
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        logger.info(
            f"Hospital list view accessed | User ID: {self.request.user.id}"
        )
        return Hospital.objects.all()


class UserHospital(generics.ListAPIView):
    permission_classes = [RoleBasedPermission]
    serializer_class = HospitalSerializer

    def get_queryset(self):
        logger.info(
            f"User's hospitals list view | User ID: {self.request.user.id}"
        )
        return Hospital.objects.filter(created_by=self.request.user)


class CreateHospitalLab(generics.CreateAPIView):
    serializer_class = HospitalLabSerializer
    permission_classes = [RoleBasedPermission]

    def post(self, request):
        logger.info(
            f"Hospital Lab creation attempt | User ID: {request.user.id} | Data: {request.data}"
        )
        return self.create(request)

    def perform_create(self, serializer):
        hospital_ref = self.request.user.hospital_set.first()
        try:
            lab = serializer.save(hospital_reference_id=hospital_ref)
            logger.info(
                f"Hospital Lab created successfully | Lab ID: {lab.id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to create Hospital Lab | User ID: {self.request.user.id} | Error: {str(e)}"
            )
            raise


class UpdateHospitalLab(generics.UpdateAPIView):
    permission_classes = [RoleBasedPermission]
    serializer_class = HospitalLabSerializer

    def get_object(self, *args, **kwargs):
        obj = generics.get_object_or_404(HospitalLab.objects.all(), id=self.kwargs.get('hospital_lab_id'))
        logger.info(
            f"Hospital Lab object retrieved for update | User ID: {self.request.user.id} | Lab ID: {obj.id}"
        )
        return obj

    def patch(self, request, *args, **kwargs):
        lab_id = self.kwargs.get('hospital_lab_id')
        logger.info(
            f"Hospital Lab update attempt | User ID: {request.user.id} | Lab ID: {lab_id} | Data: {request.data}"
        )
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_update(serializer)
            logger.info(
                f"Hospital Lab updated successfully | Lab ID: {instance.id} | User ID: {request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to update Hospital Lab | Lab ID: {lab_id} | User ID: {request.user.id} | Error: {str(e)}"
            )
            raise

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteHospitalLab(generics.DestroyAPIView):
    permission_classes = [RoleBasedPermission]

    def get_queryset(self):
        return HospitalLab.objects.filter(id=self.kwargs.get('pk'))

    def delete(self, request, pk, format=None):
        logger.info(
            f"Hospital Lab deletion attempt | User ID: {request.user.id} | Lab ID: {pk}"
        )
        return super().delete(request, pk, format=None)

    def perform_destroy(self, instance):
        lab_id = instance.id
        try:
            instance.delete()
            logger.info(
                f"Hospital Lab deleted successfully | Lab ID: {lab_id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to delete Hospital Lab | Lab ID: {lab_id} | User ID: {self.request.user.id} | Error: {str(e)}"
            )
            raise


class CreateHospitalLabTest(generics.CreateAPIView):
    permission_classes = [RoleBasedPermission]
    serializer_class = HospitalLabTestSerializer

    def post(self, request):
        logger.info(
            f"Hospital Lab Test creation attempt | User ID: {request.user.id} | Data: {request.data}"
        )
        return self.create(request)

    def perform_create(self, serializer):
        try:
            lab_test = serializer.save()
            logger.info(
                f"Hospital Lab Test created successfully | Test ID: {lab_test.id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to create Hospital Lab Test | User ID: {self.request.user.id} | Error: {str(e)}"
            )
            raise


class GetHospitalLabTest(generics.ListAPIView):
    serializer_class = HospitalLabTestSerializer
    pagination_class = QueryPagination

    def get_queryset(self):
        h_lab_id = self.kwargs.get('h_lab_id')
        logger.info(
            f"Hospital Lab Test list view | User ID: {self.request.user.id} | Hospital Lab ID: {h_lab_id}"
        )
        return HospitalLabTest.objects.filter(hospital_lab=h_lab_id)