from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    target_date = Column(DateTime)
    priority = Column(String(20), default="medium")  # low, medium, high
    category = Column(String(50), default="general")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship with progress entries
    progress_entries = relationship("ProgressEntry", back_populates="goal")

class ProgressEntry(Base):
    __tablename__ = "progress_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=False)
    description = Column(Text)
    completion_percentage = Column(Float, default=0.0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with goal
    goal = relationship("Goal", back_populates="progress_entries")
