"""
Authentication endpoints for the Clarity API.

This module handles user registration, login, and token management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.auth import UserCreate, UserLogin, TokenResponse, GoogleOAuthCallback, GoogleAuthResponse
from app.services.auth import AuthService
from app.services.google_auth import GoogleAuthService

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


@router.post("/google/callback", response_model=GoogleAuthResponse)
async def google_oauth_callback(
    oauth_data: GoogleOAuthCallback
):
    """Handle Google OAuth callback."""
    google_auth_service = GoogleAuthService()
    try:
        auth_response = await google_auth_service.authenticate_with_google(oauth_data.code)
        return auth_response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/validate")
async def validate_token(
    token: str = Depends(security)
):
    """Validate JWT token and return user info."""
    google_auth_service = GoogleAuthService()
    payload = google_auth_service.validate_jwt_token(token.credentials)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    return {
        "user": {
            "id": payload["sub"],
            "email": payload["email"],
            "name": payload["name"]
        }
    }


@router.post("/refresh")
async def refresh_token(
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token."""
    # TODO: Implement token refresh logic
    return {"message": "Token refresh endpoint - implementation pending"}


@router.post("/logout")
async def logout():
    """Logout user and invalidate tokens."""
    # TODO: Implement token invalidation logic
    return {"message": "Logged out successfully"}
