from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class MetricType(enum.Enum):
    PERCENTAGE = "Percentage"
    NUMERIC = "Numeric"
    CHECKLIST = "Checklist"

class GoalStatus(enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    target_date = Column(Date)
    metric_type = Column(Enum(MetricType), nullable=False, default=MetricType.PERCENTAGE)
    current_progress = Column(Integer, nullable=False, default=0)
    target_progress = Column(Integer, nullable=False, default=100)
    status = Column(Enum(GoalStatus), nullable=False, default=GoalStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    progress_history = relationship("ProgressHistory", back_populates="goal")
    sub_tasks = relationship("SubTask", back_populates="goal")

class ProgressHistory(Base):
    __tablename__ = "progress_history"
    
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=False)
    value = Column(Integer, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with goal
    goal = relationship("Goal", back_populates="progress_history")

class SubTask(Base):
    __tablename__ = "sub_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=False)
    title = Column(String(200), nullable=False)
    is_completed = Column(Integer, nullable=False, default=0)  # 0 = false, 1 = true for SQLite
    
    # Relationship with goal
    goal = relationship("Goal", back_populates="sub_tasks")
