"""
Authentication endpoints for the Clarity API.

This module handles user registration, login, and token management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.auth import UserCreate, UserLogin, TokenResponse
from app.services.auth import AuthService

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user."""
    auth_service = AuthService(db)
    try:
        tokens = await auth_service.register_user(user_data)
        return tokens
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    user_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Login user and return tokens."""
    auth_service = AuthService(db)
    try:
        tokens = await auth_service.authenticate_user(user_data)
        return tokens
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/refresh")
async def refresh_token(
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token."""
    # Implementation will be added later
    pass


@router.post("/logout")
async def logout(
    db: AsyncSession = Depends(get_db)
):
    """Logout user and invalidate tokens."""
    # Implementation will be added later
    pass
