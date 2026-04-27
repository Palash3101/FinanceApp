from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, ExpenseSerializer
from rest_framework.permissions import AllowAny,  IsAuthenticated
from .models import Expense
from rest_framework.response import Response
from django.db.models import Sum

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Expense.objects.filter(user=user)
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        sort = self.request.query_params.get('sort')
        if sort == 'date_desc':
            queryset = queryset.order_by('-date')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset

    def perform_create(self, serializer):
        idempotency_key = self.request.data.get('idempotency_key')
        if idempotency_key:
            if Expense.objects.filter(idempotency_key=idempotency_key, user=self.request.user).exists():
                # This is a retry, do not create a new expense
                # We can return a specific status code or message if needed
                return
        serializer.save(user=self.request.user)

class ExpenseDelete(generics.DestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class ExpenseSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        summary = Expense.objects.filter(user=user).values('category').annotate(total=Sum('amount')).order_by('category')
        return Response(summary)
