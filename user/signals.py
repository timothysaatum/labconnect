from .utils import send_code_to_user, send_normal_email, run_async_function
from .models import Client
from profiles.models import ClientProfile#, DeliveryUserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver
from textwrap import dedent
from threading import Thread




@receiver(post_save, sender=Client)
def email_user_on_creation(sender, instance, created, **kwargs):

	if created:
		email = instance.email
		send_code_to_user(email)
		#Thread(target=run_async_function, args=(email,)).start()
		ClientProfile.objects.create(client=instance)
		if instance.account_type == 'Laboratory':

			data = {
				'to_email': email,
				'email_subject': f'Hello {instance.full_name}, Thank You for Joining us',
				'email_body': dedent(f'''
						 You have successfully created your account with us. We are glad to see you.
						 Follow the link below to set up your laboratory in case you have not done
						 that yet.
						 Getting started: http://localhost:5173/getting-started
						 Thank you, kind regards.
						 LabConnect Team.
					''')
			}
			send_normal_email(data)

		# if instance.account_type == 'Delivery':
		# 	DeliveryUserProfile.objects.create(client=instance)