from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
#from rest_framework.serializers import (
#    ModelSerializer,
#    PrimaryKeyRelatedField,
#    ManyToManyRelatedField,
#)
from rest_framework.viewsets import ModelViewSet  # Consider using ModelViewSets for related resources
from rest_framework.filters import SearchFilter
from django.db.models import Q
from django.shortcuts import get_object_or_404  # Avoid repetitive try-except blocks
from rest_framework.decorators import action  # Use actions for specific endpoints

from .models import (
    Test,
    Branch,
    Laboratory,
    LaboratorySample,
    TestResult,
    Sample,  # Assuming models are defined here
)
from .serializers import (
    LaboratorySerializer,
    TestSerializer,
    TestResultSerializer,
    BranchSerializer,
    LaboratorySampleSerializer,
    SampleSerializer,
)
from .cache import laboratory_cache  # Implement custom cache (replace with your caching strategy)


class PermissionMixin(object):
    permission_classes = [IsAuthenticated]

    def has_laboratory_permission(self):
        return self.request.user.account_type == 'Laboratory' and (
            self.request.user.is_staff or self.request.user.is_admin
        )

    def has_laboratory_permission_to_edit_branch(self, user, branch):
        return (
            user.is_authenticated and
            (
                (user == branch.laboratory.created_by) or
                (user == branch.branch_manager)
            )
        )


class LaboratoryViewSet(ModelViewSet):
    """
    API endpoint for managing laboratories (Create, Read, Update, Delete, List).
    """
    serializer_class = LaboratorySerializer
    permission_classes = [IsAuthenticated & PermissionMixin]  # Combine permissions

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_admin:
            return Laboratory.objects.all()
        return Laboratory.objects.filter(created_by=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated & PermissionMixin])
    def create_branch(self, request, pk=None):
        # Create branch associated with the laboratory
        laboratory = get_object_or_404(Laboratory, pk=pk)
        serializer = BranchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(laboratory=laboratory)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        laboratory_cache.clear()  # Clear cache after laboratory creation


class BranchViewSet(ModelViewSet):
    """
    API endpoint for managing branches (Create, Read, Update, Delete, List).
    Includes filtering by laboratory and fetching related tests.
    """
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated & PermissionMixin]
    filter_backends = [SearchFilter]  # Enable search functionality

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_admin:
            return Branch.objects.all()
        return Branch.objects.filter(
            Q(laboratory__created_by=user) | Q(branch_manager=user)
        ).select_related('laboratory')  # Prefetch laboratory data

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if 'pk' in self.kwargs:
            branch = get_object_or_404(Branch, pk=self.kwargs['pk'])
            context['tests'] = branch.test_set.all()  # Preload related tests
        return context

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated & PermissionMixin])
    def add_tests(self, request, pk=None):
        # Add tests to a branch
        branch = get_object_or_404(Branch, pk=pk)
        tests = request.data.getlist('tests')  # Get list of test IDs
        branch.test_set.add(*tests)  # Efficiently add multiple tests
        return Response(status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        # Clear existing tests before updating
        branch = serializer.save()
        branch.test_set.clear()
        tests = request.data.getlist('tests')
        branch.test_set.add(*tests)
        laboratory_cache.clear()  # Clear cache after branch update



class TestViewSet(ModelViewSet):
    """
    API endpoint for managing tests (Create, Read, Update, Delete, List).
    Includes filtering by branch and laboratory.
    """
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated & PermissionMixin]
    filter_backends = [SearchFilter]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_admin:
            return Test.objects.all()
        return Test.objects.filter(
            Q(branch__laboratory__created_by=user) | Q(branch__branch_manager=user)
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if 'pk' in self.kwargs:
            test = get_object_or_404(Test, pk=self.kwargs['pk'])
            context['branch'] = test.branch  # Preload related branch
        return context

    def perform_create(self, serializer):
        # Add tests to branches efficiently
        test = serializer.save()
        branches = self.request.data.getlist('branches')
        test.branch.add(*branches)
        laboratory_cache.clear()  # Clear cache after test creation


class TestResultViewSet(ModelViewSet):
    """
    API endpoint for managing test results (Create, Read, Update, Delete, List).
    Includes filtering by branch and laboratory.
    """
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated & PermissionMixin]

    def get_queryset(self):
        user = self.request.user
        return TestResult.objects.filter(
            Q(branch__laboratory__created_by=user) | Q(branch__branch_manager=user)
        )

    def perform_create(self, serializer):
        serializer.save(send_by=self.request.user)
        laboratory_cache.clear()  # Clear cache after test result creation


class SampleViewSet(ModelViewSet):
    """
    API endpoint for managing hospital samples received by laboratories (List).
    Includes filtering by laboratory.
    """
    serializer_class = SampleSerializer
    permission_classes = [IsAuthenticated & PermissionMixin]

    def get_queryset(self):
        user = self.request.user
        return Sample.objects.filter(
            Q(lab__laboratory__created_by=user) | Q(lab__branch_manager=user)
        )


class LaboratorySampleViewSet(ModelViewSet):
    """
    API endpoint for managing laboratory samples (Create, Read, Update, Delete, List).
    Includes filtering by laboratory and adding tests.
    """
    serializer_class = LaboratorySampleSerializer
    permission_classes = [IsAuthenticated & PermissionMixin]

    def get_queryset(self):
        user = self.request.user
        return LaboratorySample.objects.filter(
            Q(to_lab__branch_manager=user) | Q(to_lab__laboratory__created_by=user)
        )

    def perform_create(self, serializer):
        sample = serializer.save(send_by=self.request.user)
        tests = request.data.getlist('tests')
        sample.tests.add(*tests)
        laboratory_cache.clear()  # Clear cache after laboratory sample creation

    def perform_update(self, serializer):
        sample = serializer.save()
        sample.tests.clear()  # Clear existing tests
        tests = request.data.getlist('tests')
        sample.tests.add(*tests)
        laboratory_cache.clear()  # Clear cache after laboratory sample update


