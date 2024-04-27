from .serializers import (HospitalSerializer, SampleSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Sample, Hospital
from rest_framework_simplejwt.exceptions import InvalidToken
from labs.results import TestResult
from labs.serializers import TestResultSerializer



class HospitalSerializerView(ListAPIView):

	serializer_class = HospitalSerializer

	def get_queryset(self):

		try:
			return Hospital.objects.all()

		except Hospital.DoesNotExist:
			return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)


class SampleSerializerView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			serializer.save(send_by=self.request.user)

			test_ids = request.data.get('tests')
			print(test_ids)
			sample = serializer.instance
			print(sample)
			for test_id in test_ids:
				print(test_id)
				sample.tests.add(test_id)

			return Response(
				{'message': 'Sample added successfully.'},
				status=status.HTTP_201_CREATED)

		return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SampleListView(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer

	def get_queryset(self):

		try:
			return Sample.objects.filter(send_by=self.request.user)
			
		except Sample.DoesNotExist:
			return Response({'error': 'Sample not found'}, status=status.HTTP_404_NOT_FOUND)



class SampleDetailView(RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer

	def get_queryset(self, pk):

		try:
			return Sample.objects.get(pk=pk)

		except Sample.DoesNotExist:

			return Response({'error': 'Sample does not exist.'})

		except Exception as e:

			return Response({'error': str(e)})


	def get(self, request, pk, format=None):

		try:

			sample = self.get_queryset(pk)
			serialized_data = SampleSerializer(sample)

			return Response(serialized_data.data)

		except Exception as e:
			
			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)



class SampleUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer

	def put(self, request, pk, format=None):

		sample = Sample.objects.get(pk=pk)
		serializer = SampleSerializer(sample, data=request.data)

		if serializer.is_valid():
			if self.request.user.account_type == 'Client':

				serializer.save()
				sample.tests.clear()
				test_ids = request.data.get('tests')

				for test_id in test_ids:
					sample.tests.add(test_id)

				return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'You are no authorized to edit sample details!'},
							status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SampleDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		sample = Sample.objects.get(pk=pk)
		if self.request.user.account_type == 'Clinician':

			sample.delete()
			return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)

		return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class ClinicianResultList(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self):

		try:
			return TestResult.objects.filter(sample__send_by=self.request.user)

		except TestResult.DoesNotExist:
			return Response({'error': 'Test results not found'}, status=status.HTTP_404_NOT_FOUND)