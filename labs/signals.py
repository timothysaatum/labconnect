from user.utils import send_normal_email
from .models import BranchManagerInvitation, Laboratory, Branch
from django.db.models.signals import post_save
from django.dispatch import receiver
from textwrap import dedent
from .models import Result
from sample.models import Notification
from labs.utils import get_gps_coords




@receiver(post_save, sender=BranchManagerInvitation)
def mail_one_time_password(sender, instance, created, **kwargs):

	if created:
		email = instance.receiver_email
		invitation_code = instance.invitation_code
		print(email, invitation_code)
		data = {
			'email_subject': f'Hello {email}, {instance.branch.laboratory.created_by} Has Sent You an Import Request.',
			'to_email': email,
			'email_body': dedent(f'''
			Hello, I am inviting you to take the role as the branch manager at {instance.branch.town} of {instance.branch.laboratory}.

			Click on the link to accept my invitaion and assume the role as the branch manager.
			http://localhost:5173/accept-invite/{instance.id}/{invitation_code}/
			
			Thank you, kind regard.
			''')		
		}
		send_normal_email(data)



@receiver(post_save, sender=Laboratory)
def mail_lab_user(sender, instance, created, **kwargs):

	if created:
		email = instance.created_by.email
		close_icon = "\U0001F44C"
		data = {
			'email_subject': f'Hello {instance.created_by.full_name}, Your Lab was created successfully',
			'to_email': email,
			'email_body': dedent(f'''
			You have successfully added your laboratory, {instance.name} to your account.

			Your are this {close_icon} close to finishing your set up.
			Use any of the links below to set your branches and tests,  you haven't done so yet.
		
			Created a Branches for Laboratory here: http://127.0.0.1:8000/api/laboratory/create-branch/
			Add tests to your branch here: http://127.0.0.1:8000/api/laboratory/test/add/

			Thank you, kind regards.
			LabConnect Team.
			''')		
		}
		send_normal_email(data)


receiver(post_save, sender=Result)
def CreateNotificationForLab(sender, instance, created, **kwargs):

	if created:
		Notification.objects.create(
			message=f'New result: {instance.branch.name}',
			user=instance.hospital.created_by
        )


@receiver(post_save, sender=Branch)
def get_coords(sender, instance, created, **kwargs):

	if created:
		get_gps_coords(instance.digital_address)
		print(instance.digital_address)
		# instance.gps_coordinates = coords
