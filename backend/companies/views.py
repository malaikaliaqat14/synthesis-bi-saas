from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .models import Company, CompanyMembership
from .serializers import CompanySerializer, CompanyMembershipSerializer, AddMemberSerializer
from .permissions import IsCompanyAdmin, IsCompanyManagerOrAdmin, TenantRequired

User = get_user_model()

class CompanyListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """List all companies the user belongs to"""
        companies = Company.objects.filter(memberships__user=request.user, memberships__is_active=True)
        serializer = CompanySerializer(companies, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new company and make the user Company Admin"""
        serializer = CompanySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            company = serializer.save()
            CompanyMembership.objects.create(
                user=request.user,
                company=company,
                role='ADMIN',
                is_active=True
            )
            return Response(CompanySerializer(company, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentCompanyView(APIView):
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        """Get currently active company tenant details"""
        serializer = CompanySerializer(request.company, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update active company settings (Admin only)"""
        if request.company_role != 'ADMIN' and not request.user.is_superuser:
            return Response({'detail': 'Only administrators can update company settings.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CompanySerializer(request.company, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyMembersView(APIView):
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        """List all active members for current tenant"""
        memberships = CompanyMembership.objects.filter(
            company=request.company,
            is_active=True
        ).select_related('user')
        serializer = CompanyMembershipSerializer(memberships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Invite or add a member to the company (Admin or Manager)"""
        if request.company_role not in ['ADMIN', 'MANAGER'] and not request.user.is_superuser:
            return Response({'detail': 'You do not have permission to add members.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = AddMemberSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            role = serializer.validated_data['role']
            first_name = serializer.validated_data.get('first_name', '')
            last_name = serializer.validated_data.get('last_name', '')

            # Check if user already exists or create new user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )
            if created:
                user.set_password('NexusPass123!')  # Default temporary password
                user.save()

            membership, m_created = CompanyMembership.objects.get_or_create(
                user=user,
                company=request.company,
                defaults={'role': role, 'is_active': True}
            )

            if not m_created:
                if not membership.is_active:
                    membership.is_active = True
                    membership.role = role
                    membership.save()
                else:
                    return Response({'detail': 'User is already a member of this company.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response(CompanyMembershipSerializer(membership).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyMemberDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, TenantRequired, IsCompanyAdmin]

    def put(self, request, pk):
        """Update member role (Admin only)"""
        membership = get_object_or_404(CompanyMembership, pk=pk, company=request.company)
        new_role = request.data.get('role')
        if new_role not in ['ADMIN', 'MANAGER', 'EMPLOYEE']:
            return Response({'detail': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent removing last admin
        if membership.role == 'ADMIN' and new_role != 'ADMIN':
            admin_count = CompanyMembership.objects.filter(company=request.company, role='ADMIN', is_active=True).count()
            if admin_count <= 1:
                return Response({'detail': 'Cannot demote the sole administrator of the company.'}, status=status.HTTP_400_BAD_REQUEST)

        membership.role = new_role
        membership.save()
        return Response(CompanyMembershipSerializer(membership).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Remove member from company (Admin only)"""
        membership = get_object_or_404(CompanyMembership, pk=pk, company=request.company)
        if membership.user == request.user:
            return Response({'detail': 'You cannot remove yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        membership.is_active = False
        membership.save()
        return Response({'message': 'Member removed.'}, status=status.HTTP_200_OK)


class SuperAdminOverviewView(APIView):
    """
    Super Admin Dashboard endpoint.
    Returns business administrators and registered companies.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({'detail': 'Superadmin privileges required.'}, status=status.HTTP_403_FORBIDDEN)

        companies = Company.objects.all().order_by('-created_at')
        total_companies = companies.count()

        companies_data = []
        for c in companies:
            admin_membership = c.memberships.filter(role='ADMIN', is_active=True).first()
            admin_email = admin_membership.user.email if admin_membership else 'No Admin'
            admin_name = (f"{admin_membership.user.first_name} {admin_membership.user.last_name}".strip() or admin_membership.user.username) if admin_membership else '-'
            
            # Fetch company customers list
            customers = [
                {
                    'id': str(cust.id),
                    'name': cust.name,
                    'email': cust.email,
                    'city': cust.city or '-',
                    'region': cust.region,
                    'is_active': cust.is_active,
                }
                for cust in c.customers.all().order_by('-created_at')
            ]

            companies_data.append({
                'id': str(c.id),
                'name': c.name,
                'slug': c.slug,
                'industry': c.industry or 'General Business',
                'is_active': c.is_active,
                'created_at': c.created_at,
                'admin_name': admin_name,
                'admin_email': admin_email,
                'customer_count': len(customers),
                'customers': customers,
            })

        return Response({
            'total_admins': total_companies,
            'companies': companies_data,
        }, status=status.HTTP_200_OK)


class SuperAdminRegisterAdminView(APIView):
    """
    Super Admin endpoint to register a new Business Admin and Company.
    Sends real invitation email to the business admin with activation link.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({'detail': 'Superadmin privileges required.'}, status=status.HTTP_403_FORBIDDEN)

        email = request.data.get('email', '').strip().lower()
        company_name = request.data.get('company_name', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        industry = request.data.get('industry', '').strip() or 'Retail'

        if not email or not company_name:
            return Response({'detail': 'Both email and company name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        import uuid
        from datetime import timedelta
        from django.utils import timezone
        from django.core.mail import send_mail
        from django.conf import settings

        # Create or fetch Company
        company, _ = Company.objects.get_or_create(
            name=company_name,
            defaults={'industry': industry}
        )
        if industry and company.industry != industry:
            company.industry = industry
            company.save()

        # Create or fetch User
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
            }
        )

        # Generate a password setup invitation token
        setup_token = uuid.uuid4().hex
        user.reset_token = setup_token
        user.reset_token_expires = timezone.now() + timedelta(days=7)
        if created:
            user.set_unusable_password()
        user.save()

        # Assign Company Admin role
        CompanyMembership.objects.update_or_create(
            user=user,
            company=company,
            defaults={'role': 'ADMIN', 'is_active': True}
        )

        frontend_base = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
        full_setup_url = f"{frontend_base}/reset-password?token={setup_token}"
        relative_setup_url = f"/reset-password?token={setup_token}"

        # Send actual invitation email
        email_sent = False
        email_error = None
        try:
            subject = f"Welcome to AI Business Intelligence — Activate {company.name} Workspace"
            message = (
                f"Hello {user.first_name or user.username},\n\n"
                f"You have been invited as the Business Administrator for '{company.name}' on the AI Business Intelligence platform.\n\n"
                f"Please click the link below to set your password and access your business dashboard:\n"
                f"{full_setup_url}\n\n"
                f"Your invitation token: {setup_token}\n\n"
                f"Welcome aboard,\nAI Business Intelligence Team"
            )
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@aibusinessintel.com'),
                recipient_list=[user.email],
                fail_silently=False
            )
            email_sent = True
        except Exception as e:
            email_error = str(e)
            print(f"[Email Error] Failed to send email to {user.email}: {e}")

        return Response({
            'message': f'Business "{company.name}" has been registered. An invitation email with the activation link has been sent to {user.email}.',
            'email_sent': email_sent,
            'email_error': email_error,
            'company': {
                'id': str(company.id),
                'name': company.name,
                'industry': company.industry,
            },
            'admin': {
                'id': user.id,
                'email': user.email,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
            },
        }, status=status.HTTP_201_CREATED)


class SuperAdminDeleteCompanyView(APIView):
    """
    Super Admin endpoint to delete a registered company and its memberships.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        if not request.user.is_superuser:
            return Response({'detail': 'Superadmin privileges required.'}, status=status.HTTP_403_FORBIDDEN)

        company = get_object_or_404(Company, pk=pk)
        company_name = company.name

        # Cascade delete clean-up
        company.delete()

        return Response({
            'message': f'Business "{company_name}" has been permanently removed.'
        }, status=status.HTTP_200_OK)
