from .serializers import (HospitalSerializer, SampleSerializer)
from rest_framework import generics, permissions, status
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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


class SampleSerializerView(generics.CreateAPIView):
	'''Create for creating a sample.'''

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid(raise_exception=True):

			if self.request.user.account_type == 'Health Worker':

				sample = serializer.save(send_by=self.request.user)

				tests = request.data.getlist('tests')
				
				for test in tests:
					
					sample.tests.add(test)

				return Response(
					{'message': 'Sample added successfully.'},
					status=status.HTTP_201_CREATED)

			return Response(
					{'message': 'Account type does not support sample addition.'},
					status=status.HTTP_400_BAD_REQUEST)

		return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SampleListView(SampleMixin, generics.ListAPIView):
	'''List view for samples created by the authenticated user.'''
	pass


class SampleDetailView(SampleMixin, generics.RetrieveAPIView):
	'''Retrieves details of a specific sample'''

	def get_object(self):
		pk = self.kwargs['pk']
		try:
			return self.get_queryset().get(pk=pk)
		except Sample.DoesNotExist:
			raise permissions.DoesNotExist()


class SampleUpdateView(SampleMixin, generics.UpdateAPIView):
	'''Update details of a specific sample.'''

	def put(self, request, *args, **kwargs):
		sample = self.get_object()
		serializer = self.get_serializer(sample, data=request.data)

		if serializer.is_valid(raise_exception=True):

			self.perform_update(serializer)
			sample.tests.clear()
			tests = request.data.getlist('tests')

			for test in tests:
				sample.tests.add(test)
				return Response({'message': 'Update successful.'}, status=status.HTTP_200_OK)
			
		return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SampleDeleteView(SampleMixin, generics.DestroyAPIView):
	'''Delete a specific sample.'''

	def delete(self, request, *args, **kwargs):
		self.perform_destroy(self.get_object())
		return Response({'message': 'Delete successful.'}, status=status.HTTP_204_NO_CONTENT)


class SampleResultList(generics.ListAPIView):
	'''List view for Test Results of samples created by the user'''

	permission_classes = [permissions.IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self):
		return TestResult.objects.filter(sample__send_by=self.request.user)