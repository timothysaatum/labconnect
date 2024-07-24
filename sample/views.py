from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .serializers import NotificatinSerializer
from sample.models import Notification


class UpdateNotification(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificatinSerializer

    def get_object(self):
        queryset = Notification.objects.all()
        print(queryset)
        obj = generics.get_object_or_404(queryset, id=self.request.user.id)
        print(obj)
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