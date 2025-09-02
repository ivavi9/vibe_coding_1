"""
Progress schemas for Clarity API.
Pydantic models for progress tracking data validation and serialization.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProgressBase(BaseModel):
    """Base progress model with common fields."""
    goal_id: str = Field(..., description="ID of the goal this progress relates to")
    description: str = Field(..., min_length=1, max_length=500, description="Description of the progress made")
    progress_value: float = Field(..., gt=0, description="Progress value to add")

class ProgressCreate(ProgressBase):
    """Model for creating a new progress entry."""
    pass

class Progress(ProgressBase):
    """Complete progress model with all fields."""
    id: str = Field(..., description="Unique progress entry identifier")
    timestamp: float = Field(..., description="Unix timestamp when progress was recorded")
    type: str = Field(default="manual", description="Type of progress entry")
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "1",
                "goal_id": "1",
                "description": "Read chapter 1 of 'The Art of War'",
                "progress_value": 1,
                "timestamp": 1703123456.789,
                "type": "manual"
            }
        }

class ProgressResponse(BaseModel):
    """Response model for progress operations."""
    success: bool = Field(..., description="Operation success status")
    data: Optional[Progress] = Field(None, description="Progress data if successful")
    message: Optional[str] = Field(None, description="Response message")
    error: Optional[str] = Field(None, description="Error message if operation failed")

class ProgressListResponse(BaseModel):
    """Response model for multiple progress entries."""
    success: bool = Field(..., description="Operation success status")
    data: list[Progress] = Field(..., description="List of progress entries")
    count: int = Field(..., description="Total number of progress entries")
    message: Optional[str] = Field(None, description="Response message")

class ProgressStatistics(BaseModel):
    """Model for progress statistics."""
    total_entries: int = Field(..., description="Total number of progress entries")
    total_progress_value: float = Field(..., description="Total progress value across all entries")
    unique_goals_with_progress: int = Field(..., description="Number of unique goals with progress")
    recent_entries_7_days: int = Field(..., description="Number of progress entries in last 7 days")
    average_progress_per_entry: float = Field(..., description="Average progress value per entry")

class ProgressStatisticsResponse(BaseModel):
    """Response model for progress statistics."""
    success: bool = Field(..., description="Operation success status")
    data: ProgressStatistics = Field(..., description="Progress statistics data")
    message: Optional[str] = Field(None, description="Response message")

class GoalProgressSummary(BaseModel):
    """Model for goal progress summary."""
    goal_id: str = Field(..., description="ID of the goal")
    goal_title: str = Field(..., description="Title of the goal")
    current_progress: float = Field(..., description="Current progress value")
    target_progress: float = Field(..., description="Target progress value")
    progress_percentage: float = Field(..., description="Progress percentage")
    total_progress_entries: int = Field(..., description="Total number of progress entries")
    recent_entries: list[Progress] = Field(..., description="Recent progress entries")
    is_completed: bool = Field(..., description="Whether the goal is completed")

class GoalProgressSummaryResponse(BaseModel):
    """Response model for goal progress summary."""
    success: bool = Field(..., description="Operation success status")
    data: GoalProgressSummary = Field(..., description="Goal progress summary data")
    message: Optional[str] = Field(None, description="Response message")
