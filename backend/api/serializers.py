from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Expense
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
      
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ExpenseSerializer(serializers.ModelSerializer):
    idempotency_key = serializers.UUIDField(write_only=True)

    class Meta:
        model = Expense
        fields = ["id", "amount", "category", "description", "date", "created_at", "idempotency_key"]
        extra_kwargs = {
            "user": {"read_only": True},
            }

    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Amount cannot be negative.")
        return value

    def validate_date(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Date cannot be in the future.")
        return value