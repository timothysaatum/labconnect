from .serializers import LaboratorySampleSerializer
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Laboratory, Test, Branch
from hospital.models import Sample




class LaboratorySampleSerializerView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = LaboratorySampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid(raise_exception=True):

			if self.request.user.account_type == 'Laboratory':

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
