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
    """Schema for password reset."""
    email: EmailStr


class PasswordUpdate(BaseModel):
    """Schema for password update."""
    current_password: str
    new_password: str
    confirm_new_password: str
