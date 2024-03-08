from django.shortcuts import redirect
from django.views.generic.edit import FormView
from .forms import ClientRegisterationForm
from django.urls import reverse_lazy
from django.contrib import messages
from django.contrib.auth import authenticate, login





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