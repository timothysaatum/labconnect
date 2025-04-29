from .tasks import send_code_to_user, send_normal_email, send_support_email, send_waitlist_email
from .models import Client, WaitList, CustomerSupport
from django.db.models.signals import post_save
from django.dispatch import receiver
from textwrap import dedent


@receiver(post_save, sender=Client)
def email_user_on_creation(sender, instance, created, **kwargs):

    if created:
        email = instance.email
        send_code_to_user.send(email)
        if instance.account_type == "Laboratory":

            data = {
                "to_email": email,
                "email_subject": f"Hello {instance.full_name}, Thank You for Joining us",
                "email_body": dedent(
                    f"""
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
                    <h1>Hello {instance.full_name},</h1>
                    <p>You have successfully created your account with us. We are glad to see you.</p>
                    <p>Follow the link below to set up your laboratory in case you have not done that yet.</p>
                    <a href="https://www.labconnekt.com/sign-in" class="button">Getting Started</a>
                    <p>Thank you, kind regards.<br>LabConnect Team</p>
                </div>
            </div>
        </body>
        </html>
    """
                ),
            }
            send_normal_email.send(data)


@receiver(post_save, sender=CustomerSupport)
def email_user_on_creation(sender, instance, created, **kwargs):
    if not created:
        return

    # build a simple data payload for the task
    data = {
        "email": instance.client.email,
        "full_name":  instance.client.first_name + instance.client.last_name,
        "subject": instance.subject,
        "message": instance.message,
        "created_at": instance.created_at.strftime("%B %d, %Y at %I:%M %p")
    }

    send_support_email.send(data)



@receiver(post_save, sender=WaitList)
def email_waitlist_on_creation(sender, instance, created, **kwargs):
    if not created:
        return

    # build payload
    data = {
        "email":       instance.email,
        "full_name":  instance.full_name or instance.email.split('@')[0],
        "phone_number":    instance.phone_number or "our service",
        "joint_at":       instance.created_at.strftime("%B %d, %Y at %I:%M %p"),
    }

    # enqueue the job
    send_waitlist_email.send(data)