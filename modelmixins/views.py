from .models import TestTemplate, Department
from rest_framework.generics import ListAPIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import( DepartmentSerializer, BulkDepartmentSerializer, TestTemplateSerializer)
from rest_framework.throttling import UserRateThrottle


class FetchTestTemplates(ListAPIView):
    throttle_classes = [UserRateThrottle]
    serializer_class = TestTemplateSerializer
    queryset = TestTemplate.objects.all()


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = BulkDepartmentSerializer(data={'departments': request.data})
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Departments created successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)
