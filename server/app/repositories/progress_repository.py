"""
Progress Repository for Clarity API.
Handles data access and persistence for progress tracking using repository pattern.
"""
import logging
import time
from typing import List, Dict, Any, Optional
from app.schemas.progress import ProgressCreate, Progress

logger = logging.getLogger(__name__)

class ProgressRepository:
    """Repository for progress tracking data management."""
    
    def __init__(self):
        """Initialize the progress repository with in-memory storage."""
        # In-memory storage for demo purposes (replace with database later)
        self._progress_entries: List[Dict[str, Any]] = []
        self._next_id = 1
    
    async def get_all(self) -> List[Dict[str, Any]]:
        """
        Get all progress entries.
        
        Returns:
            List of all progress entries
        """
        return self._progress_entries.copy()
    
    async def get_by_id(self, progress_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a progress entry by ID.
        
        Args:
            progress_id: The ID of the progress entry to retrieve
            
        Returns:
            Progress entry data if found, None otherwise
        """
        return next((entry for entry in self._progress_entries if entry["id"] == progress_id), None)
    
    async def create(self, progress_data: ProgressCreate) -> Dict[str, Any]:
        """
        Create a new progress entry.
        
        Args:
            progress_data: Progress creation data
            
        Returns:
            Created progress entry data
        """
        new_entry = {
            "id": str(self._next_id),
            "goal_id": progress_data.goal_id,
            "description": progress_data.description,
            "progress_value": progress_data.progress_value or 0,
            "timestamp": time.time(),
            "type": "manual"
        }
        
        self._progress_entries.append(new_entry)
        self._next_id += 1
        
        logger.info(f"Created progress entry with ID: {new_entry['id']}")
        return new_entry
    
    async def get_by_goal_id(self, goal_id: str) -> List[Dict[str, Any]]:
        """
        Get all progress entries for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            
        Returns:
            List of progress entries for the goal
        """
        return [entry for entry in self._progress_entries if entry["goal_id"] == goal_id]
    
    async def get_recent_entries(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent progress entries.
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of recent progress entries
        """
        # Sort by timestamp (newest first) and return limited results
        sorted_entries = sorted(
            self._progress_entries, 
            key=lambda x: x["timestamp"], 
            reverse=True
        )
        return sorted_entries[:limit]
    
    async def get_entries_by_date_range(self, start_timestamp: float, end_timestamp: float) -> List[Dict[str, Any]]:
        """
        Get progress entries within a date range.
        
        Args:
            start_timestamp: Start timestamp
            end_timestamp: End timestamp
            
        Returns:
            List of progress entries within the range
        """
        return [
            entry for entry in self._progress_entries
            if start_timestamp <= entry["timestamp"] <= end_timestamp
        ]
    
    async def get_total_progress_for_goal(self, goal_id: str) -> int:
        """
        Get total progress value for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            
        Returns:
            Total progress value
        """
        goal_entries = await self.get_by_goal_id(goal_id)
        return sum(entry["progress_value"] for entry in goal_entries)
    
    async def delete_by_goal_id(self, goal_id: str) -> int:
        """
        Delete all progress entries for a specific goal.
        
        Args:
            goal_id: The ID of the goal
            
        Returns:
            Number of entries deleted
        """
        initial_count = len(self._progress_entries)
        self._progress_entries = [entry for entry in self._progress_entries if entry["goal_id"] != goal_id]
        
        deleted_count = initial_count - len(self._progress_entries)
        if deleted_count > 0:
            logger.info(f"Deleted {deleted_count} progress entries for goal {goal_id}")
        
        return deleted_count
    
    async def get_statistics(self) -> Dict[str, Any]:
        """
        Get progress tracking statistics.
        
        Returns:
            Dictionary containing various statistics
        """
        total_entries = len(self._progress_entries)
        total_progress = sum(entry["progress_value"] for entry in self._progress_entries)
        
        # Get unique goals that have progress
        goals_with_progress = set(entry["goal_id"] for entry in self._progress_entries)
        
        # Get recent activity (last 7 days)
        week_ago = time.time() - (7 * 24 * 60 * 60)
        recent_entries = await self.get_entries_by_date_range(week_ago, time.time())
        
        return {
            "total_entries": total_entries,
            "total_progress_value": total_progress,
            "unique_goals_with_progress": len(goals_with_progress),
            "recent_entries_7_days": len(recent_entries),
            "average_progress_per_entry": total_progress / total_entries if total_entries > 0 else 0
        }

# Create global progress repository instance
progress_repository = ProgressRepository()
