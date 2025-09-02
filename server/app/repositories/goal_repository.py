"""
Goal Repository for Clarity API.
Handles data access and persistence for goals using repository pattern.
"""
import logging
from typing import List, Dict, Any, Optional
from app.schemas.goals import GoalCreate, GoalUpdate, Goal

logger = logging.getLogger(__name__)

class GoalRepository:
    """Repository for goal data management."""
    
    def __init__(self):
        """Initialize the goal repository with in-memory storage."""
        # In-memory storage for demo purposes (replace with database later)
        self._goals: List[Dict[str, Any]] = [
            {
                "id": "1",
                "title": "Read 12 books",
                "description": "Read 12 books this year",
                "metric_type": "Numeric",
                "current_progress": 3,
                "target_progress": 12,
                "status": "active"
            },
            {
                "id": "2",
                "title": "Run 100km",
                "description": "Build endurance and fitness",
                "metric_type": "Numeric",
                "current_progress": 15,
                "target_progress": 100,
                "status": "active"
            }
        ]
        self._next_id = 3
    
    async def get_all(self) -> List[Dict[str, Any]]:
        """
        Get all goals.
        
        Returns:
            List of all goals
        """
        return self._goals.copy()
    
    async def get_by_id(self, goal_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a goal by ID.
        
        Args:
            goal_id: The ID of the goal to retrieve
            
        Returns:
            Goal data if found, None otherwise
        """
        return next((goal for goal in self._goals if goal["id"] == goal_id), None)
    
    async def create(self, goal_data: GoalCreate) -> Dict[str, Any]:
        """
        Create a new goal.
        
        Args:
            goal_data: Goal creation data
            
        Returns:
            Created goal data
        """
        new_goal = {
            "id": str(self._next_id),
            "title": goal_data.title,
            "description": goal_data.description,
            "metric_type": goal_data.metric_type,
            "current_progress": goal_data.current_progress or 0,
            "target_progress": goal_data.target_progress,
            "status": "active"
        }
        
        self._goals.append(new_goal)
        self._next_id += 1
        
        logger.info(f"Created goal with ID: {new_goal['id']}")
        return new_goal
    
    async def update(self, goal_id: str, goal_data: GoalUpdate) -> Optional[Dict[str, Any]]:
        """
        Update an existing goal.
        
        Args:
            goal_id: The ID of the goal to update
            goal_data: Updated goal data
            
        Returns:
            Updated goal data if found, None otherwise
        """
        goal = await self.get_by_id(goal_id)
        if not goal:
            return None
        
        # Update goal fields
        for key, value in goal_data.dict(exclude_unset=True).items():
            if key in goal:
                goal[key] = value
        
        logger.info(f"Updated goal with ID: {goal_id}")
        return goal
    
    async def delete(self, goal_id: str) -> bool:
        """
        Delete a goal.
        
        Args:
            goal_id: The ID of the goal to delete
            
        Returns:
            True if goal was deleted, False if not found
        """
        initial_count = len(self._goals)
        self._goals = [goal for goal in self._goals if goal["id"] != goal_id]
        
        if len(self._goals) < initial_count:
            logger.info(f"Deleted goal with ID: {goal_id}")
            return True
        
        logger.warning(f"Goal with ID {goal_id} not found for deletion")
        return False
    
    async def update_progress(self, goal_id: str, progress_value: int) -> Optional[Dict[str, Any]]:
        """
        Update goal progress.
        
        Args:
            goal_id: The ID of the goal to update
            progress_value: Progress value to add
            
        Returns:
            Updated goal data if found, None otherwise
        """
        goal = await self.get_by_id(goal_id)
        if not goal:
            return None
        
        # Update progress
        goal["current_progress"] = min(
            goal["current_progress"] + progress_value,
            goal["target_progress"]
        )
        
        logger.info(f"Updated progress for goal {goal_id}: {goal['current_progress']}/{goal['target_progress']}")
        return goal
    
    async def get_active_goals(self) -> List[Dict[str, Any]]:
        """
        Get all active goals.
        
        Returns:
            List of active goals
        """
        return [goal for goal in self._goals if goal["status"] == "active"]
    
    async def get_completed_goals(self) -> List[Dict[str, Any]]:
        """
        Get all completed goals.
        
        Returns:
            List of completed goals
        """
        return [goal for goal in self._goals if goal["current_progress"] >= goal["target_progress"]]
    
    async def search_goals(self, query: str) -> List[Dict[str, Any]]:
        """
        Search goals by title or description.
        
        Args:
            query: Search query string
            
        Returns:
            List of matching goals
        """
        query_lower = query.lower()
        return [
            goal for goal in self._goals
            if query_lower in goal["title"].lower() or query_lower in goal["description"].lower()
        ]

# Create global goal repository instance
goal_repository = GoalRepository()
