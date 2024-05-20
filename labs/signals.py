from user.utils import send_normal_email
from .models import BranchManagerInvitation
from django.db.models.signals import post_save
from django.dispatch import receiver




@receiver(post_save, sender=BranchManagerInvitation)
def create_room(sender, instance, created, **kwargs):

	if created:
		email = instance.receiver_email
		invitation_code = instance.invitation_code
		print(email, invitation_code)

