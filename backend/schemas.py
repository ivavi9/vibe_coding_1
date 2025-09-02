from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from typing import Optional, List

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    priority: str = "medium"
    category: str = "general"

class GoalCreate(BaseModel):
    title: str
    description: str
    target_date: Optional[datetime] = None
    priority: str = "medium"
    category: str = "general"

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class GoalResponse(GoalBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    current_progress: Optional[float] = 0.0
    total_progress_entries: Optional[int] = 0
    
    model_config = ConfigDict(from_attributes=True)

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
    
    model_config = ConfigDict(from_attributes=True)

class DailyProgressBase(BaseModel):
    progress_value: float = 0.0
    notes: Optional[str] = None

class DailyProgressCreate(DailyProgressBase):
    goal_id: int
    date: Optional[str] = None

class DailyProgressResponse(DailyProgressBase):
    id: int
    goal_id: int
    date: date
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class GoalWithProgress(GoalResponse):
    progress_entries: List[ProgressResponse] = []
    daily_progress: List[DailyProgressResponse] = []

class AnalyticsResponse(BaseModel):
    goal_id: int
    current_progress: float
    progress_trend: List[dict]
    milestones: List[dict]
    estimated_completion: Optional[datetime]
    insights: List[str]

class DailyProgressSummary(BaseModel):
    date: date
    total_progress: float
    goals_updated: int
    notes: List[str]
