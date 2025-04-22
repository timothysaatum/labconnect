import dramatiq
from django.core.mail import EmailMessage
from .models import Client, OneTimePassword
from .utils import generateotp
from django.conf import settings
from rest_framework.exceptions import ValidationError
import pyotp





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
        verification_url = "https://labconnekt.com/user/verify-email/"

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
        # New user case - Validate data using serializer
        # user_data["is_admin"] = False
        # user_data["is_staff"] = False
        # user_data["account_type"] = "Laboratory"
        # user_data["is_worker"] = True
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