from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import generics # type: ignore
from rest_framework import status # type: ignore
from .serializers import NotificationSerializer, CountObjectsSerializer, SampleTrackingSerializer
from .models import Notification, Sample, SampleTrackingHistory
from django.db.models import Count, Q # type: ignore
from django.utils.timezone import now, timedelta # type: ignore
# from datetime import timedelta




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

        return Notification.objects.filter(facility=self.kwargs.get('branch_id'), is_read=False)


class CountObjects(generics.GenericAPIView):
    # serializer_class = CountObjectsSerializer

    def get(self, request, *args, **kwargs):
        facility_id = self.kwargs.get('facility_id')
        today = now().date()
        yesterday = today - timedelta(days=1)

        # Aggregate counts for today and yesterday in one query each
        today_stats = Sample.objects.filter(Q(referring_facility=facility_id) | Q(to_laboratory=facility_id), date_added__date=today).aggregate(
            received=Count('id', filter=Q(request_status='Request Accepted')),
            processed=Count('id', filter=Q(sample_status='processed')),
            pending=Count('id', filter=Q(sample_status='pending')),
            rejected=Count('id', filter=Q(sample_status='rejected')),
        )

        yesterday_stats = Sample.objects.filter(Q(referring_facility=facility_id) | Q(to_laboratory=facility_id), date_added__date=yesterday).aggregate(
            received=Count('id', filter=Q(request_status='Request Accepted')),
            processed=Count('id', filter=Q(sample_status='processed')),
            pending=Count('id', filter=Q(sample_status='pending')),
            rejected=Count('id', filter=Q(sample_status='rejected')),
        )
        # print(Sample.objects.filter(Q(referring_facility=facility_id) | Q(to_laboratory=facility_id), date_added__date=today))
        # print(yesterday_stats)
        # Calculate percentage changes
        def percentage_change(today_count, yesterday_count):
            if yesterday_count == 0:
                return 100 if today_count > 0 else 0
            return ((today_count - yesterday_count) / yesterday_count) * 100

        change_received = percentage_change(today_stats['received'], yesterday_stats['received'])
        change_processed = percentage_change(today_stats['processed'], yesterday_stats['processed'])
        change_pending = percentage_change(today_stats['pending'], yesterday_stats['pending'])
        change_rejected = percentage_change(today_stats['rejected'], yesterday_stats['rejected'])

        data = {
            'samples_received': today_stats['received'],
            'samples_processed': today_stats['processed'],
            'samples_pending': today_stats['pending'],
            'samples_rejected': today_stats['rejected'],
            'change_received': change_received,
            'change_processed': change_processed,
            'change_pending': change_pending,
            'change_rejected': change_rejected,
        }
        # print(data)
        # serializer = self.serializer_class(data=data)
        # serializer.is_valid(raise_exception=True)
        # print(serializer.data)
        return Response(data)


class TrackSampleState(generics.CreateAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = SampleTrackingSerializer

    
    def post(self, request, format=None):
        
        return self.create(request)
    
    def perform_create(self, serializer):
        tracking_history = serializer.save()

        sample = tracking_history.sample
        sample.request_status = serializer.validated_data['status']
        sample.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    

class GetTrackerDetails(generics.ListAPIView):

    # permission_classes = [IsAuthenticated]
    serializer_class = SampleTrackingSerializer

    def get_queryset(self, *args, **kwargs):

        sample_id = self.kwargs.get('sample_id')
        return SampleTrackingHistory.objects.filter(sample=sample_id)