from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
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
    SampleTest
)
from django.db.models import Case, When, IntegerField, Q, Count
from django.utils.timezone import now, timedelta
from .paginators import QueryPagination
import logging
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.throttling import UserRateThrottle
from django.http import FileResponse, HttpResponseForbidden, Http404
from django.conf import settings
import os
import mimetypes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        logger.info(
            f"Referral creation attempt | User ID: {request.user.id} | "
            f"Type: {request.user.account_type} | IP: {request.META.get('REMOTE_ADDR')}"
        )
        
        # Log the content type and data keys for debugging file uploads
        logger.debug(f"Request content type: {request.content_type}")
        logger.debug(f"Request data keys: {list(request.data.keys())}")
        
        if 'attachment' in request.FILES:
            file_info = request.FILES['attachment']
            logger.debug(f"Attachment provided | Name: {file_info.name} | Size: {file_info.size}B | Type: {file_info.content_type}")
        
        # Check for required data
        referring_facility = request.data.get('referring_facility')
        to_laboratory = request.data.get('to_laboratory')
        
        if not referring_facility or not to_laboratory:
            missing = []
            if not referring_facility:
                missing.append('referring_facility')
            if not to_laboratory:
                missing.append('to_laboratory')
            
            logger.warning(
                f"Referral creation missing required fields | User ID: {request.user.id} | "
                f"Missing: {', '.join(missing)}"
            )
        
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        referring_facility = self.request.data.get('referring_facility')
        to_laboratory = self.request.data.get('to_laboratory')

        if referring_facility == to_laboratory:
            logger.warning(
                f"Validation error: Same facility referral attempt | User ID: {self.request.user.id} | "
                f"Facility/Lab ID: {referring_facility}"
            )
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
            logger.debug(f"Laboratory account referral | User ID: {self.request.user.id}")

        elif self.request.user.account_type == "Individual":
            referral_data.update({
                "sender_full_name": self.request.user.full_name,
                "sender_phone": self.request.user.phone_number,
                "sender_email": self.request.user.email,
            })
            logger.debug(f"Individual account referral | User ID: {self.request.user.id}")

        try:
            referral = serializer.save(**referral_data)
            logger.info(
                f"Referral created successfully | ID: {referral.id} | User: {self.request.user.id} | "
                f"From: {referring_facility} | To: {to_laboratory}"
            )
            
            # Log patient info securely (partial info for privacy)
            patient_name = self.request.data.get('patient_name', '')
            if patient_name:
                name_parts = patient_name.split()
                if len(name_parts) > 1:
                    # Log only first name and first letter of last name for privacy
                    logger.info(
                        f"Referral {referral.id} | Patient: {name_parts[0]} {name_parts[-1][0]}. | "
                        f"User: {self.request.user.id}"
                    )
            
            return referral
        except Exception as e:
            logger.error(
                f"Failed to create referral | User ID: {self.request.user.id} | "
                f"Error: {str(e)}"
            )
            raise


