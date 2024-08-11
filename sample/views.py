from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .serializers import NotificatinSerializer, CountObjectsSerializer
from .models import Notification, Sample


class UpdateNotification(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificatinSerializer

    def get_object(self):

        queryset = Notification.objects.all()
        obj = generics.get_object_or_404(queryset, id=self.request.user.id)
        return obj

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetNotifications(generics.ListAPIView):
    serializer_class = NotificatinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    

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