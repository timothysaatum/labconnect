from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import NotificationSerializer, CountObjectsSerializer, SampleSerializer, SampleTrackingSerializer
from .models import Notification, Sample, SampleTrackingHistory
import json
from django.http import QueryDict
from user.models import Client
from labs.models import Branch
from django.contrib.contenttypes.models import ContentType



class SendSampleView(generics.CreateAPIView):

    permission_classes = [IsAuthenticated]
    queryset = Sample.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = SampleSerializer


    def post(self, request):

        data = request.data.dict() if isinstance(request.data, QueryDict) else request.data.copy()
        if 'tests' in data:

            tests = json.loads(data['tests'])
            if isinstance(tests, list):

                data['tests'] = tests

        request._full_data = data

        return self.create(request)

    def perform_create(self, serializer):

        user = self.request.user

        tests = self.request.data['tests']

        if user.account_type == 'Hospital':
            referror_model = Client.objects.get(id=user.id)
            # referror = 'Hospital'

        elif user.account_type == 'Laboratory':
            branch_id = self.request.data['to_laboratory']
            referror_model = Branch.objects.get(id=branch_id)
            # referror = 'Laboratory'
        content_type = ContentType.objects.get_for_model(referror_model)

        sample = serializer.save(
                referror_content_type=content_type,
                referror_object_id=referror_model.id,
				sender_full_name=user.full_name,
				sender_phone=user.phone_number,
				sender_email=user.email,
				facility_type=user.account_type
			)

        sample.tests.add(*tests)



class UpdateNotification(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_object(self, *args, **kwargs):

        queryset = Notification.objects.all()
        obj = generics.get_object_or_404(queryset, id=self.kwargs.get('noti_id'))

        return obj

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetNotifications(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Notification.objects.filter(branch=self.kwargs.get('branch_id'), is_read=False)


class CountObjects(generics.GenericAPIView):
    serializer_class = CountObjectsSerializer

    def get(self, request):
        samples_received = Sample.objects.filter(is_marked_sent=True).count()
        samples_sent = Sample.objects.filter(is_marked_sent=True).count()
        samples_rejected = Sample.objects.filter(is_rejected=True).count()
        samples_processed = Sample.objects.filter(is_marked_sent=True).count()

        data = {
            samples_received:samples_received,
            samples_sent:samples_sent,
            samples_rejected:samples_rejected,
            samples_processed:samples_processed
        }

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        print(serializer.data)


class TrackSampleState(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SampleTrackingSerializer

    # def get_object(self, *args, **kwargs):

    #     queryset = SampleTrackingHistory.objects.all()
    #     obj = generics.get_object_or_404(queryset, id=self.kwargs.get('sample_id'))

    #     return obj

    # def patch(self, request, *args, **kwargs):

    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)

    #     sample = instance.sample
    #     sample.request_status = serializer.validated_data['status']
    #     sample.save()

    #     return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request, format=None):
        
        return self.create(request)
    
    def perform_create(self, serializer):
        tracking_history = serializer.save()

        sample = tracking_history.sample
        sample.request_status = serializer.validated_data['status']
        sample.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    

