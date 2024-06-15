from user.utils import send_normal_email
from .models import BranchManagerInvitation
from django.db.models.signals import post_save
from django.dispatch import receiver
from textwrap import dedent




@receiver(post_save, sender=BranchManagerInvitation)
def create_room(sender, instance, created, **kwargs):

	if created:
		email = instance.receiver_email
		invitation_code = instance.invitation_code
		print(email, invitation_code)
		data = {
			'email_subject': f'Hello {email}, {instance.branch.laboratory.created_by} Has Sent You an Import Request.',
			'to_email': email,
			'email_body': dedent(f'''
			Hello, I am inviting you to take the role as the branch manager at {instance.branch.name} of {instance.branch.laboratory}.
			
			Click on the link to accept my invitaion and assume the role as the branch manager.
			http://127.0.0.1:8000/api/user/branch-manager-accept-invite/{instance.branch.id}/{invitation_code}/
			Thank you, kind regards.
			''')		
		}
		send_normal_email(data)

