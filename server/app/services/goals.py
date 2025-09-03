"""
Goals service for the Clarity API.

This module handles goal creation, retrieval, updating, and deletion.
"""

import logging
import time
from typing import List, Optional
from app.schemas.goals import GoalCreate, GoalUpdate
from app.core.config import settings

logger = logging.getLogger(__name__)

# Shared in-memory storage for goals (temporary until database is implemented)
_shared_goals: List[dict] = []
_shared_next_id = 1


class GoalService:
    """Service for goal management operations."""
    
    def __init__(self):
        """Initialize the goal service with shared in-memory storage."""
        # Use shared storage instead of instance storage
        pass
    
    async def create_goal(self, goal_data: GoalCreate) -> dict:
        """Create a new goal."""
        global _shared_goals, _shared_next_id
        
        logger.info(f"Creating new goal: {goal_data.title}")
        
        # Create goal with generated ID and timestamps
        new_goal = {
            "id": str(_shared_next_id),
            "user_id": "guest_user",  # TODO: Replace with actual user ID when auth is implemented
            "title": goal_data.title,
            "description": goal_data.description,
            "metric_type": goal_data.metric_type,
            "current_progress": goal_data.current_progress or 0,
            "target_progress": goal_data.target_progress,
            "status": "active",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        
        # Add to shared in-memory storage
        _shared_goals.append(new_goal)
        _shared_next_id += 1
        
        logger.info(f"Created goal with ID: {new_goal['id']}")
        
        # Return raw data instead of wrapped in schema
        return new_goal
    
    async def get_goals(self) -> List[dict]:
        """Get all goals for the current user."""
        global _shared_goals
        
        logger.info("Retrieving goals for user")
        
        # Return all goals from shared in-memory storage
        # TODO: Filter by user_id when auth is implemented
        return _shared_goals
    
    async def get_goal(self, goal_id: str) -> Optional[dict]:
        """Get a specific goal by ID."""
        global _shared_goals
        
        logger.info(f"Retrieving goal: {goal_id}")
        
        # Find goal in shared in-memory storage
        goal = next((g for g in _shared_goals if g["id"] == goal_id), None)
        
        if goal:
            return goal
        return None
    
    async def update_goal(self, goal_id: str, goal_data: GoalUpdate) -> dict:
        """Update a goal."""
        global _shared_goals
        
        logger.info(f"Updating goal: {goal_id}")
        
        # Find and update goal in shared in-memory storage
        goal = next((g for g in _shared_goals if g["id"] == goal_id), None)
        
        if not goal:
            raise ValueError(f"Goal with ID {goal_id} not found")
        
        # Update fields
        update_data = goal_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key in goal:
                goal[key] = value
        
        goal["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        logger.info(f"Updated goal with ID: {goal_id}")
        return goal
    
    async def delete_goal(self, goal_id: str) -> None:
        """Delete a goal (soft delete)."""
        global _shared_goals
        
        logger.info(f"Deleting goal: {goal_id}")
        
        # Find and mark goal as deleted in shared in-memory storage
        goal = next((g for g in _shared_goals if g["id"] == goal_id), None)
        
        if not goal:
            raise ValueError(f"Goal with ID {goal_id} not found")
        
        # Soft delete - mark as cancelled
        goal["status"] = "cancelled"
        goal["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        logger.info(f"Soft deleted goal with ID: {goal_id}")
