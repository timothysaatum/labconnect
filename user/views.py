from django.shortcuts import redirect
from django.views.generic.edit import FormView
from .forms import ClientRegisterationForm
from django.urls import reverse_lazy
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework import viewsets
from .serializers import UserSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status





class RegisterView(FormView):

	form_class = ClientRegisterationForm
	template_name = 'user/register.html'
		

	def form_valid(self, form):
		
		form.save()
		username = form.cleaned_data['email']
		password = form.cleaned_data['password1']

		#authenticate and login the user into their account
		user = authenticate(self.request, username=username, password=password)

		if user is not None:
			try:
				
				login(self.request, user)
				form.send_email()

			except Exception as e:

				messages.add_message(self.request, messages.INFO, f'e')

			messages.add_message(self.request, messages.SUCCESS, 'Account created successfully')

			return redirect('hostel:home')


		return super(RegisterView, self).form_valid(form)



class CreateUserView(GenericAPIView):

	serializer_class = UserSerializer

	def post(self, request):

		user_data = request.data
		serializer=self.serializer_class(data=user_data)

		if serializer.is_valid(raise_exception=True):
			serializer.save()
			user = serializer.data

			return Response(
					{'data': user}
				)

		return Response(serializer.erros, status.HTTP_400_BAD_REQUEST)