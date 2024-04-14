from .serializers import (HospitalSerializer, WardSerializer, SampleSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Sample


class HospitalSerializerView(CreateAPIView):


	#permission_classes = [IsAuthenticated]
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = HospitalSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			print(self.request.user)
			serializer.save()
			#serializer.save(created_by=self.request.user)

		return Response({
					'message': 'Hospital created successfully.'},
					status=status.HTTP_200_OK)


class WardSerializerView(CreateAPIView):

	serializer_class = WardSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			
			serializer.save()

		return Response(
					{'message': 'Ward added successfully.'},
					status=status.HTTP_200_OK)



class SampleSerializerView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			serializer.save(send_by=self.request.user)

		return Response(
				{'message': 'Sample added successfully.'},
				status=status.HTTP_200_OK
			)




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