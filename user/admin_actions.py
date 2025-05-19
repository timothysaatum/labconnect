from datetime import datetime, timedelta
import csv
from django.utils import timezone
from django.contrib import admin, messages
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def mark_as_contacted(modeladmin, request, queryset):
    """
    Mark selected entries as contacted.
    
    :param modeladmin: The ModelAdmin instance
    :param request: The current request
    :param queryset: Queryset of selected entries
    """
    updated_count = queryset.update(contacted=True, contacted_at=timezone.now())
    modeladmin.message_user(request, f"{updated_count} entries marked as contacted.")
mark_as_contacted.short_description = "Mark selected as contacted"

def export_as_csv(modeladmin, request, queryset):
    """
    Export selected entries as a CSV file.
    
    :param modeladmin: The ModelAdmin instance
    :param request: The current request
    :param queryset: Queryset of selected entries
    :return: HttpResponse with CSV file
    """
    meta = modeladmin.model._meta
    field_names = [field.name for field in meta.fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={meta}.csv'
    writer = csv.writer(response)

    writer.writerow(field_names)
    for obj in queryset:
        writer.writerow([getattr(obj, field) for field in field_names])

    return response
export_as_csv.short_description = "Export Selected as CSV"

def get_proposed_meeting_dates():
    """
    Generate three proposed meeting dates within the next two weeks.
    Only suggests weekdays (Monday-Friday).
    
    :return: List of three date strings in format 'Day, Month Date'
    """
    today = timezone.now().date()
    proposed_dates = []
    
    # Generate dates for the next two weeks
    current_date = today
    while len(proposed_dates) < 3:
        current_date += timedelta(days=1)
        
        # Only include weekdays (Monday to Friday)
        if current_date.weekday() < 5 and current_date.month == 5 and current_date <= datetime(2025, 5, 31).date():
            proposed_dates.append(current_date.strftime("%A, %B %d"))
    
    return proposed_dates

def email_selected_participants(modeladmin, request, queryset):
    """
    Admin action to email selected participants with meeting invitation.
    Requires email field in the model.
    
    :param modeladmin: The ModelAdmin instance
    :param request: The current request
    :param queryset: Queryset of selected entries
    """
    # Check if the model has an email field
    try:
        email_field = 'email'  # Customize this if your email field has a different name
        participants = [obj for obj in queryset if hasattr(obj, email_field) and getattr(obj, email_field)]
        
        if not participants:
            modeladmin.message_user(
                request, 
                "No valid email addresses found in the selected participants.", 
                level=messages.ERROR
            )
            return
    except AttributeError:
        modeladmin.message_user(
            request, 
            "Error: No email field found in the model.", 
            level=messages.ERROR
        )
        return

    # Generate proposed meeting dates for the template
    proposed_dates = get_proposed_meeting_dates()

    # Prepare email form
    if request.method == 'POST':
        # Process the email submission
        subject = request.POST.get('subject', 'Meeting Invitation from LabConnekt')
        message = request.POST.get("message", "We would like to schedule a meeting to discuss our medical sample referral system.")
        html_message = request.POST.get("html_message", "")  # Get HTML message if provided
        use_html = request.POST.get("use_html", "on") == "on"
        sender_name = request.POST.get("sender_name", "LabConnekt Team")
        
        # Use individual send_mail instead of send_mass_mail to avoid parsing issues
        successful_sends = 0
        failed_sends = 0
        
        for participant in participants:
            email = getattr(participant, email_field)
            try:
                if use_html:
                    # Get recipient name from model
                    if hasattr(participant, 'full_name'):
                        recipient_name = participant.full_name
                    elif hasattr(participant, 'first_name') and hasattr(participant, 'last_name'):
                        recipient_name = f"{participant.first_name} {participant.last_name}" or "Valued Healthcare Provider"
                    else:
                        recipient_name = "Valued Healthcare Provider"
                    
                    # Create context for template
                    context = {
                        'recipient_name': recipient_name,
                        'proposed_date_1': proposed_dates[0],
                        'proposed_date_2': proposed_dates[1],
                        'proposed_date_3': proposed_dates[2],
                        'sender_name': sender_name,
                        'message': html_message or message,
                        'participant': participant
                    }
                    
                    # Create an HTML email
                    html_content = render_to_string('admin/email_template.html', context)
                    text_content = strip_tags(html_content)  # Plain text version for clients that don't support HTML
                    
                    # Create the email message with both HTML and plain text
                    email_message = EmailMultiAlternatives(
                        subject=subject,
                        body=text_content,
                        from_email=settings.EMAIL_HOST_USER,
                        to=[email]
                    )
                    email_message.attach_alternative(html_content, "text/html")
                    email_message.send()
                else:
                    # Use standard plain text email
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[email],
                        fail_silently=False
                    )
                successful_sends += 1
                
                # Mark as contacted if successful
                if hasattr(participant, 'contacted'):
                    participant.contacted = True
                    participant.contacted_at = timezone.now()
                    participant.save()
                
            except Exception as e:
                failed_sends += 1
                modeladmin.message_user(
                    request, 
                    f"Failed to send email to {email}: {str(e)}", 
                    level=messages.ERROR
                )
        
        if successful_sends > 0:
            modeladmin.message_user(
                request, 
                f"Successfully sent {successful_sends} emails to selected participants.", 
                level=messages.SUCCESS
            )
        if failed_sends > 0:
            modeladmin.message_user(
                request, 
                f"Failed to send {failed_sends} emails.", 
                level=messages.WARNING
            )
        
        return None  # Prevent further action after sending

    # If not submitted, show a custom admin form
    from django import forms
    from django.template.response import TemplateResponse

    # Get sample HTML content for the form's initial value
    proposed_dates = get_proposed_meeting_dates()
    sample_html = f"""
    <p>Dear [Recipient Name],</p>
    
    <p>We hope this message finds you well. I'm reaching out on behalf of <strong>LabConnekt</strong>, a medical sample referral system designed to streamline laboratory processes and improve patient care in Ghana.</p>
    
    <p>We understand the challenges healthcare facilities face with sample management and referrals, and we've developed a solution that can help your organization:</p>
    
    <ul>
        <li>Reduce sample transit times</li>
        <li>Improve tracking and documentation</li>
        <li>Enhance communication between referring and receiving facilities</li>
        <li>Decrease errors in sample handling</li>
        <li>Access consolidated testing results faster</li>
    </ul>
    
    <p>As your facility is on our wait list, <strong>we would like to schedule a meeting</strong> to discuss further on our system and how we can enroll your facility. It will be a very brief 30 minutes meeting</p>
    
    <p>Please let us know which of the following times would work for your team:</p>
    
    <p><strong>Proposed Meeting Dates:</strong></p>
    <p>• {proposed_dates[0]} - Morning (07:00 AM) or Afternoon (2:00 PM)</p>
    <p>• {proposed_dates[1]} - Morning (07:00 AM) or Afternoon (2:00 PM)</p>
    <p>• {proposed_dates[2]} - Morning (07:00 AM) or Afternoon (2:00 PM)</p>
    
    <p>If none of these times work for you, please suggest an alternative (in-person meeting or another day) that would be more convenient.</p>
    
    <p>We're excited about the opportunity to work with your facility and contribute to improving healthcare delivery in our community.</p>
    p>Hoping to hear from you soon.</p>
    <p>Thank you for your time and consideration.</p>
    """

    class EmailForm(forms.Form):
        subject = forms.CharField(max_length=200, initial="Meeting Invitation from LabConnekt")
        message = forms.CharField(
            widget=forms.Textarea, 
            initial="We would like to schedule a meeting to discuss our medical sample referral system."
        )
        html_message = forms.CharField(
            widget=forms.Textarea,
            required=False,
            initial=sample_html,
            help_text="HTML content for the email template. Variables like recipient_name will be replaced automatically."
        )
        use_html = forms.BooleanField(
            initial=True,
            required=False,
            help_text="Send email as HTML using our professional template"
        )
        sender_name = forms.CharField(
            max_length=100,
            initial="LabConnekt Team",
            help_text="Your name or team name that will appear in the email signature"
        )

    # Render a custom admin form for email composition
    context = {
        'title': "Schedule Meetings with Selected Participants",
        'form': EmailForm(),
        'queryset': queryset,
        'opts': modeladmin.model._meta,
        'total_count': queryset.count(),
        'proposed_dates': proposed_dates,
    }
    return TemplateResponse(
        request, 
        'admin/custom_email_action.html', 
        context
    )

# Descriptive action name
email_selected_participants.short_description = "Schedule Meetings with Selected Participants"