from rest_framework import serializers
from .models import Plan, Subscription, Incentive, Transaction, Bank


class PlanSerializer(serializers.ModelSerializer):

	class Meta:

		model = Plan
		fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):

	class Meta:

		model = Subscription
		fields = ('plan',)


class IncentiveSerializer(serializers.ModelSerializer):

    class Meta:

        model = Incentive
        fields = ('beneficient', 'number_of_requests', 'amortized_amount', 'is_withdrawn', 'balance', 'date_withdrawn')


class TransactionSerializer(serializers.ModelSerializer):

    channels = serializers.ListField()
    metadata = serializers.DictField(write_only=True)

    class Meta:

        model = Transaction

        fields = (
            "client",
            "referral",
            "amount",
            "channels",
            "metadata",
            "payment_mode",
            "email",
            "date_created",
            "updated_at",
        )

class BankSerializer(serializers.ModelSerializer):

    bank_name = serializers.CharField(read_only=True)
    code = serializers.CharField(read_only=True)
    bank_type = serializers.CharField(read_only=True)

    class Meta:
        model = Bank

        fields = (
            "bank_name",
            "code",
            "bank_type"
        )