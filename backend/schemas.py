from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime, date
from typing import Optional, List
from models import MetricType, GoalStatus

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[date] = None
    metric_type: MetricType = MetricType.PERCENTAGE
    target_progress: int = 100

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[date] = None
    metric_type: Optional[MetricType] = None
    target_progress: Optional[int] = None
    status: Optional[GoalStatus] = None
    
    model_config = ConfigDict(from_attributes=True)

class GoalResponse(GoalBase):
    id: int
    current_progress: int = 0
    status: GoalStatus = GoalStatus.ACTIVE
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ProgressHistoryBase(BaseModel):
    value: int
    notes: Optional[str] = None

class ProgressHistoryCreate(ProgressHistoryBase):
    goal_id: int

class ProgressHistoryResponse(ProgressHistoryBase):
    id: int
    goal_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SubTaskBase(BaseModel):
    title: str
    is_completed: bool = False

class SubTaskCreate(SubTaskBase):
    goal_id: int

class SubTaskResponse(SubTaskBase):
    id: int
    goal_id: int
    
    model_config = ConfigDict(from_attributes=True)

class GoalWithDetails(GoalResponse):
    progress_history: List[ProgressHistoryResponse] = []
    sub_tasks: List[SubTaskResponse] = []

class ProgressTrackingRequest(BaseModel):
    progress_text: str
    goal_ids: List[int]

class ProgressTrackingResponse(BaseModel):
    updated_goals: List[GoalResponse]
    message: str

class GoalExtractionRequest(BaseModel):
    text: str

class GoalExtractionResponse(BaseModel):
    goals: List[GoalBase]

class AnalyticsResponse(BaseModel):
    goal_id: int
    current_progress: int
    progress_trend: List[dict]
    milestones: List[dict]
    estimated_completion: Optional[date]
    insights: List[str]
