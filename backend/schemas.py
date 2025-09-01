from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    priority: str = "medium"
    category: str = "general"

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ProgressBase(BaseModel):
    description: Optional[str] = None
    completion_percentage: float = 0.0
    notes: Optional[str] = None

class ProgressCreate(ProgressBase):
    goal_id: int

class ProgressResponse(ProgressBase):
    id: int
    goal_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    goal_id: int
    current_progress: float
    progress_trend: List[dict]
    milestones: List[dict]
    estimated_completion: Optional[datetime]
    insights: List[str]
