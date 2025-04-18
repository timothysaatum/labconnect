from .serializers import HospitalSerializer, HospitalLabSerializer, HospitalLabTestSerializer
from sample.serializers import  SampleSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import status
# from rest_framework.parsers import MultiPartParser, FormParser
from .models import Hospital, HospitalLab, HospitalLabTest
from sample.models import Sample
# import json
# from django.http import QueryDict
from modelmixins.paginators import QueryPagination



class PermissionsMixin(permissions.BasePermission):
	'''Custom permission class for sample views'''

	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True
		return request.user.is_authenticated and request.user.account_type == 'Hospital'
		ticated and request.user.account_type == 'Laboratory'

#    def has_object_permission(self, request, view, obj):
#        """
#        Ensures the user is authorized to:
#        - Edit a hospital if they created it.
#        - Edit a hospital lab if they are the hospital manager or laboratory manager.
#        """
#        user = request.user

#        # Check if object is a laboratory
#        if hasattr(obj, 'created_by') and obj.__class__.__name__ == "Hospital":
#            
#            return obj.created_by == user

#        # Check if object is a branch
#        if hasattr(obj, 'hospital_reference') and obj.__class__.__name__ == "HospitalLab":
#            
#            return obj.hospital_reference.created_by == user or obj.manager == user


class HospitalMixin(generics.GenericAPIView):
	'''Mixins class for common logic in sample views'''

	permission_classes = [PermissionsMixin]
	serializer_class = SampleSerializer

	def get_queryset(self):
		facility_id = self.request.user.hospital_set.first()
		return Sample.objects.filter(referring_facility_id=facility_id)


class AddHospitalView(HospitalMixin, generics.CreateAPIView):
	serializer_class = HospitalSerializer

	def post(self, request):

		return self.create(request)

	def perform_create(self, serializer):

		serializer.save(created_by=self.request.user, facility_type=self.request.user.account_type)


class UpdateHospitalView(HospitalMixin, generics.UpdateAPIView):
	serializer_class = HospitalSerializer

	def get_queryset(self):

		return Hospital.objects.filter(created_by=self.request.user)

	def patch(self, request, pk):
		return super().patch(request, pk)



class DeleteHospitalView(HospitalMixin, generics.DestroyAPIView):

	def get_queryset(self):

		return Hospital.objects.filter(created_by=self.request.user)

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)


class HospitalSerializerView(generics.ListAPIView):
	'''List view for Hospitals.'''

	serializer_class = HospitalSerializer
	filter_backends = [filters.SearchFilter]

	def get_queryset(self):
		return Hospital.objects.all()


class UserHospital(generics.ListAPIView):
	permission_classes = [PermissionsMixin]
	serializer_class = HospitalSerializer

	def get_queryset(self):
		return Hospital.objects.filter(created_by=self.request.user)



class CreateHospitalLab(generics.CreateAPIView):

	serializer_class = HospitalLabSerializer
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):

		return self.create(request)
	
	def preform_create(self, serializer):

		hospital_ref = self.request.user.hospital_set.first()

		serializer.save(hospital_reference_id=hospital_ref)



class UpdateHospitalLab(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HospitalLabSerializer

    def get_object(self, *args, **kwargs):

        queryset = HospitalLab.objects.all()
        obj = generics.get_object_or_404(queryset, id=self.kwargs.get('hospital_lab_id'))
		
        return obj

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteHospitalLab(generics.DestroyAPIView):
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):

		return HospitalLab.objects.filter(id=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)


class CreateHospitalLabTest(generics.CreateAPIView):

	permission_classes = [permissions.IsAuthenticated]
	serializer_class = HospitalLabTestSerializer

	def post(self, request):

		return self.create(request)


class GetHospitalLabTest(generics.ListAPIView):

	serializer_class = HospitalLabTestSerializer
	pagination_class = QueryPagination

	def get_queryset(self):

		return HospitalLabTest.objects.filter(hospital_lab=self.kwargs.get('h_lab_id'))