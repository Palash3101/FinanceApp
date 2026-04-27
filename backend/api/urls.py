from django.urls import path
from . import views

urlpatterns = [
    path("expenses/", views.ExpenseListCreateView.as_view(), name="expense-list-create"),
    path("expenses/summary/", views.ExpenseSummaryView.as_view(), name="expense-summary"),
    path("expenses/<int:pk>/", views.ExpenseDelete.as_view(), name="expense-delete"),
]
