"""
Main API router for the Clarity API v1.

This module includes all API endpoints and is imported in the main application.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import goals, auth
# from app.api.v1.endpoints import progress  # Temporarily disabled - database dependency

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
# api_router.include_router(progress.router, prefix="/progress", tags=["progress"])  # Temporarily disabled

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}
