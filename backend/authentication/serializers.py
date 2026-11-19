from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from companies.models import Company, CompanyMembership

User = get_user_model()

class CompanyBriefSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'domain', 'industry', 'subscription_plan', 'currency', 'role']

    def get_role(self, obj):
        user = self.context.get('user')
        if user and user.is_authenticated:
            membership = CompanyMembership.objects.filter(user=user, company=obj).first()
            if membership:
                return membership.role
        return None


class UserProfileSerializer(serializers.ModelSerializer):
    companies = serializers.SerializerMethodField()
    active_company = serializers.SerializerMethodField()
    is_superuser = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'job_title', 'avatar_url', 'is_active', 'is_superuser', 'is_staff',
            'created_at', 'companies', 'active_company'
        ]
        read_only_fields = ['id', 'email', 'is_active', 'is_superuser', 'is_staff', 'created_at', 'companies', 'active_company']

    def get_companies(self, obj):
        memberships = CompanyMembership.objects.filter(user=obj, is_active=True).select_related('company')
        result = []
        for m in memberships:
            result.append({
                'id': str(m.company.id),
                'name': m.company.name,
                'slug': m.company.slug,
                'role': m.role,
                'plan': m.company.subscription_plan,
            })
        return result

    def get_active_company(self, obj):
        request = self.context.get('request')
        current_comp = getattr(request, 'company', None) if request else None
        if not current_comp:
            first_m = CompanyMembership.objects.filter(user=obj, is_active=True).select_related('company').first()
            if first_m:
                current_comp = first_m.company
        if current_comp:
            membership = CompanyMembership.objects.filter(user=obj, company=current_comp).first()
            return {
                'id': str(current_comp.id),
                'name': current_comp.name,
                'slug': current_comp.slug,
                'role': membership.role if membership else 'EMPLOYEE',
                'plan': current_comp.subscription_plan,
                'currency': current_comp.currency,
            }
        return None


class RegisterSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(max_length=200, required=True, write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'company_name', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if not attrs.get('username'):
            attrs['username'] = attrs['email'].split('@')[0]
        return attrs

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # Create user
        user = User.objects.create_user(
            username=validated_data.get('username') or validated_data['email'].split('@')[0],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=password
        )

        # Create organization and assign user as Company Admin
        company = Company.objects.create(name=company_name)
        CompanyMembership.objects.create(
            user=user,
            company=company,
            role='ADMIN',
            is_active=True
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(username=email, password=password)
        if not user:
            # Fallback by username if user used username
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            raise serializers.ValidationError({"detail": "Invalid email or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account has been disabled."})

        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "New passwords do not match."})
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, min_length=8)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        return attrs
