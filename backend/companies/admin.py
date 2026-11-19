from django.contrib import admin
from .models import Company, CompanyMembership

class CompanyMembershipInline(admin.TabularInline):
    model = CompanyMembership
    extra = 1
    autocomplete_fields = ['user']

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'industry', 'subscription_plan', 'currency', 'is_active', 'created_at')
    list_filter = ('subscription_plan', 'industry', 'is_active')
    search_fields = ('name', 'slug', 'domain')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [CompanyMembershipInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CompanyMembership)
class CompanyMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'role', 'is_active', 'joined_at')
    list_filter = ('role', 'is_active', 'company')
    search_fields = ('user__email', 'user__first_name', 'company__name')
    autocomplete_fields = ['user', 'company']
