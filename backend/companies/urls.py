from django.urls import path
from .views import (
    CompanyListView,
    CurrentCompanyView,
    CompanyMembersView,
    CompanyMemberDetailView,
    SuperAdminOverviewView,
    SuperAdminRegisterAdminView,
    SuperAdminDeleteCompanyView,
)

urlpatterns = [
    path('', CompanyListView.as_view(), name='company_list_create'),
    path('current/', CurrentCompanyView.as_view(), name='company_current'),
    path('members/', CompanyMembersView.as_view(), name='company_members'),
    path('members/<int:pk>/', CompanyMemberDetailView.as_view(), name='company_member_detail'),
    path('superadmin/overview/', SuperAdminOverviewView.as_view(), name='superadmin_overview'),
    path('superadmin/register-admin/', SuperAdminRegisterAdminView.as_view(), name='superadmin_register_admin'),
    path('superadmin/companies/<uuid:pk>/', SuperAdminDeleteCompanyView.as_view(), name='superadmin_delete_company'),
]
