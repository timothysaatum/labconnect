from django.core.mail import EmailMessage
from .models import Client, OneTimePassword
from django.conf import settings
import pyotp
# import asyncio


def generateotp():

    secret_key = pyotp.random_base32()
    totp = pyotp.TOTP(secret_key, interval=180, digits=6)
    otp = totp.now()

    return otp


def send_code_to_user(email):
    subject = "Your One-Time Verification Code"
    otp_code = generateotp()

    # Get the user by email
    user = Client.objects.get(email=email)

    # Verification URL (update it to the actual deployment URL when live)
    verification_url = "https://api.labconnekt.com/user/verify-email/"

    # HTML formatted message
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
            }}
            .container {{
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .content {{
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
            }}
            h1 {{
                color: #333333;
            }}
            p {{
                color: #555555;
            }}
            .button {{
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Hi {user.first_name},</h1>
                <p>Thanks for creating an account with us!</p>
                <p>Please use the following code to verify your email:</p>
                <h2>{otp_code}</h2>
                <p>If you have any issues, visit <a href="{verification_url}">this link</a> to verify manually.</p>
                <p>Best Regards,<br>LabConnect Team</p>
            </div>
        </div>
    </body>
    </html>
    """

    to_email = user.email

    # Store the OTP code and secret in the database
    OneTimePassword.objects.update_or_create(
        user=user,
        defaults={"code": otp_code, "secrete": pyotp.random_base32()},
    )

    # Create the email and set it as HTML
    from_email = settings.EMAIL_HOST_USER
    message = EmailMessage(subject, html_message, from_email, [to_email])
    message.content_subtype = "html"  # This is important for HTML emails

    try:
        message.send(fail_silently=False)
        print("Email sent successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")


# def run_async_function(email):
#     asyncio.run(send_code_to_user(email))


def send_normal_email(data):

    email = EmailMessage(
        subject=data["email_subject"],
        body=data["email_body"],
        from_email=settings.EMAIL_HOST_USER,
        to=[data["to_email"]],
    )

    email.content_subtype = "html"

    try:

        email.send()

    except Exception as e:
        print(e)
