from user.utils import send_normal_email
from .models import BranchManagerInvitation, Laboratory, Branch
from django.db.models.signals import post_save # type: ignore
from django.dispatch import receiver # type: ignore
from textwrap import dedent
# from sample.models import Notification
from labs.utils import get_gps_coords


@receiver(post_save, sender=BranchManagerInvitation)
def mail_one_time_password(sender, instance, created, **kwargs):

    if created:
        email = instance.receiver_email
        invitation_code = instance.invitation_code
        print(email, invitation_code)
        data = {
            "email_subject": f"Hello {email}, {instance.branch.laboratory.created_by} Has Sent You an Import Request.",
            "to_email": email,
            "email_body": dedent(
                f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    color: #333333;
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
                    color: #4CAF50;
                }}
                p {{
                    font-size: 16px;
                    line-height: 1.5;
                }}
                .button {{
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;
                    font-size: 16px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <h1>Invitation to Branch Manager Role</h1>
                    <p>Hello,</p>
                    <p>I am inviting you to take the role of branch manager at {instance.branch.town} for {instance.branch.laboratory}.</p>
                    <p>Click the link below to accept my invitation and assume the role:</p>
                    <p><a href="http://localhost:5173/accept-invite/{instance.id}/{invitation_code}/" class="button">Accept Invitation</a></p>
                    <p>Thank you, kind regards.</p>
                    <p>LabConnect Team</p>
                </div>
            </div>
        </body>
        </html>
    """
            ),
        }
        send_normal_email(data)


@receiver(post_save, sender=Laboratory)
def mail_lab_user(sender, instance, created, **kwargs):

    if created:
        email = instance.created_by.email
        close_icon = "\U0001F44C"
        data = {
            "email_subject": f"Hello {instance.created_by.full_name}, Your Lab was created successfully",
            "to_email": email,
            "email_body": dedent(
                f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    color: #333333;
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
                    color: #4CAF50;
                }}
                p {{
                    font-size: 16px;
                    line-height: 1.5;
                }}
                .button {{
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 5px;
                    font-size: 16px;
                    margin-top: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <h1>Hello {instance.created_by.full_name},</h1>
                    <p>Congratulations! You have successfully added your laboratory, <strong>{instance.name}</strong>, to your account.</p>
                    <p>You are {close_icon} close to finishing your setup.</p>
                    <p>Use the links below to set up your branches and tests, if you haven’t done so already:</p>
                    <p>
                        <a href="http://127.0.0.1:8000/api/laboratory/create-branch/" class="button">Create Branches for Laboratory</a><br>
                        <a href="http://127.0.0.1:8000/api/laboratory/test/add/" class="button">Add Tests to Your Branch</a>
                    </p>
                    <p>Thank you, kind regards.<br>LabConnect Team</p>
                </div>
            </div>
        </body>
        </html>
    """
            ),
        }
        send_normal_email(data)


@receiver(post_save, sender=Branch)
def get_coords(sender, instance, created, **kwargs):

    if created:
        try:
            latitude, longitude = get_gps_coords(instance.digital_address)
            instance.gps_coordinates = f'{latitude}, {longitude}'
            instance.save()
        except Exception as e:
            print(str(e))
