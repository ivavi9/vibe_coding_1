"""
Authentication schemas for the Clarity API.

This module contains Pydantic models for authentication requests and responses.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str
    confirm_password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """Schema for user response."""
    id: str
    email: str
    created_at: str


class PasswordReset(BaseModel):
    """Password reset request."""
    email: EmailStr


class PasswordUpdate(BaseModel):
    """Password update request."""
    current_password: str
    new_password: str
    confirm_new_password: str


# Google OAuth Schemas
class GoogleOAuthCallback(BaseModel):
    """Schema for Google OAuth callback."""
    code: str
    state: Optional[str] = None


class GoogleUserInfo(BaseModel):
    """Schema for Google user information."""
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    verified_email: bool = True


class GoogleAuthResponse(BaseModel):
    """Schema for Google OAuth response."""
    access_token: str
    user: GoogleUserInfo
    token_type: str = "bearer"
    expires_in: int
