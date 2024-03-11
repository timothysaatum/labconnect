from django.shortcuts import render
from .serializers import (DeliverySerializer, DepartmentSerializer, TestSerializer, TestResultSerializer)
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
