"""
Goals endpoints for the Clarity API.

This module handles goal creation, retrieval, updating, and deletion.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.schemas.goals import GoalCreate, GoalUpdate, GoalResponse
from app.services.goals import GoalService

router = APIRouter()


@router.post("/", response_model=GoalResponse)
async def create_goal(
    goal_data: GoalCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new goal."""
    goal_service = GoalService(db)
    try:
        goal = await goal_service.create_goal(goal_data)
        return goal
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    db: AsyncSession = Depends(get_db)
):
    """Get all goals for the current user."""
    goal_service = GoalService(db)
    goals = await goal_service.get_goals()
    return goals


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific goal by ID."""
    goal_service = GoalService(db)
    goal = await goal_service.get_goal(goal_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: str,
    goal_data: GoalUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a goal."""
    goal_service = GoalService(db)
    try:
        goal = await goal_service.update_goal(goal_id, goal_data)
        return goal
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a goal (soft delete)."""
    goal_service = GoalService(db)
    await goal_service.delete_goal(goal_id)
    return {"message": "Goal deleted successfully"}


@router.post("/extract-from-text")
async def extract_goals_from_text(
    text: str,
    db: AsyncSession = Depends(get_db)
):
    """Extract goals from text using AI."""
    # Implementation will be added later
    pass
