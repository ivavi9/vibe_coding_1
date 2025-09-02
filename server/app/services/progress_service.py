"""
Progress Service for Clarity API.
Orchestrates progress tracking operations using repository pattern.
"""
import logging
from typing import List, Dict, Any, Optional
from app.repositories.progress_repository import progress_repository
from app.repositories.goal_repository import goal_repository
from app.schemas.progress import ProgressCreate

logger = logging.getLogger(__name__)

class ProgressService:
    """Service for progress tracking operations and business logic."""
    
    def __init__(self):
        """Initialize the progress service."""
        self.progress_repo = progress_repository
        self.goal_repo = goal_repository
    
    async def get_all_progress(self) -> List[Dict[str, Any]]:
        """
        Get all progress entries.
        
        Returns:
            List of all progress entries
        """
        return await self.progress_repo.get_all()
    
    async def get_progress_by_id(self, progress_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a progress entry by ID.
        
        Args:
            progress_id: The ID of the progress entry to retrieve
            
        Returns:
            Progress entry data if found, None otherwise
        """
        return await self.progress_repo.get_by_id(progress_id)
    
    async def create_progress_entry(self, progress_data: ProgressCreate) -> Dict[str, Any]:
        """
        Create a new progress entry and update goal progress.
        
        Args:
            progress_data: Progress creation data
            
        Returns:
            Created progress entry data
        """
        # Validate goal exists
        goal = await self.goal_repo.get_by_id(progress_data.goal_id)
        if not goal:
            raise ValueError(f"Goal with ID {progress_data.goal_id} not found")
        
        # Validate progress value
        if progress_data.progress_value <= 0:
            raise ValueError("Progress value must be greater than 0")
        
        # Create progress entry
        progress_entry = await self.progress_repo.create(progress_data)
        logger.info(f"Created progress entry: {progress_entry['id']} for goal {progress_data.goal_id}")
        
        # Update goal progress
        updated_goal = await self.goal_repo.update_progress(
            progress_data.goal_id, 
            progress_data.progress_value
        )
        if not updated_goal:
            logger.warning(f"Failed to update goal progress for goal {progress_data.goal_id}")
        
        return progress_entry
    
    async def get_progress_by_goal(self, goal_id: str) -> List[Dict[str, Any]]:
        """
        Get all progress entries for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            
        Returns:
            List of progress entries for the goal
        """
        return await self.progress_repo.get_by_goal_id(goal_id)
    
    async def get_recent_progress(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent progress entries.
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of recent progress entries
        """
        return await self.progress_repo.get_recent_entries(limit)
    
    async def get_progress_statistics(self) -> Dict[str, Any]:
        """
        Get progress tracking statistics.
        
        Returns:
            Dictionary containing progress statistics
        """
        return await self.progress_repo.get_statistics()
    
    async def get_goal_progress_summary(self, goal_id: str) -> Dict[str, Any]:
        """
        Get a summary of progress for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            
        Returns:
            Dictionary containing goal progress summary
        """
        # Get goal details
        goal = await self.goal_repo.get_by_id(goal_id)
        if not goal:
            return {}
        
        # Get progress entries for this goal
        progress_entries = await self.progress_repo.get_by_goal_id(goal_id)
        
        # Calculate progress statistics
        total_progress = sum(entry["progress_value"] for entry in progress_entries)
        progress_percentage = (goal["current_progress"] / goal["target_progress"] * 100) if goal["target_progress"] > 0 else 0
        
        # Get recent activity
        recent_entries = progress_entries[:5]  # Last 5 entries
        
        return {
            "goal_id": goal_id,
            "goal_title": goal["title"],
            "current_progress": goal["current_progress"],
            "target_progress": goal["target_progress"],
            "progress_percentage": round(progress_percentage, 2),
            "total_progress_entries": len(progress_entries),
            "recent_entries": recent_entries,
            "is_completed": goal["current_progress"] >= goal["target_progress"]
        }
    
    async def get_user_progress_overview(self) -> Dict[str, Any]:
        """
        Get an overview of user's progress across all goals.
        
        Returns:
            Dictionary containing user progress overview
        """
        # Get all goals
        all_goals = await self.goal_repo.get_all()
        
        # Get progress statistics
        progress_stats = await self.progress_repo.get_statistics()
        
        # Calculate goal completion metrics
        completed_goals = [goal for goal in all_goals if goal["current_progress"] >= goal["target_progress"]]
        active_goals = [goal for goal in all_goals if goal["current_progress"] < goal["target_progress"]]
        
        # Calculate overall progress
        total_current = sum(goal["current_progress"] for goal in all_goals)
        total_target = sum(goal["target_progress"] for goal in all_goals)
        overall_progress = (total_current / total_target * 100) if total_target > 0 else 0
        
        return {
            "total_goals": len(all_goals),
            "completed_goals": len(completed_goals),
            "active_goals": len(active_goals),
            "completion_rate": round((len(completed_goals) / len(all_goals) * 100) if all_goals else 0, 2),
            "overall_progress": round(overall_progress, 2),
            "total_progress_value": total_current,
            "total_target_value": total_target,
            "progress_entries": progress_stats["total_entries"],
            "recent_activity": progress_stats["recent_entries_7_days"]
        }
    
    async def delete_progress_entry(self, progress_id: str) -> bool:
        """
        Delete a specific progress entry.
        
        Args:
            progress_id: The ID of the progress entry to delete
            
        Returns:
            True if entry was deleted, False if not found
        """
        # Get the progress entry to find the goal ID
        progress_entry = await self.progress_repo.get_by_id(progress_id)
        if not progress_entry:
            return False
        
        # Note: In a real application, you might want to recalculate goal progress
        # after deleting a progress entry. For now, we'll just delete the entry.
        
        # This would require adding a delete method to the progress repository
        # For now, we'll return False to indicate it's not implemented
        logger.warning("Progress entry deletion not yet implemented")
        return False

# Create global progress service instance
progress_service = ProgressService()
