from django.core.mail import EmailMessage
from .models import Client, OneTimePassword
from django.conf import settings
import pyotp
from django.core.exceptions import ValidationError
import asyncio
from django.utils import timezone


def generateotp():

	secret_key = pyotp.random_base32()
	totp = pyotp.TOTP(secret_key, interval=180, digits=6)
	otp = totp.now()

	return otp


# async def send_code_to_user(email):
def send_code_to_user(email):

    # loop = asyncio.get_event_loop()
    subject = 'Your one time verification code'
    otp_code = generateotp()

    user = Client.objects.get(email=email)

    verifcation_url = 'http://127.0.0.1:8000/api/user/verify-email/'
    html_message = f'Hi {user.first_name}, thanks for creating an account with us on {verifcation_url}. Use this code {otp_code} to verify your email.'
    to_email = user.email

    OneTimePassword.objects.update_or_create(
        user=user,
        defaults={
            "code": otp_code,
            "secrete": pyotp.random_base32(),
            # "expires_at": timezone.now() + timezone.timedelta(minutes=3),
        },
    )
    # OneTimePassword.objects.create(user=user, code=otp_code, secrete=pyotp.random_base32())
    from_email = settings.EMAIL_HOST_USER
    message = EmailMessage(subject, html_message, from_email, [to_email])

    try:

        # await loop.run_in_executor(None, message.send(fail_silently=False))
        message.send(fail_silently=False)

    except Exception as e:
        print(e)
        # raise ValidationError(str(e))

def run_async_function(email):
    asyncio.run(send_code_to_user(email))

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
		#raise ValidationError(str(e))
		print(e)		
