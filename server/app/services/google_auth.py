"""
Google OAuth service for the Clarity API.

This module handles Google OAuth authentication flow.
"""

import httpx
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.core.config import settings
from app.schemas.auth import GoogleUserInfo, GoogleAuthResponse
import logging

logger = logging.getLogger(__name__)


class GoogleAuthService:
    """Service for Google OAuth operations."""
    
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI
        self.jwt_secret = settings.JWT_SECRET_KEY
        self.jwt_algorithm = settings.JWT_ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    
    async def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access tokens."""
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=token_data)
            response.raise_for_status()
            return response.json()
    
    async def get_user_info(self, access_token: str) -> GoogleUserInfo:
        """Get user information from Google using access token."""
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(user_info_url, headers=headers)
            response.raise_for_status()
            user_data = response.json()
            
            return GoogleUserInfo(
                id=user_data["id"],
                email=user_data["email"],
                name=user_data.get("name", ""),
                picture=user_data.get("picture"),
                verified_email=user_data.get("verified_email", True)
            )
    
    def create_jwt_token(self, user_info: GoogleUserInfo) -> str:
        """Create JWT token for authenticated user."""
        payload = {
            "sub": user_info.id,
            "email": user_info.email,
            "name": user_info.name,
            "exp": datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes),
            "iat": datetime.utcnow(),
        }
        
        return jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
    
    async def authenticate_with_google(self, code: str) -> GoogleAuthResponse:
        """Complete Google OAuth authentication flow."""
        try:
            # Exchange code for tokens
            token_response = await self.exchange_code_for_tokens(code)
            google_access_token = token_response["access_token"]
            
            # Get user info from Google
            user_info = await self.get_user_info(google_access_token)
            
            # Create JWT token
            jwt_token = self.create_jwt_token(user_info)
            
            return GoogleAuthResponse(
                access_token=jwt_token,
                user=user_info,
                expires_in=self.access_token_expire_minutes * 60
            )
            
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error during Google OAuth: {e}")
            raise ValueError(f"Failed to authenticate with Google: {e.response.text}")
        except Exception as e:
            logger.error(f"Error during Google OAuth: {e}")
            raise ValueError(f"Authentication failed: {str(e)}")
    
    def validate_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate JWT token and return payload."""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.jwt_algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid JWT token: {e}")
            return None
