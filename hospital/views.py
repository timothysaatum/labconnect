from django.shortcuts import render
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from .models import Hospital
from django.contrib.auth.mixins import LoginRequiredMixin



class HomeView(TemplateView):
	
	template_name = 'hospital/index.html'



class CreateHospital(LoginRequiredMixin, CreateView):

	model = Hospital
	template_name = 'hospital/hospital-form.html'
	fields = ['name', 'hospital_type', 'digital_address', 'phone', 'email', 'website']
	success_url = '/'

	def form_valid(self, form):

		form.instance.created_by = self.request.user

		return super().form_valid(form)


class HospitalUpdate(UpdateView):

	model = Hospital
	template_name = 'hospital/delivery_form.html'
	success_url = '/'

	fields = ['name', 'hospital_type', 'digital_address', 'phone', 'email', 'website']

	def get_queryset(self):
		queryset = super().get_queryset()

		return queryset.filter(created_by=self.request.user)



class DeleteHospital(LoginRequiredMixin ,DeleteView):

	model = Hospital
	template_name = 'hospital/delete.html'
	success_url = '/'

	def get_queryset(self):
		queryset = super().get_queryset()

		return queryset.filter(created_by=self.request.user)
