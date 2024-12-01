from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import generics # type: ignore
from rest_framework import status # type: ignore
from .serializers import (
    NotificationSerializer,
    ReferralSerializer,
    SampleTrackingSerializer,
    SampleSerializer,
    ReferralTrackingSerializer,
)
from .models import (
    Notification,
    Sample,
    SampleTrackingHistory,
    Referral,
    ReferralTrackingHistory,
)
from django.db.models import Count, Q # type: ignore
from django.utils.timezone import now, timedelta # type: ignore
from .paginators import QueryPagination
import logging
from django.shortcuts import get_object_or_404
from rest_framework import serializers


logger = logging.getLogger('labs')


class CreateReferral(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer

    def perform_create(self, serializer):

        referring_facility = self.request.data.get('referring_facility')
        to_laboratory = self.request.data.get('to_laboratory')

        if referring_facility == to_laboratory:
            raise serializers.ValidationError({
                'to_laboratory': "The referring facility and the laboratory cannot be the same."
            })

        referral = serializer.save()

        if self.request.user.account_type == 'Laboratory':

            referral.facility_type = self.request.user.account_type
            referral.sender_full_name = self.request.user.full_name
            referral.sender_phone = self.request.user.phone_number
            referral.sender_email = self.request.user.email

        else:
            referral.facility_type = self.request.user.account_type

        referral.referral_status = "Request Made"

        referral.save()
        logger.info(f"User: <{self.request.user.id}> added <{referral.id}>")


class UpdateReferral(generics.UpdateAPIView):

    permission_classes = [IsAuthenticated]
    queryset = Referral.objects.all()
    lookup_url_kwarg = 'referral_id'
    serializer_class = ReferralSerializer

    def perform_update(self, serializer):
        logger.info(f"{self.request.user.full_name} edited {self.lookup_url_kwarg}")
        serializer.save()


# class GetReferrals(generics.ListAPIView):

#     permission_classes = [IsAuthenticated]
#     pagination_class = QueryPagination
#     serializer_class = ReferralSerializer

#     def get_queryset(self):

#         status = self.request.GET.get('status')
#         from_date = self.request.GET.get('from_date')
#         search_term = self.request.GET.get("search")
#         received = self.request.GET.get("received")
#         sent = self.request.GET.get("sent")
#         to_date = self.request.GET.get('to_date')
#         pk = self.kwargs.get("facility_id")

#         referral = Referral.objects.none()
#         logger.info(
#             f"User: {self.request.user.id} attempted<{search_term}> search on referrals<{pk}>"
#         )

#         if received == "true":
#             referral = Referral.objects.filter(
#                 Q(to_laboratory_id=pk) | Q(to_laboratory__branch__laboratory_id=pk),
#             ).order_by("-date_referred")

#         if sent == "true":
#             referral = Referral.objects.filter(
#                 Q(referring_facility_id=pk) | Q(referring_facility__branch__laboratory_id=pk),
#             ).order_by("-date_referred")

#         if referral.exists():

#             if status:
#                 if status == "All":
#                     return referral.order_by("date_referred")
#                 return referral.filter(referral_status__icontains=status).order_by(
#                     "date_referred"
#                 )

#             if from_date and to_date:
#                 return referral.filter(
#                     date__range=(from_date, to_date),
#                 ).order_by("date_referred")

#             if search_term:

#                 return referral.filter(patient_name__icontains=search_term).order_by(
#                     "date_referred"
#                 )

#         if not Referral.DoesNotExist():
#             return Response(
# 				{'error': 'No referral found.'}, status=status.HTTP_404_NOT_FOUND
# 			)

#         return referral


class GetReferrals(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = QueryPagination
    serializer_class = ReferralSerializer

    def get_queryset(self):
        pk = self.kwargs.get("facility_id")
        status = self.request.GET.get("status")
        from_date = self.request.GET.get("from_date")
        to_date = self.request.GET.get("to_date")
        search_term = self.request.GET.get("search")
        received = self.request.GET.get("received")
        sent = self.request.GET.get("sent")

        queryset = Referral.objects.none()  # Default to an empty queryset
        logger.info(
            f"User: {self.request.user.id} attempted<{search_term}> search on referrals<{pk}>"
        )

        # Filter for received referrals
        if received == "true":
            queryset = Referral.objects.filter(
                Q(to_laboratory_id=pk) | Q(to_laboratory__branch__laboratory_id=pk)
            )

        # Filter for sent referrals
        if sent == "true":
            queryset = Referral.objects.filter(
                Q(referring_facility_id=pk)
                | Q(referring_facility__branch__laboratory_id=pk)
            )

        # Apply additional filters
        if status and status != "All":
            queryset = queryset.filter(referral_status__icontains=status)

        if from_date and to_date:
            queryset = queryset.filter(date__range=(from_date, to_date))

        if search_term:
            queryset = queryset.filter(patient_name__icontains=search_term)

        return queryset.order_by("-date_referred")


class ReferralDetailsView(generics.RetrieveAPIView):

    serializer_class = ReferralSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Fetch referral_id from URL kwargs
        referral_id = self.kwargs.get("referral_id")

        # Use get_object_or_404 to retrieve the object by referral_id
        return get_object_or_404(Referral, id=referral_id)


class UpdateSample(generics.UpdateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = SampleSerializer
    lookup_url_kwarg = "sample_id"
    queryset = Sample.objects.all()

    def perform_update(self, serializer):
        serializer.save()


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
        request_status = (
            "Request Completed",
            "Request Made",
            "Request Accepted",
            "Sample Received by Delivery",
            "Sample Received by Lab",
        )
        notification = Notification.objects.filter(
            facility_id=self.kwargs.get("branch_id"),
            is_read=False,
            facility__referral__referral_status__in=request_status,
        ).order_by("-date_added")

        return notification


class CountObjects(generics.GenericAPIView):

    def get(self, request, *args, **kwargs):
        facility_id = self.kwargs.get("facility_id")
        today = now().date()
        last_month = today - timedelta(days=30)

        # Aggregate counts for today
        today_stats = Referral.objects.filter(
            Q(referring_facility=facility_id) | Q(to_laboratory=facility_id),
            date_referred__date=today,
        ).aggregate(
            received=Count("id", filter=Q(referral_status="Request Completed")),
            processed=Count("id", filter=Q(referral_status="Sample Received by Lab")),
            pending=Count("id", filter=Q(referral_status="Request Accepted")),
            rejected=Count("id", filter=Q(referral_status="Request Terminated")),
            sent=Count('id', referring_facility=facility_id)
        )

        # Aggregate counts for last month
        last_month_stats = Referral.objects.filter(
            Q(referring_facility=facility_id) | Q(to_laboratory=facility_id),
            date_referred__date=last_month,
        ).aggregate(
            received=Count("id", filter=Q(referral_status="Request Completed")),
            processed=Count("id", filter=Q(referral_status="Sample Received by Lab")),
            pending=Count("id", filter=Q(referral_status="Request Accepted")),
            rejected=Count("id", filter=Q(referral_status="Request Terminated")),
            sent=Count("id", referring_facility=facility_id),
        )

        # Calculate percentage changes
        def percentage_change(today_count, last_month_count):
            if last_month_count == 0:
                return 100 if today_count > 0 else 0
            return ((today_count - last_month_count) / last_month_count) * 100

        change_received = percentage_change(
            today_stats["received"], last_month_stats["received"]
        )
        change_processed = percentage_change(
            today_stats["processed"], last_month_stats["processed"]
        )
        change_pending = percentage_change(
            today_stats["pending"], last_month_stats["pending"]
        )
        change_rejected = percentage_change(
            today_stats["rejected"], last_month_stats["rejected"]
        )

        data = {
            "samples_received": today_stats["received"],
            "samples_processed": today_stats["processed"],
            "samples_pending": today_stats["pending"],
            "samples_rejected": today_stats["rejected"],
            "change_received": change_received,
            "change_processed": change_processed,
            "change_pending": change_pending,
            "change_rejected": change_rejected,
            "samples_sent": today_stats["sent"] + last_month_stats['sent']
        }

        return Response(data)


class TrackReferralState(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferralTrackingSerializer

    def post(self, request, format=None):

        return self.create(request)

    def perform_create(self, serializer):
        referral_tracking_history = serializer.save()

        referral = referral_tracking_history.referral
        referral.referral_status = serializer.validated_data["status"]
        referral.save()

        if serializer.validated_data['status'] == 'Request Accepted':
            Notification.objects.create()


        return Response(serializer.data, status=status.HTTP_200_OK)


class TrackSampleState(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SampleTrackingSerializer

    def post(self, request, format=None):

        return self.create(request)

    def perform_create(self, serializer):
        tracking_history = serializer.save()

        sample = tracking_history.sample
        sample.sample_status = serializer.validated_data["status"]
        sample.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetReferralTrackerDetails(generics.ListAPIView):

    # permission_classes = [IsAuthenticated]
    serializer_class = ReferralTrackingSerializer

    def get_queryset(self, *args, **kwargs):

        referral_id = self.kwargs.get("referral_id")
        return ReferralTrackingHistory.objects.filter(referral=referral_id)


class GetSampleTrackerDetails(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = SampleTrackingSerializer

    def get_queryset(self, *args, **kwargs):

        sample_id = self.kwargs.get("sample_id")
        return SampleTrackingHistory.objects.filter(sample=sample_id).select_related('sample')
