"""
Goal Service for Clarity API.
Orchestrates goal operations using repository pattern and AI service.
"""
import logging
from typing import List, Dict, Any, Optional
from app.repositories.goal_repository import goal_repository
from app.repositories.progress_repository import progress_repository
from app.services.ai_service import ai_service
from app.schemas.goals import GoalCreate, GoalUpdate
from app.schemas.progress import ProgressCreate

logger = logging.getLogger(__name__)

class GoalService:
    """Service for goal operations and business logic."""
    
    def __init__(self):
        """Initialize the goal service."""
        self.goal_repo = goal_repository
        self.progress_repo = progress_repository
        self.ai_service = ai_service
    
    async def get_all_goals(self) -> List[Dict[str, Any]]:
        """
        Get all goals.
        
        Returns:
            List of all goals
        """
        return await self.goal_repo.get_all()
    
    async def get_goal_by_id(self, goal_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a goal by ID.
        
        Args:
            goal_id: The ID of the goal to retrieve
            
        Returns:
            Goal data if found, None otherwise
        """
        return await self.goal_repo.get_by_id(goal_id)
    
    async def create_goal(self, goal_data: GoalCreate) -> Dict[str, Any]:
        """
        Create a new goal.
        
        Args:
            goal_data: Goal creation data
            
        Returns:
            Created goal data
        """
        # Validate goal data
        if goal_data.target_progress <= 0:
            raise ValueError("Target progress must be greater than 0")
        
        # Create the goal
        goal = await self.goal_repo.create(goal_data)
        logger.info(f"Created goal: {goal['title']}")
        
        return goal
    
    async def update_goal(self, goal_id: str, goal_data: GoalUpdate) -> Optional[Dict[str, Any]]:
        """
        Update an existing goal.
        
        Args:
            goal_id: The ID of the goal to update
            goal_data: Updated goal data
            
        Returns:
            Updated goal data if found, None otherwise
        """
        # Validate goal data
        if goal_data.target_progress is not None and goal_data.target_progress <= 0:
            raise ValueError("Target progress must be greater than 0")
        
        # Update the goal
        goal = await self.goal_repo.update(goal_id, goal_data)
        if goal:
            logger.info(f"Updated goal: {goal['title']}")
        
        return goal
    
    async def delete_goal(self, goal_id: str) -> bool:
        """
        Delete a goal and all associated progress entries.
        
        Args:
            goal_id: The ID of the goal to delete
            
        Returns:
            True if goal was deleted, False if not found
        """
        # Delete associated progress entries first
        await self.progress_repo.delete_by_goal_id(goal_id)
        
        # Delete the goal
        success = await self.goal_repo.delete(goal_id)
        if success:
            logger.info(f"Deleted goal with ID: {goal_id}")
        
        return success
    
    async def extract_goals_from_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract goals from text using AI service.
        
        Args:
            text: The text content to analyze
            
        Returns:
            List of extracted goals
        """
        try:
            goals = await self.ai_service.extract_goals_from_text(text)
            logger.info(f"Extracted {len(goals)} goals from text")
            return goals
        except Exception as e:
            logger.error(f"Error extracting goals from text: {e}")
            raise
    
    async def extract_goals_from_document(self, document_content: str) -> List[Dict[str, Any]]:
        """
        Extract goals from document content using AI service.
        
        Args:
            document_content: The document text content
            
        Returns:
            List of extracted goals
        """
        try:
            goals = await self.ai_service.extract_goals_from_text(document_content)
            logger.info(f"Extracted {len(goals)} goals from document")
            return goals
        except Exception as e:
            logger.error(f"Error extracting goals from document: {e}")
            raise
    
    async def track_progress(self, goal_id: str, progress_data: ProgressCreate) -> Dict[str, Any]:
        """
        Track progress for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            progress_data: Progress tracking data
            
        Returns:
            Updated goal data
        """
        # Validate goal exists
        goal = await self.goal_repo.get_by_id(goal_id)
        if not goal:
            raise ValueError(f"Goal with ID {goal_id} not found")
        
        # Create progress entry
        progress_entry = await self.progress_repo.create(progress_data)
        logger.info(f"Created progress entry for goal {goal_id}: {progress_entry['progress_value']}")
        
        # Update goal progress
        updated_goal = await self.goal_repo.update_progress(goal_id, progress_data.progress_value)
        if not updated_goal:
            raise ValueError(f"Failed to update progress for goal {goal_id}")
        
        return updated_goal
    
    async def get_goal_progress(self, goal_id: str) -> List[Dict[str, Any]]:
        """
        Get progress history for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            
        Returns:
            List of progress entries for the goal
        """
        return await self.progress_repo.get_by_goal_id(goal_id)
    
    async def get_goal_statistics(self) -> Dict[str, Any]:
        """
        Get goal-related statistics.
        
        Returns:
            Dictionary containing goal statistics
        """
        all_goals = await self.goal_repo.get_all()
        active_goals = await self.goal_repo.get_active_goals()
        completed_goals = await self.goal_repo.get_completed_goals()
        
        # Calculate completion rates
        total_goals = len(all_goals)
        completion_rate = (len(completed_goals) / total_goals * 100) if total_goals > 0 else 0
        
        # Calculate average progress
        total_progress = sum(goal["current_progress"] for goal in all_goals)
        total_target = sum(goal["target_progress"] for goal in all_goals)
        average_progress = (total_progress / total_target * 100) if total_target > 0 else 0
        
        return {
            "total_goals": total_goals,
            "active_goals": len(active_goals),
            "completed_goals": len(completed_goals),
            "completion_rate": round(completion_rate, 2),
            "average_progress": round(average_progress, 2),
            "total_progress_value": total_progress,
            "total_target_value": total_target
        }
    
    async def search_goals(self, query: str) -> List[Dict[str, Any]]:
        """
        Search goals by title or description.
        
        Args:
            query: Search query string
            
        Returns:
            List of matching goals
        """
        return await self.goal_repo.search_goals(query)
    
    async def get_recent_goals(self, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get recently created goals.
        
        Args:
            limit: Maximum number of goals to return
            
        Returns:
            List of recent goals
        """
        all_goals = await self.goal_repo.get_all()
        # For now, return the most recent goals (in-memory doesn't have timestamps)
        # In a real database, we'd order by creation date
        return all_goals[-limit:] if len(all_goals) > limit else all_goals

# Create global goal service instance
goal_service = GoalService()
