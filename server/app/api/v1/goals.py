"""
Goals API routes for Clarity API.
Handles all goal-related HTTP endpoints using service layer architecture.
"""
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from app.services.goal_service import goal_service
from app.schemas.goals import (
    GoalCreate, GoalUpdate, Goal, GoalResponse, GoalsResponse,
    GoalExtractionRequest, GoalExtractionResponse
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=GoalsResponse)
async def get_goals():
    """
    Get all goals.
    
    Returns:
        List of all goals with success status and count
    """
    try:
        goals = await goal_service.get_all_goals()
        return GoalsResponse(
            success=True,
            data=goals,
            count=len(goals),
            message=f"Retrieved {len(goals)} goals successfully"
        )
    except Exception as e:
        logger.error(f"Error retrieving goals: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve goals")

@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(goal_id: str):
    """
    Get a specific goal by ID.
    
    Args:
        goal_id: The ID of the goal to retrieve
        
    Returns:
        Goal data with success status
    """
    try:
        goal = await goal_service.get_goal_by_id(goal_id)
        if not goal:
            raise HTTPException(status_code=404, detail=f"Goal with ID {goal_id} not found")
        
        return GoalResponse(
            success=True,
            data=goal,
            message="Goal retrieved successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving goal {goal_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve goal")

@router.post("/", response_model=GoalResponse)
async def create_goal(goal_data: GoalCreate):
    """
    Create a new goal.
    
    Args:
        goal_data: Goal creation data
        
    Returns:
        Created goal data with success status
    """
    try:
        goal = await goal_service.create_goal(goal_data)
        return GoalResponse(
            success=True,
            data=goal,
            message="Goal created successfully"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to create goal")

@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: str, goal_data: GoalUpdate):
    """
    Update an existing goal.
    
    Args:
        goal_id: The ID of the goal to update
        goal_data: Updated goal data
        
    Returns:
        Updated goal data with success status
    """
    try:
        goal = await goal_service.update_goal(goal_id, goal_data)
        if not goal:
            raise HTTPException(status_code=404, detail=f"Goal with ID {goal_id} not found")
        
        return GoalResponse(
            success=True,
            data=goal,
            message="Goal updated successfully"
        )
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating goal {goal_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update goal")

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str):
    """
    Delete a goal.
    
    Args:
        goal_id: The ID of the goal to delete
        
    Returns:
        Success message
    """
    try:
        success = await goal_service.delete_goal(goal_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Goal with ID {goal_id} not found")
        
        return {"success": True, "message": f"Goal {goal_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting goal {goal_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete goal")

@router.post("/extract", response_model=GoalExtractionResponse)
async def extract_goals_from_text(request: GoalExtractionRequest):
    """
    Extract goals from text content using AI.
    
    Args:
        request: Text content for goal extraction
        
    Returns:
        Extracted goals with success status
    """
    try:
        goals = await goal_service.extract_goals_from_text(request.text)
        return GoalExtractionResponse(
            success=True,
            goals=goals,
            count=len(goals),
            message=f"Successfully extracted {len(goals)} goals from text"
        )
    except Exception as e:
        logger.error(f"Error extracting goals from text: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract goals from text")

@router.get("/search/{query}")
async def search_goals(query: str):
    """
    Search goals by title or description.
    
    Args:
        query: Search query string
        
    Returns:
        Matching goals with success status
    """
    try:
        goals = await goal_service.search_goals(query)
        return {
            "success": True,
            "data": goals,
            "count": len(goals),
            "message": f"Found {len(goals)} goals matching '{query}'"
        }
    except Exception as e:
        logger.error(f"Error searching goals: {e}")
        raise HTTPException(status_code=500, detail="Failed to search goals")

@router.get("/statistics/overview")
async def get_goal_statistics():
    """
    Get goal-related statistics.
    
    Returns:
        Goal statistics with success status
    """
    try:
        stats = await goal_service.get_goal_statistics()
        return {
            "success": True,
            "data": stats,
            "message": "Goal statistics retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error retrieving goal statistics: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve goal statistics")
