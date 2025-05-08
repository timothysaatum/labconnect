from django.contrib import admin # type: ignore
from .models import (
    Sample,
    Notification,
    SampleTrackingHistory,
    Referral,
    SampleTest,
    ReferralTrackingHistory,
)
from django.db.models import Q


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "referral_id",
        "referring_facility",
        "to_laboratory",
        "delivery",
        "patient_name",
        "is_completed",
        "referral_status",
        "date_referred",
    )
    list_filter = ("referral_status", "referring_facility", "to_laboratory")
    list_editable = (
        "referral_status",
    )
    ordering = ["-date_referred"]


@admin.register(SampleTest)
class SampleTestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sample",
        "test",
        "result",
        "status",
        "date_completed",
    )
    list_filter = ("status", "sample", "test")
    list_editable = ("status",)


class SampleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "referral",
        "sample_type",
        "sample_status",
        "get_rejection_reason",
        # "is_emmergency",
        "date_collected",
    )
    list_filter = ("sample_status", "referral", "sample_type")
    list_editable = (
        "sample_status",
    )

class NotificationAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'facility',
		'message',
		'is_read',
		'date_added',
		'date_modified'
	)

@admin.register(SampleTrackingHistory)
class SampleTrackingHistoryAdmin(admin.ModelAdmin):
    list_display = ("sample", "status", "updated_at")


@admin.register(ReferralTrackingHistory)
class ReferralTrackingHistoryAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        # Get the base queryset
        queryset = super().get_queryset(request)
        # print(queryset)
        return queryset

    list_display = ("referral", "status", "location", "updated_at")


admin.site.register(Sample, SampleAdmin)
admin.site.register(Notification, NotificationAdmin)
