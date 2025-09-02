"""
Goal schemas for Clarity API.
Pydantic models for goal data validation and serialization.
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class MetricType(str, Enum):
    """Valid metric types for goals."""
    NUMERIC = "Numeric"
    BOOLEAN = "Boolean"
    PERCENTAGE = "Percentage"

class GoalStatus(str, Enum):
    """Valid goal statuses."""
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class GoalBase(BaseModel):
    """Base goal model with common fields."""
    title: str = Field(..., min_length=1, max_length=200, description="Goal title")
    description: str = Field(..., min_length=1, max_length=1000, description="Goal description")
    metric_type: MetricType = Field(..., description="Type of metric for tracking progress")
    target_progress: float = Field(..., gt=0, description="Target progress value")

class GoalCreate(GoalBase):
    """Model for creating a new goal."""
    current_progress: Optional[float] = Field(default=0, ge=0, description="Current progress value")

class GoalUpdate(BaseModel):
    """Model for updating an existing goal."""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Goal title")
    description: Optional[str] = Field(None, min_length=1, max_length=1000, description="Goal description")
    metric_type: Optional[MetricType] = Field(None, description="Type of metric for tracking progress")
    current_progress: Optional[float] = Field(None, ge=0, description="Current progress value")
    target_progress: Optional[float] = Field(None, gt=0, description="Target progress value")
    status: Optional[GoalStatus] = Field(None, description="Goal status")

class Goal(GoalBase):
    """Complete goal model with all fields."""
    id: str = Field(..., description="Unique goal identifier")
    current_progress: float = Field(..., ge=0, description="Current progress value")
    status: GoalStatus = Field(default=GoalStatus.ACTIVE, description="Goal status")
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "1",
                "title": "Read 12 books",
                "description": "Read 12 books this year to improve knowledge and vocabulary",
                "metric_type": "Numeric",
                "current_progress": 3,
                "target_progress": 12,
                "status": "active"
            }
        }

class GoalResponse(BaseModel):
    """Response model for goal operations."""
    success: bool = Field(..., description="Operation success status")
    data: Optional[Goal] = Field(None, description="Goal data if successful")
    message: Optional[str] = Field(None, description="Response message")
    error: Optional[str] = Field(None, description="Error message if operation failed")

class GoalsResponse(BaseModel):
    """Response model for multiple goals."""
    success: bool = Field(..., description="Operation success status")
    data: list[Goal] = Field(..., description="List of goals")
    count: int = Field(..., description="Total number of goals")
    message: Optional[str] = Field(None, description="Response message")

class GoalExtractionRequest(BaseModel):
    """Request model for goal extraction."""
    text: str = Field(..., min_length=10, description="Text content to extract goals from")

class GoalExtractionResponse(BaseModel):
    """Response model for goal extraction."""
    success: bool = Field(..., description="Extraction success status")
    goals: list[GoalBase] = Field(..., description="Extracted goals")
    count: int = Field(..., description="Number of goals extracted")
    message: Optional[str] = Field(None, description="Response message")
