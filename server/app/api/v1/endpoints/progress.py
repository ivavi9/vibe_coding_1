"""
Progress tracking endpoints for the Clarity API.

This module handles progress updates and tracking for goals.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.schemas.progress import ProgressUpdate, ProgressResponse
from app.services.progress import ProgressService

router = APIRouter()


@router.post("/track-progress")
async def track_progress(
    progress_data: ProgressUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Track progress for a goal using AI matching."""
    progress_service = ProgressService(db)
    try:
        result = await progress_service.track_progress(progress_data)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{goal_id}/history", response_model=List[ProgressResponse])
async def get_progress_history(
    goal_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get progress history for a specific goal."""
    progress_service = ProgressService(db)
    history = await progress_service.get_progress_history(goal_id)
    return history


@router.post("/{goal_id}/manual")
async def add_manual_progress(
    goal_id: str,
    progress_data: ProgressUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Add manual progress entry for a goal."""
    progress_service = ProgressService(db)
    try:
        result = await progress_service.add_manual_progress(goal_id, progress_data)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