class UpdateReferral(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    queryset = Referral.objects.all()
    lookup_url_kwarg = 'referral_id'
    serializer_class = ReferralSerializer

    def perform_update(self, serializer):
        referral_id = self.kwargs.get(self.lookup_url_kwarg)
        
        logger.info(
            f"Referral update attempt | User ID: {self.request.user.id} | Referral ID: {referral_id}"
        )
        
        logger.debug(
            f"Update data | Referral ID: {referral_id} | Data: {self.request.data}"
        )

        try:
            referral = serializer.save()
            logger.info(
                f"Referral updated successfully | Referral ID: {referral.id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to update referral | Referral ID: {referral_id} | User ID: {self.request.user.id} | "
                f"Error: {str(e)}"
            )
            raise


class GetReferrals(generics.ListAPIView):
    throttle_classes = [UserRateThrottle]
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

        logger.info(
            f"Referral list view | User ID: {self.request.user.id} | Facility ID: {pk} | "
            f"Params: received={received}, sent={sent}, status={status}, from={from_date}, to={to_date}, "
            f"search={search_term}, is_archived={is_archived}, drafts={drafts}"
        )

        filters = Q()
        
        if received:
            filters &= Q(to_laboratory_id=pk) | Q(to_laboratory__branch__laboratory_id=pk)
            filters &= Q(is_completed=True, date_referred__gte=cutoff_date)
            logger.debug(f"Applying 'received' filter | Facility ID: {pk}")

        if sent:
            filters &= Q(referring_facility_id=pk) | Q(referring_facility__branch__laboratory_id=pk)
            filters &= Q(date_referred__gte=cutoff_date)
            logger.debug(f"Applying 'sent' filter | Facility ID: {pk}")

        if is_archived:
            filters &= Q(is_archived=True)
            logger.debug(f"Applying 'archived' filter | Facility ID: {pk}")

        queryset = Referral.objects.filter(filters)

        # Apply additional filtering
        queryset = filter_referrals(queryset, from_date, to_date, search_term, status, drafts, is_archived)
        logger.info(
            f"Referral queryset prepared | User ID: {self.request.user.id} | Facility ID: {pk} | "
            f"Queryset count: {queryset.count()}"
        )

        return queryset.order_by("-date_referred")
    
    def retrieve(self, request, *args, **kwargs):
        """Serve referral attachment securely if downloading"""
        referral_id = kwargs.get("pk")
        referral = get_object_or_404(Referral, pk=referral_id)

        if "download" in request.path:
            logger.info(
                f"File download attempt | User ID: {request.user.id} | Referral ID: {referral_id}"
            )

            if not request.user.is_staff and request.user != referral.referring_facility:
                logger.warning(
                    f"Unauthorized file access attempt | User ID: {request.user.id} | Referral ID: {referral_id}"
                )
                return HttpResponseForbidden("You do not have permission to access this file.")

            if not referral.referral_attachment:
                logger.warning(
                    f"File not found | Referral ID: {referral_id} | User ID: {request.user.id}"
                )
                raise Http404("File not found")

            file_path = os.path.join(settings.BASE_DIR, "private", referral.referral_attachment.name)
            logger.info(
                f"File served successfully | Referral ID: {referral_id} | User ID: {request.user.id}"
            )
            return FileResponse(open(file_path, "rb"), as_attachment=True)

        return super().retrieve(request, *args, **kwargs)


class ReferralDetailsView(generics.RetrieveAPIView):
    serializer_class = ReferralSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        referral_id = self.kwargs.get("referral_id")

        logger.info(
            f"Referral detail view | User ID: {self.request.user.id} | Referral ID: {referral_id}"
        )

        referral = get_object_or_404(Referral, id=referral_id)
        
        logger.debug(
            f"Referral object retrieved | Referral ID: {referral_id} | User ID: {self.request.user.id}"
        )
        
        return referral


class UpdateSample(generics.UpdateAPIView):
    throttle_classes = [UserRateThrottle]
    permission_classes = [IsAuthenticated]
    serializer_class = SampleSerializer
    lookup_url_kwarg = "sample_id"
    queryset = Sample.objects.all()

    def perform_update(self, serializer):
        sample_id = self.kwargs.get(self.lookup_url_kwarg)
        
        logger.info(
            f"Sample update attempt | User ID: {self.request.user.id} | Sample ID: {sample_id}"
        )
        
        logger.debug(
            f"Update data | Sample ID: {sample_id} | Data: {self.request.data}"
        )

        try:
            sample = serializer.save()
            logger.info(
                f"Sample updated successfully | Sample ID: {sample.id} | User ID: {self.request.user.id}"
            )
        except Exception as e:
            logger.error(
                f"Failed to update sample | Sample ID: {sample_id} | User ID: {self.request.user.id} | "
                f"Error: {str(e)}"
            )
            raise


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
            "Sample Received by Lab"
        )

        sample_status = (
            "Rejected"
        )

        notification = Notification.objects.filter(
            facility_id=self.kwargs.get("branch_id"),
            is_read=False,
            facility__referral__referral_status__in=request_status,
            facility__referral__samples__sample_status__in=sample_status,
            facility__referral__is_completed=True,
        ).order_by("-date_added").distinct()

        return notification


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
                return "0" if today_count == 0 else "100"
            return f"{int(abs((today_count - last_month_count) / last_month_count) * 100)}"

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
        print(Response(data).data)
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
        logger.info(
            f"Sample state tracking update | User ID: {request.user.id} | "
            f"IP: {request.META.get('REMOTE_ADDR')}"
        )
        
        # Log the request data for debugging
        sample_id = request.data.get('sample')
        status = request.data.get('status')
        
        if not sample_id or not status:
            missing = []
            if not sample_id:
                missing.append('sample_id')
            if not status:
                missing.append('status')
            
            logger.warning(
                f"Sample tracking missing required fields | User ID: {request.user.id} | "
                f"Missing: {', '.join(missing)}"
            )
        else:
            logger.debug(
                f"Sample tracking details | Sample ID: {sample_id} | "
                f"New Status: {status} | User: {request.user.id}"
            )

        return self.create(request)

    def perform_create(self, serializer):
        try:
            tracking_history = serializer.save()
            sample = tracking_history.sample
            new_status = serializer.validated_data["status"]
            old_status = sample.sample_status
            
            sample.sample_status = new_status
            sample.save()
            
            logger.info(
                f"Sample status updated | Sample ID: {sample.id} | "
                f"Status Change: {old_status} → {new_status} | "
                f"User: {self.request.user.id} | "
                f"Reference: {sample.referral.id if hasattr(sample, 'referral') else 'N/A'}"
            )
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(
                f"Failed to update sample status | User ID: {self.request.user.id} | "
                f"Sample ID: {serializer.validated_data.get('sample', 'unknown')} | "
                f"Error: {str(e)}"
            )
            raise


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


