from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import CompanyMembership, Company

class TenantMiddleware:
    """
    Middleware to resolve the active tenant (Company) for the authenticated user.
    Extracts tenant from:
    1. 'X-Company-ID' header (if user belongs to it)
    2. Primary / first active CompanyMembership of the user
    Sets `request.company` and `request.company_membership` on the request.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_authenticator = JWTAuthentication()

    def __call__(self, request):
        request.company = None
        request.company_membership = None
        request.company_role = None

        user = getattr(request, 'user', None)
        
        # If user is not authenticated via session, attempt JWT authentication for API requests
        if (not user or not user.is_authenticated) and 'HTTP_AUTHORIZATION' in request.META:
            try:
                auth_res = self.jwt_authenticator.authenticate(request)
                if auth_res is not None:
                    user, _ = auth_res
                    request.user = user
            except Exception:
                pass

        if user and user.is_authenticated:
            requested_company_id = request.headers.get('X-Company-ID')
            membership = None

            if requested_company_id:
                try:
                    membership = CompanyMembership.objects.select_related('company').filter(
                        user=user,
                        company_id=requested_company_id,
                        is_active=True,
                        company__is_active=True
                    ).first()
                except Exception:
                    pass

            if not membership:
                membership = CompanyMembership.objects.select_related('company').filter(
                    user=user,
                    is_active=True,
                    company__is_active=True
                ).first()

            if membership:
                request.company = membership.company
                request.company_membership = membership
                request.company_role = membership.role

        response = self.get_response(request)
        return response
