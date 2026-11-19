from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, CompanyMembership

User = get_user_model()

class CompanySerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'slug', 'domain', 'industry',
            'currency', 'subscription_plan', 'is_active',
            'created_at', 'updated_at', 'member_count', 'user_role'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'member_count', 'user_role']

    def get_member_count(self, obj):
        return obj.memberships.filter(is_active=True).count()

    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = obj.memberships.filter(user=request.user).first()
            if membership:
                return membership.role
        return None


class CompanyMembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = CompanyMembership
        fields = ['id', 'user', 'user_email', 'user_name', 'company', 'role', 'is_active', 'joined_at']
        read_only_fields = ['id', 'company', 'joined_at', 'user_email', 'user_name']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class AddMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=CompanyMembership.ROLE_CHOICES, default='EMPLOYEE')
    first_name = serializers.CharField(required=False, default='')
    last_name = serializers.CharField(required=False, default='')
