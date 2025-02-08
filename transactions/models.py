from datetime import timedelta
from django.db import models
from django.contrib.auth import get_user_model
from sample.models import Referral
from encrypted_model_fields.fields import (
    EncryptedCharField,
    # EncryptedTextField,
    EncryptedBooleanField,
    EncryptedEmailField,
)
import uuid
from django.db.models import TextChoices
from decimal import Decimal
from django.core.exceptions import ValidationError
user_account = get_user_model()
import re




def validate_reference(value):
    # Regular expression to match UUID format (with or without hyphens)
    uuid_regex = re.compile(
        r"^[a-fA-F0-9]{8}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{12}$"
    )
    if not uuid_regex.match(value):
        raise ValidationError(f"{value} is not a valid UUID.")


class PaymentMode(TextChoices):
    ONLINE = "Online", "Online"
    BANK = "Bank", "Bank"
    INSURANCE = "Insurance", "Insurance"


class Plan(models.Model):

    name = models.CharField(max_length=100, default="Free Plan")
    duration = models.DurationField(default=timedelta(days=9999))
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    date_added = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} - {self.subscription.first().subscriber}'


class Subscription(models.Model):

    plan = models.ForeignKey(
        Plan, on_delete=models.CASCADE, related_name="subscription"
    )
    subscriber = models.ForeignKey(
        user_account,
        on_delete=models.CASCADE,
        related_name="subscription",
        db_index=True,
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    balance = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    is_renewed = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False, db_index=True)
    has_expired = models.BooleanField(default=False)
    date_of_subscription = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('plan', 'subscriber')

    def __str__(self):
        return self.plan.name

    def save(self, *args, **kwargs):

        self.price = self.plan.price

        super().save(*args, **kwargs)


class Incentive(models.Model):

    beneficient = models.ForeignKey(user_account, on_delete=models.CASCADE, related_name='Incentives', db_index=True)
    number_of_requests = models.PositiveIntegerField(default=0)
    amortized_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_withdrawn = models.BooleanField(default=False)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date_withdrawn = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["beneficient"], name="unique_beneficient")
        ]

    def __str__(self):
        return self.beneficient.last_name

    @property
    def emmergency_contact(self):
        return self.beneficient.emmergency_number

    @property
    def email(self):
        return self.beneficient.email

    @property
    def tel(self):
        return self.beneficient.phone_number


# PAYMENT_MODE = [
# 	('Online', 'Online'),
# 	('Bank', 'Bank'),
# 	('Insurance','Insurance')
# ]

PAYMENT_STATUS = [("Completed", "Completed"), ("Pending", "Pending")]
class Transaction(models.Model):
    client = models.ForeignKey(
        user_account, on_delete=models.SET_NULL, blank=True, null=True, db_index=True
    )
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE)
    amount = EncryptedCharField(max_length=100)
    channels = EncryptedCharField(max_length=100)
    email = EncryptedEmailField()
    payment_mode = EncryptedCharField(choices=PaymentMode.choices, max_length=50)
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS)
    is_verified = EncryptedBooleanField(default=False)
    reference = models.CharField(
        max_length=36,
        unique=True,
        default=str(uuid.uuid4),
        validators=[validate_reference],
    )
    updated_at = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Payments"

    def __str__(self):
        return f"{str(self.client)} - {self.amount}"

    @property
    def amount_decimal(self):
        # Convert the string back to a Decimal
        return Decimal(self.amount)

    @amount_decimal.setter
    def amount_decimal(self, value):
        # Set the Decimal value as a string
        self.amount = str(value)

    @property
    def account_type(self):
        return self.client.account_type

    @property
    def tel(self):
        return self.client.phone_number


class Bank(models.Model):
    bank_name = models.CharField(max_length=255)
    code = models.CharField(max_length=155)

    def __str__(self):
        return self.bank_name