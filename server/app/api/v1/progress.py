"""
Progress API routes for Clarity API.
Handles all progress tracking HTTP endpoints using service layer architecture.
"""
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.services.progress_service import progress_service
from app.schemas.progress import (
    ProgressCreate, Progress, ProgressResponse, ProgressListResponse,
    ProgressStatisticsResponse, GoalProgressSummaryResponse
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=ProgressListResponse)
async def get_progress():
    """
    Get all progress entries.
    
    Returns:
        List of all progress entries with success status and count
    """
    try:
        progress_entries = await progress_service.get_all_progress()
        return ProgressListResponse(
            success=True,
            data=progress_entries,
            count=len(progress_entries),
            message=f"Retrieved {len(progress_entries)} progress entries successfully"
        )
    except Exception as e:
        logger.error(f"Error retrieving progress entries: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve progress entries")

@router.get("/{progress_id}", response_model=ProgressResponse)
async def get_progress_entry(progress_id: str):
    """
    Get a specific progress entry by ID.
    
    Args:
        progress_id: The ID of the progress entry to retrieve
        
    Returns:
        Progress entry data with success status
    """
    try:
        progress_entry = await progress_service.get_progress_by_id(progress_id)
        if not progress_entry:
            raise HTTPException(status_code=404, detail=f"Progress entry with ID {progress_id} not found")
        
        return ProgressResponse(
            success=True,
            data=progress_entry,
            message="Progress entry retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving progress entry {progress_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve progress entry")

@router.post("/", response_model=ProgressResponse)
async def create_progress_entry(progress_data: ProgressCreate):
    """
    Create a new progress entry and update goal progress.
    
    Args:
        progress_data: Progress creation data
        
    Returns:
        Created progress entry data with success status
    """
    try:
        progress_entry = await progress_service.create_progress_entry(progress_data)
        return ProgressResponse(
            success=True,
            data=progress_entry,
            message="Progress entry created and goal updated successfully"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating progress entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to create progress entry")

@router.get("/goal/{goal_id}")
async def get_progress_by_goal(goal_id: str):
    """
    Get all progress entries for a specific goal.
    
    Args:
        goal_id: The ID of the goal
        
    Returns:
        Progress entries for the goal with success status
    """
    try:
        progress_entries = await progress_service.get_progress_by_goal(goal_id)
        return {
            "success": True,
            "data": progress_entries,
            "count": len(progress_entries),
            "goal_id": goal_id,
            "message": f"Retrieved {len(progress_entries)} progress entries for goal {goal_id}"
        }
    except Exception as e:
        logger.error(f"Error retrieving progress for goal {goal_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve progress for goal")

@router.get("/recent/{limit}")
async def get_recent_progress(limit: int = 10):
    """
    Get recent progress entries.
    
    Args:
        limit: Maximum number of entries to return (default: 10)
        
    Returns:
        Recent progress entries with success status
    """
    try:
        if limit <= 0 or limit > 100:
            raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
        
        progress_entries = await progress_service.get_recent_progress(limit)
        return {
            "success": True,
            "data": progress_entries,
            "count": len(progress_entries),
            "limit": limit,
            "message": f"Retrieved {len(progress_entries)} recent progress entries"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving recent progress: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve recent progress")

@router.get("/statistics/overview", response_model=ProgressStatisticsResponse)
async def get_progress_statistics():
    """
    Get progress tracking statistics.
    
    Returns:
        Progress statistics with success status
    """
    try:
        stats = await progress_service.get_progress_statistics()
        return ProgressStatisticsResponse(
            success=True,
            data=stats,
            message="Progress statistics retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Error retrieving progress statistics: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve progress statistics")

@router.get("/goal/{goal_id}/summary", response_model=GoalProgressSummaryResponse)
async def get_goal_progress_summary(goal_id: str):
    """
    Get a summary of progress for a specific goal.
    
    Args:
        goal_id: The ID of the goal
        
    Returns:
        Goal progress summary with success status
    """
    try:
        summary = await progress_service.get_goal_progress_summary(goal_id)
        if not summary:
            raise HTTPException(status_code=404, detail=f"Goal with ID {goal_id} not found")
        
        return GoalProgressSummaryResponse(
            success=True,
            data=summary,
            message="Goal progress summary retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving goal progress summary for {goal_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve goal progress summary")

@router.get("/user/overview")
async def get_user_progress_overview():
    """
    Get an overview of user's progress across all goals.
    
    Returns:
        User progress overview with success status
    """
    try:
        overview = await progress_service.get_user_progress_overview()
        return {
            "success": True,
            "data": overview,
            "message": "User progress overview retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error retrieving user progress overview: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user progress overview")
