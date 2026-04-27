from django.urls import path
from . import views

urlpatterns = [
    path("expenses/", views.CreateExpenseView.as_view(), name="expenses"),
    path("expenses/<int:pk>/", views.ExpenseDelete.as_view(), name="expense-delete"),
]
