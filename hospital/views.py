from .serializers import (HospitalSerializer, SampleSerializer)
from rest_framework import generics, permissions
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Sample, Hospital
from labs.results import TestResult
from labs.serializers import TestResultSerializer



class SamplePermissions(permissions.BasePermission):
	'''Custom permission class for sample views'''

	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True
		return request.user.is_authenticated and request.user.account_type == 'Health Worker'


class SampleMixin(generics.GenericAPIView):
	'''Mixins class for common logic in sample views'''

	permission_classes = [SamplePermissions]
	serializer_class = SampleSerializer

	def get_queryset(self):

		return Sample.objects.filter(send_by=self.request.user)


class HospitalSerializerView(generics.ListAPIView):
	'''List view for Hospitals.'''

	queryset = Hospital.objects.all()
	serializer_class = HospitalSerializer
	filter_backends = [filters.SearchFilter]


class SampleSerializerView(SampleMixin, generics.CreateAPIView):
	'''Create for creating a sample.'''

	parser_classes = (MultiPartParser, FormParser)


	def post(self, request):
		
		return self.create(request)

	def perform_create(self, serializer):

		sample = serializer.save(send_by=self.request.user)
		tests = self.request.data.getlist('tests')

		sample.tests.add(*tests)


class SampleListView(SampleMixin, generics.ListAPIView):
	'''List view for samples created by the authenticated user.'''
	filter_backends = [filters.SearchFilter]


class SampleDetailView(SampleMixin, generics.RetrieveAPIView):
	'''Retrieves details of a specific sample'''

	def get_object(self):

		try:
			return self.get_queryset().get(pk=self.kwargs['pk'])

		except Sample.DoesNotExist:
			raise permissions.DoesNotExist()


class SampleUpdateView(SampleMixin, generics.UpdateAPIView):
	'''Update details of a specific sample.'''

	def put(self, request, pk, format=None):
		
		return super().put(request, pk, format=None)

	def perform_update(self, serializer):
		sample = serializer.save()
		sample.tests.clear()
		tests = self.request.data.getlist('tests')
		sample.tests.add(*tests)


class SampleDeleteView(SampleMixin, generics.DestroyAPIView):
	'''Delete a specific sample.'''

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)


class SampleResultList(generics.ListAPIView):
	'''List view for Test Results of samples created by the user'''

	permission_classes = [permissions.IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self):

		return TestResult.objects.filter(sample__send_by=self.request.user)