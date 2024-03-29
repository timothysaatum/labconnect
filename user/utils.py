import random
from django.core.mail import EmailMessage
from .models import Client, OneTimePassword
from django.conf import settings



def generateotp():

	otp = ''

	for _ in range(10):

		otp += str(random.randint(1, 9))

	return otp


def send_code_to_user(email):

	subject = 'Your one time verification code'
	otp_code = generateotp()
	user = Client.objects.get(email=email)

	current_site = 'labconnect.com'
	email_body = f'Hi {user.first_name}, thanks for creating an account with us on {current_site}. Use this code to verify your account with the code {otp_code}'
	to_email = email

	OneTimePassword.objects.create(user=user, code=otp_code)

	try:

		from_email = settings.EMAIL_HOST_USER
		message = EmailMessage(subject, email_body, from_email, [to_email])
		message.send(fail_silently=True)

	except Exception as e:

		print(e)


def send_normal_email(data):

	email = EmailMessage(
			subject=data['email_subject'],
			body=data['email_body'],
			from_email=settings.EMAIL_HOST_USER,
			to=[data['to_email']]
		)
	
	try:

		email.send()

	except Exception as e:
		print(e)