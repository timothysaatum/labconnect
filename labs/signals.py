from user.tasks import send_normal_email
from .models import BranchManagerInvitation, Laboratory
from django.db.models.signals import post_save
from django.dispatch import receiver
from textwrap import dedent
import logging


logger = logging.getLogger(__name__)


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
                    <p><a href="https://labconnekt.com/accept-invite/{instance.id}/{invitation_code}/" class="button">Accept Invitation</a></p>
                    <p>Thank you, kind regards.</p>
                    <p>LabConnect Team</p>
                </div>
            </div>
        </body>
        </html>
    """
            ),
        }
        print(f"https://labconnekt.com/accept-invite/{instance.id}/{invitation_code}/")
        send_normal_email.send(data)


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
                    <p>You are this {close_icon} close to finishing your setup.</p>
                    <p>Use the links below to set up your branches and tests, if you haven’t done so already:</p>
                    <p>
                        <a href="https://labconnekt.com/laboratory/create-branch/" class="button">Create Branches for Laboratory</a><br>
                        <a href="https://labconnekt.com/laboratory/test/add/" class="button">Add Tests to Your Branch</a>
                    </p>
                    <p>Thank you, kind regards.<br>LabConnect Team</p>
                </div>
            </div>
        </body>
        </html>
    """
            ),
        }
        send_normal_email.send(data)
