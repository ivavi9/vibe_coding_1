"""
Goals endpoints for the Clarity API.

This module handles goal creation, retrieval, updating, and deletion.
"""

import logging
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.goals import GoalCreate, GoalUpdate
from app.services.goals import GoalService
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/")
async def create_goal(
    goal_data: GoalCreate
):
    """Create a new goal."""
    goal_service = GoalService()
    try:
        goal = await goal_service.create_goal(goal_data)
        # Return the goal data directly
        return goal
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/")
async def get_goals():
    """Get all goals for the current user."""
    goal_service = GoalService()
    goals = await goal_service.get_goals()
    # Return the goals data directly
    return goals


@router.get("/{goal_id}")
async def get_goal(goal_id: str):
    """Get a specific goal by ID."""
    goal_service = GoalService()
    goal = await goal_service.get_goal(goal_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    return {
        "success": True,
        "data": goal,
        "message": "Goal retrieved successfully"
    }


@router.put("/{goal_id}")
async def update_goal(
    goal_id: str,
    goal_data: GoalUpdate
):
    """Update a goal."""
    goal_service = GoalService()
    try:
        goal = await goal_service.update_goal(goal_id, goal_data)
        return {
            "success": True,
            "data": goal,
            "message": "Goal updated successfully"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str
):
    """Delete a goal (soft delete)."""
    goal_service = GoalService()
    await goal_service.delete_goal(goal_id)
    return {"message": "Goal deleted successfully"}


@router.post("/extract")
async def extract_goals_from_text(
    request: dict
):
    """Extract goals from text using AI."""
    try:
        text = request.get("text", "").strip()
        if not text or len(text) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Text must be at least 10 characters long"
            )
        
        # Use AI service to extract goals
        goals = await ai_service.extract_goals_from_text(text)
        
        if not goals:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No goals could be extracted from the provided text"
            )
        
        return {
            "goals": goals,
            "count": len(goals),
            "message": f"Successfully extracted {len(goals)} goals"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting goals: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to extract goals. Please try again."
        )
