from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    """
    Custom user model where email is the primary unique identifier.
    Supports multi-tenant company association, profile attributes, and password reset tokens.
    """
    email = models.EmailField(unique=True, verbose_name="Email Address")
    phone = models.CharField(max_length=30, blank=True, null=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Password reset fields
    reset_token = models.CharField(max_length=128, blank=True, null=True)
    reset_token_expires = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'auth_users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.get_full_name() or self.username})"
