from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Expense

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
      
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}