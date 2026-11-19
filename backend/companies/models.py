import uuid
from django.db import models
from django.utils.text import slugify
from django.conf import settings

class Company(models.Model):
    """
    Tenant representation for multi-tenant SaaS architecture.
    All business records are strictly scoped to a Company instance.
    """
    PLAN_CHOICES = (
        ('STARTER', 'Starter Plan'),
        ('GROWTH', 'Growth Plan'),
        ('ENTERPRISE', 'Enterprise BI Plan'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True, verbose_name="Company Name")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    domain = models.CharField(max_length=150, blank=True, null=True)
    industry = models.CharField(max_length=100, default='Technology')
    currency = models.CharField(max_length=10, default='USD')
    subscription_plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='GROWTH')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'companies'
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Company.objects.filter(slug=slug).exclude(id=self.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CompanyMembership(models.Model):
    """
    Links users to companies with specific roles and tenant access levels.
    """
    ROLE_CHOICES = (
        ('ADMIN', 'Company Admin'),
        ('MANAGER', 'Manager'),
        ('EMPLOYEE', 'Employee'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='company_memberships'
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYEE')
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'company_memberships'
        verbose_name = 'Company Membership'
        verbose_name_plural = 'Company Memberships'
        unique_together = ('user', 'company')
        indexes = [
            models.Index(fields=['user', 'company']),
            models.Index(fields=['company', 'role']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.company.name} ({self.get_role_display()})"
