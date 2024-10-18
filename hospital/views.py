from .serializers import HospitalSerializer, HospitalLabSerializer, HospitalLabTestSerializer
from sample.serializers import  SampleSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Hospital, HospitalLab, HospitalLabTest
from sample.models import Sample
import json
from django.http import QueryDict
from modelmixins.paginators import QueryPagination



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
		facility_id = self.request.user.hospital_set.first()
		# facility_id = Hospital.objects.get(created_by=self.request.user)
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
		data = request.data.dict() if isinstance(request.data, QueryDict) else request.data.copy()
		# print(data)
		if 'tests' in data:

			tests = json.loads(data['tests'])
			if isinstance(tests, list):
				
				data['tests'] = tests
			
		request._full_data = data
		
		return self.create(request)

	def perform_create(self, serializer):

		facility = Hospital.objects.get(created_by=self.request.user)
		tests = self.request.data['tests']
		sample = serializer.save(
			referring_facility=facility,
			sample_status='Pending',
			facility_type='Hospital'
			)

		sample.tests.add(*tests)


class SampleListView(HospitalMixin, generics.ListAPIView):
	'''List view for samples created by the authenticated user.'''
	pagination_class = QueryPagination
	filter_backends = [filters.SearchFilter]



class SampleUpdateView(HospitalMixin, generics.UpdateAPIView):
	'''Update details of a specific sample.'''

	def put(self, request, pk, format=None):
		sample = self.get_queryset()
		if sample.sample_status == 'Received':
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

		if sample.sample_status == 'Received':
			return Response('Cannot delete sample')

		return super().delete(request, pk, format=None)

	

class CreateHospitalLab(generics.CreateAPIView):

	serializer_class = HospitalLabSerializer
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):

		return self.create(request)
	
	def preform_create(self, serializer):
		# hospital_ref = Hospital.objects.get(created_by=self.request.user)
		hospital_ref = self.request.user.hospital_set.first()
		# print(hospital_ref)
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