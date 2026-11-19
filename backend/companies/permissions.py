from rest_framework import permissions

class TenantRequired(permissions.BasePermission):
    """
    Ensures that the request is made within the context of an active company tenant.
    """
    message = "You must belong to an active company to access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request, 'company', None) is not None
        )


class IsCompanyAdmin(permissions.BasePermission):
    """
    Allows access only to Company Admins.
    """
    message = "Only Company Administrators have permission to perform this action."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return getattr(request, 'company_role', None) == 'ADMIN'


class IsCompanyManagerOrAdmin(permissions.BasePermission):
    """
    Allows access to Company Admins and Managers.
    """
    message = "You must be a Company Manager or Administrator to perform this action."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return getattr(request, 'company_role', None) in ['ADMIN', 'MANAGER']


class IsCompanyMember(permissions.BasePermission):
    """
    Allows access to any verified member of the current company.
    """
    message = "You must be an active member of this organization."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return getattr(request, 'company', None) is not None
