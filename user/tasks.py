import dramatiq
from django.core.mail import EmailMessage
from .models import Client, OneTimePassword
from .utils import generateotp
from django.conf import settings
from rest_framework.exceptions import ValidationError
import pyotp
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from sample.models import Notification
from uuid import UUID
from modelmixins.models import Facility





@dramatiq.actor(
    max_retries=5, 
    min_backoff=1000, 
    max_backoff=10000, 
    store_results=True
)
def send_code_to_user(email):
    subject = "Your One-Time Verification Code"
    otp_code = generateotp()

    try:
        # Get the user by email
        user = Client.objects.get(email=email)

        # Verification URL (update it to the actual deployment URL when live)
        verification_url = "https://labconnekt.com/verify-email"

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

        # Store the OTP code and secret in the database
        OneTimePassword.objects.update_or_create(
            user=user,
            defaults={"code": otp_code, "secrete": pyotp.random_base32()},
        )

        to_email = user.email
        from_email = settings.EMAIL_HOST_USER

        # Create the email and set it as HTML
        message = EmailMessage(subject, html_message, from_email, [to_email])
        message.content_subtype = "html"  # This is important for HTML emails

        # Send the email
        message.send(fail_silently=False)
        print(f"Email sent successfully to {email}.")

    except Exception as e:
        print(f"An error occurred while sending email: {e}")


@dramatiq.actor(
    max_retries=5, 
    min_backoff=1000, 
    max_backoff=10000
)
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
        print(f"Email sent to {data['to_email']}")
    except Exception as e:
        print(f"Error sending email: {e}")


@dramatiq.actor(
    max_retries=5, 
    min_backoff=1000, 
    max_backoff=10000
)
def send_support_email(data):
    
    html_message = render_to_string("emails/support_confirmation.html", {
        'full_name': data["full_name"],
        'subject':         data["subject"],
        'message':         data["message"],
        'created_at':      data["created_at"],
    })
    
    plain_message = strip_tags(html_message)

    email = EmailMessage(
        subject=f"We’ve Received Your {data['support_type'].title()} Request",
        body=html_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[data["email"]],
    )
    # tell Django this is HTML
    email.content_subtype = "html"

    try:
        email.send(fail_silently=False)
        print(f"Support email sent to {data['email']}")
    except Exception as e:
        print(f"Error sending support email: {e}")
        # re-raise so Dramatiq will retry
        raise


@dramatiq.actor(
    max_retries=5,
    min_backoff=1000,
    max_backoff=10000
)
def send_waitlist_email(data):
    """
    data keys:
      - email
      - full_name
      - joint_at (formatted string)
    """
    html_message = render_to_string("emails/waitlist_confirmation.html", {
        'full_name': data["full_name"],
        'phone_number': data["phone_number"],
        'joint_at': data["joint_at"],
    })
    plain_message = strip_tags(html_message)

    email = EmailMessage(
        subject="You’ve Been Added to the Waitlist!",
        body=html_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[data["email"]],
    )

    email.content_subtype = "html"

    try:
        email.send(fail_silently=False)
        print(f"Waitlist email sent to {data['email']}")
    except Exception as e:
        print(f"Error sending waitlist email: {e}")
        raise


@dramatiq.actor(
    max_retries=5, 
    min_backoff=1000, 
    max_backoff=10000, 
    store_results=True
)
def create_user(user_data):
    from .serializers import UserCreationSerializer
    """
    Handles user creation and branch assignment:
    - If a user_id is provided, assign the user to the specified branches (if not already assigned).
    - If no user_id is provided, validate data, create a new user using serializer.save(), and assign branches.
    """
    # user_data = request.data
    user_id = user_data.get("id", None)
    branch_data = user_data.pop("branches", [])

    if user_id:
        # Existing user case
        try:
            client = Client.objects.get(id=user_id)
        except Client.DoesNotExist:
            raise ValidationError({"user_id": "User not found."})

    else:

        serializer = UserCreationSerializer(data=user_data)
        serializer.is_valid(raise_exception=True)
        
        # Create user using serializer.save()
        client = serializer.save(
            is_worker=True, 
            account_type="Laboratory", 
            is_admin=False,
            is_staff=False
        )

    # Assign user to branches if not already assigned
    existing_branches = set(client.work_branches.values_list("id", flat=True))
    new_branches = set(branch_data) - existing_branches  # Only add new branches

    if new_branches:
        client.work_branches.add(*new_branches)

    return True


@dramatiq.actor(max_retries=5, min_backoff=1000, max_backoff=10000)
def notify_user(*args):
    facility, title, message = args
    _facility = Facility.objects.get(id=facility)
    Notification.objects.create(
        facility= _facility,
        title=title,
        message=message
    )

