from rest_framework import serializers
from .models import Plan, Subscription, Incentive


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