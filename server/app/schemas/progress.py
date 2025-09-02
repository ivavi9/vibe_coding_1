"""
Progress tracking schemas for the Clarity API.

This module contains Pydantic models for progress-related requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProgressUpdate(BaseModel):
    """Schema for progress update request."""
    goal_id: str
    new_progress_value: int = Field(..., ge=0)
    notes: Optional[str] = Field(None, max_length=500)


class ProgressResponse(BaseModel):
    """Schema for progress response."""
    id: str
    goal_id: str
    value: int
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ProgressCreate(BaseModel):
    """Schema for creating progress entry."""
    goal_id: str
    value: int = Field(..., ge=0)
    notes: Optional[str] = Field(None, max_length=500)


class ProgressSummary(BaseModel):
    """Schema for progress summary."""
    goal_id: str
    goal_title: str
    current_progress: int
    target_progress: int
    percentage_complete: float
    last_updated: datetime
