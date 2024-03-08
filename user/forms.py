from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField, UserCreationForm
from django.core.exceptions import ValidationError
from .models import Client
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags




class ClientCreationForm(forms.ModelForm):

    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = Client
        fields = ('email', 'phone_number')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user



class ClientChangeForm(forms.ModelForm):

    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = Client
        fields = ('email', 'first_name', 'middle_name', 'last_name', 
            'phone_number', 'digital_address', 'emmergency_number',
            'has_lab', 'password', 'is_active', 'is_admin')



class ClientRegisterationForm(UserCreationForm):

    #defining form fields that the client will fill
    
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder':'e.g example@gmail.com'}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Angela'}))
    middle_name = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder':'Saatum'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Suurweh'}))
    phone_number = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'0594438287'}))
    digital_address = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'XL-1999-0000'}))
    emmergency_number = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'0245623553'}))
    id_number = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Ghana Card or Passport №'}))


    #send email after validating the user data to tell them their account was successfully 
    #created
    def send_email(self):

        from_email = settings.EMAIL_HOST_USER
        to_email = self.cleaned_data['email']

        user_full_name = self.cleaned_data['first_name'] + ' ' + self.cleaned_data['last_name']

        context = {'user_full_name': user_full_name}

        html_template = 'user/email_msg.html'
        html_message = render_to_string(html_template, context=context)
        subject = 'Account created successfully'
        plain_message = strip_tags(html_message)
        message = EmailMessage(subject, html_message, from_email, [to_email])
        message.content_type = 'html'
        message.send()


    class Meta:
        model = Client

        fields = [
            'email', 'first_name', 'middle_name', 'last_name', 'gender' 
            ,'phone_number', 'digital_address', 
            'emmergency_number', 'id_number', 'has_lab'
        ]