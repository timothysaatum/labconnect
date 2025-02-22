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
from django.db.models import Case, When, IntegerField, Sum, Q, Count
from django.utils.timezone import now, timedelta # type: ignore
from .paginators import QueryPagination
import logging
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.throttling import UserRateThrottle


logger = logging.getLogger('labs')


def filter_referrals(
    referrals,
    from_date=None,
    to_date=None,
    search_term=None,
    status=None,
    drafts=None,
    is_archived=None):
    if from_date and to_date:
        referrals = referrals.filter(date__range=(from_date, to_date))

    if search_term:
        referrals = referrals.filter(patient_name__icontains=search_term)

    if status and status != "All":
        referrals = referrals.filter(referral_status__icontains=status)

    if drafts:
        referrals = referrals.filter(is_completed=False)

    if is_archived:
        referrals = referrals.filter(is_archived=True)

    return referrals


class CreateReferral(generics.CreateAPIView):
    throttle_classes = [UserRateThrottle]
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

        referral_data = {
            "facility_type": self.request.user.account_type,
            "referral_status": "Request Made",
        }

        # Handle details based on account type
        if self.request.user.account_type == "Laboratory":
            referral_data.update({
                "sender_full_name": self.request.user.full_name,
                "sender_phone": self.request.user.phone_number,
                "sender_email": self.request.user.email,
            })

        elif self.request.user.account_type == "Individual":
            referral_data.update({
                "sender_full_name": self.request.user.full_name,
                "sender_phone": self.request.user.phone_number,
                "sender_email": self.request.user.email,
            })

        referral = serializer.save(**referral_data)
        logger.info(f"User: <{self.request.user.id}> inserted <{referral.id}>")


class UpdateReferral(generics.UpdateAPIView):

    permission_classes = [IsAuthenticated]
    queryset = Referral.objects.all()
    lookup_url_kwarg = 'referral_id'
    serializer_class = ReferralSerializer

    def perform_update(self, serializer):
        logger.info(
            f"User {self.request.user.id} updated referral {self.lookup_url_kwarg}: {self.request.data}"
        )
        serializer.save()


# class GetReferrals(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]
#     pagination_class = QueryPagination
#     serializer_class = ReferralSerializer

#     def get_queryset(self):

#         pk = self.kwargs.get("facility_id")
#         status = self.request.GET.get("status")
#         from_date = self.request.GET.get("from_date")
#         to_date = self.request.GET.get("to_date")
#         search_term = self.request.GET.get("search")
#         received = self.request.GET.get("received")
#         sent = self.request.GET.get("sent")
#         drafts = self.request.GET.get('drafts')
#         is_archived = self.request.GET.get("is_archived")
#         cutoff_date = now() - timedelta(days=30)

#         queryset = Referral.objects.none()  # Default to an empty queryset
#         logger.info(
#             f"User: {self.request.user.id} attempted<{search_term}> search on referrals<{pk}>"
#         )

#         # Filter for received referrals
#         if received == "true":
#             queryset = Referral.objects.filter(
#                 Q(to_laboratory_id=pk) | Q(to_laboratory__branch__laboratory_id=pk),
#                 is_completed=True,
#                 date_referred__gte=cutoff_date,
#             )

#         # Filter for sent referrals
#         if sent == "true":
#             queryset = Referral.objects.filter(
#                 Q(referring_facility_id=pk)
#                 | Q(referring_facility__branch__laboratory_id=pk),
#                 date_referred__gte=cutoff_date,
#             )

#         queryset = filter_referrals(
#             queryset, from_date, to_date, search_term, status, drafts, is_archived
#         )

#         if sent == "true" and is_archived == "true":
#             queryset = Referral.objects.filter(
#                 Q(referring_facility_id=pk)
#                 | Q(referring_facility__branch__laboratory_id=pk),
#                 is_archived=True,
#             )
        
#         if received == "true" and is_archived == "true":
#             queryset = Referral.objects.filter(
#                 Q(referring_facility_id=pk)
#                 | Q(referring_facility__branch__laboratory_id=pk),
#                 is_archived=True,
#             )

#         return queryset.order_by("-date_referred")
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
        received = self.request.GET.get("received") == "true"
        sent = self.request.GET.get("sent") == "true"
        drafts = self.request.GET.get("drafts")
        is_archived = self.request.GET.get("is_archived") == "true"
        cutoff_date = now() - timedelta(days=30)

        logger.info(f"User: {self.request.user.id} searched referrals<{pk}> with term: {search_term}")

        filters = Q()
        
        if received:
            filters &= Q(to_laboratory_id=pk) | Q(to_laboratory__branch__laboratory_id=pk)
            filters &= Q(is_completed=True, date_referred__gte=cutoff_date)
        
        if sent:
            filters &= Q(referring_facility_id=pk) | Q(referring_facility__branch__laboratory_id=pk)
            filters &= Q(date_referred__gte=cutoff_date)

        if is_archived:
            filters &= Q(is_archived=True)

        queryset = Referral.objects.filter(filters)

        # Apply additional filtering
        queryset = filter_referrals(queryset, from_date, to_date, search_term, status, drafts, is_archived)

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
            facility__referral__is_completed=True
        ).order_by("-date_added").distinct()

        return notification


# class CountObjects(generics.GenericAPIView):

#     def get(self, request, facility_id, *args, **kwargs):
#         today = now().date()
#         thirty_days_ago = today - timedelta(days=30)
        
