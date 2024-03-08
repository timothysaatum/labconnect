from django.shortcuts import render
from django.views.generic import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Delivery
from rest_framework import viewsets
from .serializers import DeliverySerializer


class CreateDelivery(LoginRequiredMixin, CreateView):

	model = Delivery
	template_name = 'delivery/delivery_form.html'
	fields = ['name', 'digital_address', 'phone', 'email', 'website', 'cost_per_delivery']
	success_url = '/'

	def form_valid(self, form):

		#form = super().form_valid(form)
		form.instance.created_by = self.request.user

		return super().form_valid(form)


class DeliveryUpdate(UpdateView):

	model = Delivery
	template_name = 'delivery/delivery_form.html'
	success_url = '/'

	fields = ['name', 'digital_address', 'phone', 'email', 'website', 'cost_per_delivery']

	def get_queryset(self):
		queryset = super().get_queryset()

		return queryset.filter(created_by=self.request.user)


class DeleteDelivery(LoginRequiredMixin ,DeleteView):

	model = Delivery
	template_name = 'delivery/delete.html'
	success_url = '/'

	def get_queryset(self):
		queryset = super().get_queryset()

		return queryset.filter(created_by=self.request.user)


class ListDeliveryView(viewsets.ModelViewSet):

	serializer_class = DeliverySerializer

	queryset = Delivery.objects.all()