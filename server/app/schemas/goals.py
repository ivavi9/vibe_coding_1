"""
Goals schemas for the Clarity API.

This module contains Pydantic models for goal-related requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


class MetricType(str, Enum):
    """Enum for goal metric types."""
    PERCENTAGE = "Percentage"
    NUMERIC = "Numeric"
    CHECKLIST = "Checklist"


class GoalStatus(str, Enum):
    """Enum for goal status."""
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class GoalCreate(BaseModel):
    """Schema for creating a new goal."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    target_date: Optional[date] = None
    metric_type: MetricType
    target_progress: int = Field(..., gt=0)


class GoalUpdate(BaseModel):
    """Schema for updating a goal."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    target_date: Optional[date] = None
    metric_type: Optional[MetricType] = None
    target_progress: Optional[int] = Field(None, gt=0)
    status: Optional[GoalStatus] = None


class GoalResponse(BaseModel):
    """Schema for goal response."""
    id: str
    user_id: str
    title: str
    description: Optional[str]
    target_date: Optional[date]
    metric_type: MetricType
    current_progress: int
    target_progress: int
    status: GoalStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SubTaskCreate(BaseModel):
    """Schema for creating a sub-task."""
    title: str = Field(..., min_length=1, max_length=200)


class SubTaskResponse(BaseModel):
    """Schema for sub-task response."""
    id: str
    goal_id: str
    title: str
    is_completed: bool

    class Config:
        from_attributes = True


class GoalWithSubTasks(GoalResponse):
    """Schema for goal with sub-tasks."""
    sub_tasks: Optional[List[SubTaskResponse]] = None