#         # Aggregated query for both today and last month stats
#         stats = Referral.objects.filter(
#             Q(referring_facility=facility_id) | Q(to_laboratory=facility_id),
#             date_referred__date__gte=thirty_days_ago,  # Limits the scope to the last 30 days
#         ).aggregate(
#             today_received=Count(
#                 Case(
#                     When(
#                         Q(date_referred__date=today, samples__sample_status="Received"),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             today_processed=Count(
#                 Case(
#                     When(
#                         Q(
#                             date_referred__date=today,
#                             samples__sample_status="Received",
#                         ),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             today_pending=Count(
#                 Case(
#                     When(
#                         Q(date_referred__date=today, samples__sample_status="Pending"),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             today_rejected=Count(
#                 Case(
#                     When(
#                         Q(date_referred__date=today, samples__sample_status="Rejected"),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             last_month_received=Count(
#                 Case(
#                     When(
#                         Q(
#                             date_referred__date__lt=today,
#                             date_referred__date__gte=thirty_days_ago,
#                             samples__sample_status="Received",
#                         ),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             last_month_processed=Count(
#                 Case(
#                     When(
#                         Q(
#                             date_referred__date__lt=today,
#                             date_referred__date__gte=thirty_days_ago,
#                             samples__sample_status="Received",
#                         ),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             last_month_pending=Count(
#                 Case(
#                     When(
#                         Q(
#                             date_referred__date__lt=today,
#                             date_referred__date__gte=thirty_days_ago,
#                             samples__sample_status="Pending",
#                         ),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#             last_month_rejected=Count(
#                 Case(
#                     When(
#                         Q(
#                             date_referred__date__lt=today,
#                             date_referred__date__gte=thirty_days_ago,
#                             samples__sample_status="Rejected",
#                         ),
#                         then=1,
#                     ),
#                     output_field=IntegerField(),
#                 )
#             ),
#         )

#         # Calculate percentage changes with safe handling for None
#         def percentage_change(today_count, last_month_count):
#             print('Last month count',last_month_count, 'Today count', today_count)
#             if not last_month_count:  # Handle division by zero and None
#                 return "0" if today_count else 0
#             return int(abs((today_count - last_month_count) / last_month_count) * 100)

#         # Prepare data
#         data = {
#             "samples_received": stats["today_received"] + stats["last_month_received"],
#             "samples_processed": stats["today_processed"],
#             "samples_pending": stats["today_pending"] + stats["last_month_pending"],
#             "samples_rejected": stats["today_rejected"] + stats["last_month_rejected"],
#             "change_received": percentage_change(
#                 stats["today_received"], stats["last_month_received"]
#             ),
#             "change_processed": percentage_change(
#                 stats["today_processed"], stats["last_month_processed"]
#             ),
#             "change_pending": percentage_change(
#                 stats["today_pending"], stats["last_month_pending"]
#             ),
#             "change_rejected": percentage_change(
#                 stats["today_rejected"], stats["last_month_rejected"]
#             ),
#         }

#         return Response(data)



class CountObjects(generics.GenericAPIView):
    def get(self, request, facility_id, *args, **kwargs):
        today = now().date()
        thirty_days_ago = today - timedelta(days=30)

        # Aggregated queries for stats
        stats = Referral.objects.filter(
            Q(referring_facility=facility_id) | Q(to_laboratory=facility_id)
        ).aggregate(
            today_sent=Count(
                Case(
                    When(
                        Q(referring_facility=facility_id, date_referred__date=today),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            today_received=Count(
                Case(
                    When(
                        Q(to_laboratory=facility_id, samples__sample_status="Received"),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            today_pending=Count(
                Case(
                    When(
                        Q(to_laboratory=facility_id, samples__sample_status="Pending"),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            today_rejected=Count(
                Case(
                    When(
                        Q(to_laboratory=facility_id, samples__sample_status="Rejected"),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            last_month_sent=Count(
                Case(
                    When(
                        Q(referring_facility=facility_id, date_referred__date__gte=thirty_days_ago, date_referred__date__lt=today),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            last_month_received=Count(
                Case(
                    When(
                        Q(to_laboratory=facility_id, samples__sample_status="Received", date_referred__date__gte=thirty_days_ago),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            last_month_pending=Count(
                Case(
                    When(
                        Q(to_laboratory=facility_id, samples__sample_status="Pending", date_referred__date__gte=thirty_days_ago),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
            last_month_rejected=Count(
                Case(
                    When(
                        Q(to_laboratory=facility_id, samples__sample_status="Rejected", date_referred__date__gte=thirty_days_ago),
                        then=1,
                    ),
                    output_field=IntegerField(),
                )
            ),
        )

        # Function to calculate percentage change
        def percentage_change(today_count, last_month_count):
            if last_month_count == 0:  # Avoid division by zero
                return "0%" if today_count == 0 else "100%"
            return f"{int(abs((today_count - last_month_count) / last_month_count) * 100)}%"

        # Prepare the response data
        data = {
            "samples_sent": stats["today_sent"],
            "samples_received": stats["today_received"],
            "samples_pending": stats["today_pending"],
            "samples_rejected": stats["today_rejected"],
            "change_sent": percentage_change(stats["today_sent"], stats["last_month_sent"]),
            "change_received": percentage_change(stats["today_received"], stats["last_month_received"]),
            "change_pending": percentage_change(stats["today_pending"], stats["last_month_pending"]),
            "change_rejected": percentage_change(stats["today_rejected"], stats["last_month_rejected"]),
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

    permission_classes = [IsAuthenticated]
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
