from .serializers import HospitalSerializer
from sample.serializers import  SampleSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Hospital
from sample.models import Sample
from labs.models import Result
from labs.serializers import TestResultSerializer



class PermissionsMixin(permissions.BasePermission):
	'''Custom permission class for sample views'''

	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True
		return request.user.is_authenticated and request.user.account_type == 'Hospital'



class HospitalMixin(generics.GenericAPIView):
	'''Mixins class for common logic in sample views'''

	permission_classes = [PermissionsMixin]
	serializer_class = SampleSerializer

	def get_queryset(self):
		facility_id = Hospital.objects.get(created_by=self.request.user)
		return Sample.objects.filter(referring_facility_id=facility_id)



class AddHospitalView(HospitalMixin, generics.CreateAPIView):
	serializer_class = HospitalSerializer

	def post(self, request):

		return self.create(request)

	def perform_create(self, serializer):

		serializer.save(created_by=self.request.user)


class UpdateHospitalView(HospitalMixin, generics.UpdateAPIView):
	serializer_class = HospitalSerializer

	def get_queryset(self):

		return Hospital.objects.filter(created_by=self.request.user)

	def put(self, request, pk):
		return super().put(request, pk)



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


class SampleSerializerView(HospitalMixin, generics.CreateAPIView):
	'''Create for creating a sample.'''

	parser_classes = (MultiPartParser, FormParser)


	def post(self, request):
		
		return self.create(request)

	def perform_create(self, serializer):

		facility = Hospital.objects.get(created_by=self.request.user)
		sample = serializer.save(referring_facility=facility)
		tests = self.request.data.getlist('tests')

		sample.tests.add(*tests)



class SampleListView(HospitalMixin, generics.ListAPIView):
	'''List view for samples created by the authenticated user.'''
	filter_backends = [filters.SearchFilter]



class SampleDetailView(HospitalMixin, generics.RetrieveAPIView):
	'''Retrieves details of a specific sample'''

	def get_object(self):

		try:
			return self.get_queryset().get(pk=self.kwargs['pk'])

		except Sample.DoesNotExist:
			return Response('Sample not found')



class SampleUpdateView(HospitalMixin, generics.UpdateAPIView):
	'''Update details of a specific sample.'''

	def put(self, request, pk, format=None):
		sample = self.get_queryset()
		if sample.is_accessed_by_lab:
			return Response('Cannot update sample')
		
		return super().put(request, pk, format=None)

	def perform_update(self, serializer):
		sample = serializer.save()
		sample.tests.clear()
		tests = self.request.data.getlist('tests')
		sample.tests.add(*tests)



class SampleDeleteView(HospitalMixin, generics.DestroyAPIView):
	'''Delete a specific sample.'''

	def delete(self, request, pk, format=None):

		sample = self.get_queryset()

		if sample.is_accessed_by_lab:
			return Response('Cannot delete sample')

		return super().delete(request, pk, format=None)



class SampleResultList(generics.ListAPIView):
	'''List view for Test Results of samples created by the user'''

	permission_classes = [permissions.IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self):

		facility_id = Hospital.objects.get(created_by=self.request.user).id
		return Result.objects.filter(sample__referring_facility_id=facility_id)