class DownloadReferralAttachment(APIView):
    throttle_classes = [UserRateThrottle]
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        logger.info(
            f"Referral attachment download attempt | User ID: {request.user.id} | "
            f"Referral ID: {pk} | IP: {request.META.get('REMOTE_ADDR')}"
        )
        
        try:
            referral = Referral.objects.get(pk=pk)

            if not referral.attachment:
                logger.warning(
                    f"Download attempt for non-existent attachment | User ID: {request.user.id} | "
                    f"Referral ID: {pk} | Access denied"
                )
                raise Http404("No attachment found.")

            file_path = referral.attachment.path

            # Check if the file actually exists
            if not os.path.exists(file_path):
                logger.warning(
                    f"File not found on server | User ID: {request.user.id} | "
                    f"Referral ID: {pk} | Path: {file_path}"
                )
                raise Http404("File does not exist on server.")

            content_type, _ = mimetypes.guess_type(file_path)
            file_size = os.path.getsize(file_path)
            file_name = os.path.basename(file_path)

            logger.info(
                f"File download successful | User ID: {request.user.id} | "
                f"Referral ID: {pk} | File: {file_name} | Size: {file_size}B | Type: {content_type}"
            )
            
            return FileResponse(
                open(file_path, "rb"),
                content_type=content_type or "application/octet-stream",
                as_attachment=True,
                filename=file_name,
            )

        except Referral.DoesNotExist:
            logger.warning(
                f"Download attempt for non-existent referral | User ID: {request.user.id} | "
                f"Requested ID: {pk} | Access denied"
            )
            raise Http404("Referral not found.")
        except Exception as e:
            logger.error(
                f"Error during file download | User ID: {request.user.id} | "
                f"Referral ID: {pk} | Error: {str(e)}"
            )
            raise


class DownloadTestResult(APIView):
    throttle_classes = [UserRateThrottle]
    permission_classes = [IsAdminUser]

    def get(self, request, pk, *args, **kwargs):
        logger.info(
            f"Test result download attempt | User ID: {request.user.id} | "
            f"Test ID: {pk} | IP: {request.META.get('REMOTE_ADDR')}"
        )
        
        try:
            sample_test = SampleTest.objects.get(pk=pk)
            
            if sample_test.test_result:
                file_path = sample_test.test_result.path
                file_name = os.path.basename(file_path)
                file_size = os.path.getsize(file_path)
                
                logger.info(
                    f"Test result download successful | User ID: {request.user.id} | "
                    f"Test ID: {pk} | File: {file_name} | Size: {file_size}B"
                )
                
                file = sample_test.test_result.open('rb')
                response = FileResponse(file)
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                
                return response
            else:
                logger.warning(
                    f"Test result file not found | User ID: {request.user.id} | "
                    f"Test ID: {pk} | Access denied"
                )
                raise Http404("File not found.")

        except SampleTest.DoesNotExist:
            logger.warning(
                f"Download attempt for non-existent test | User ID: {request.user.id} | "
                f"Requested ID: {pk} | Access denied"
            )
            raise Http404("SampleTest not found.")
        except Exception as e:
            logger.error(
                f"Error during test result download | User ID: {request.user.id} | "
                f"Test ID: {pk} | Error: {str(e)}"
            )
            raise