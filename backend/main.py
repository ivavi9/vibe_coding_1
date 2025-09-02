from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import os
from datetime import date, datetime
from dotenv import load_dotenv
from typing import List
import google.generativeai as genai

from database import get_db, engine, Base
from models import Goal, ProgressHistory, SubTask, MetricType, GoalStatus
from schemas import (
    GoalCreate, GoalResponse, GoalUpdate, ProgressHistoryCreate, 
    ProgressHistoryResponse, SubTaskCreate, SubTaskResponse, GoalWithDetails,
    ProgressTrackingRequest, ProgressTrackingResponse, GoalExtractionRequest,
    GoalExtractionResponse
)

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clarity - Progress Tracker API", version="3.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Clarity - Progress Tracker API v3.0 is running"}

@app.get("/goals", response_model=List[GoalResponse])
async def get_goals(db: Session = Depends(get_db)):
    """Get all active goals"""
    goals = db.query(Goal).filter(Goal.status == GoalStatus.ACTIVE).all()
    return goals

@app.get("/goals/{goal_id}", response_model=GoalWithDetails)
async def get_goal(goal_id: int, db: Session = Depends(get_db)):
    """Get a specific goal with its progress history and sub-tasks"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@app.post("/goals", response_model=GoalResponse)
async def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    """Create a new goal"""
    db_goal = Goal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.put("/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: int, goal_update: GoalUpdate, db: Session = Depends(get_db)):
    """Update an existing goal"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    for field, value in goal_update.dict(exclude_unset=True).items():
        setattr(goal, field, value)
    
    goal.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(goal)
    return goal

@app.delete("/goals/{goal_id}")
async def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    """Soft delete a goal (set status to archived)"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    goal.status = GoalStatus.ARCHIVED
    goal.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Goal archived successfully"}

@app.post("/goals/extract", response_model=GoalExtractionResponse)
async def extract_goals(request: GoalExtractionRequest, db: Session = Depends(get_db)):
    """Extract goals from text using Gemini AI"""
    try:
        # Use the new v1.1 Goal Extraction Prompt
        prompt = f"""
        SYSTEM: You are a precision-driven productivity bot. Analyze the user's text to extract actionable goals. Respond ONLY with a valid JSON array. Each object in the array represents one goal and MUST conform to this schema:
        {{
          "title": "string (concise, action-oriented)",
          "description": "string (brief, optional)",
          "metric_type": "string (must be one of: 'Percentage', 'Numeric', 'Checklist')",
          "target_progress": "integer (e.g., 100 for Percentage, or a specific count for Numeric)"
        }}
        If no actionable goals are found, return an empty array [].

        USER'S TEXT:
        {request.text}
        """
        
        response = model.generate_content(prompt)
        # Parse the response and extract goals
        # This is a simplified version - you'll need to parse the JSON response
        goals = []  # Placeholder for parsed goals
        return GoalExtractionResponse(goals=goals)
        
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not process goals: {str(e)}")

@app.post("/goals/track-progress", response_model=ProgressTrackingResponse)
async def track_progress(request: ProgressTrackingRequest, db: Session = Depends(get_db)):
    """Track progress using natural language with Gemini AI"""
    try:
        # Get all goals for context
        goals = db.query(Goal).filter(Goal.id.in_(request.goal_ids)).all()
        
        # Use the new v1.1 Progress Tracking Prompt
        goals_context = [{"id": str(g.id), "title": g.title} for g in goals]
        prompt = f"""
        SYSTEM: You are a precision-driven progress tracking bot. Analyze the user's update text and match it to the provided list of goals. Respond ONLY with a valid JSON array. Each object in the array represents a detected progress update and MUST conform to this schema:
        {{
          "goal_id": "string (the UUID of the matching goal)",
          "new_progress_value": "integer (the extracted absolute progress value, not an increment)"
        }}
        If the update is ambiguous or cannot be matched, return an empty array [].

        USER'S GOALS:
        {goals_context}

        USER'S UPDATE:
        {request.progress_text}
        """
        
        response = model.generate_content(prompt)
        # Parse the response and update goals
        # This is a simplified version - you'll need to parse the JSON response
        
        updated_goals = []
        for goal in goals:
            # Update progress logic here
            pass
            
        return ProgressTrackingResponse(
            updated_goals=updated_goals,
            message=f"Progress updated for {len(updated_goals)} goals"
        )
        
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not process progress update: {str(e)}")

@app.post("/progress-history", response_model=ProgressHistoryResponse)
async def add_progress_history(progress: ProgressHistoryCreate, db: Session = Depends(get_db)):
    """Add a progress history entry"""
    db_progress = ProgressHistory(**progress.dict())
    db.add(db_progress)
    
    # Update the goal's current progress
    goal = db.query(Goal).filter(Goal.id == progress.goal_id).first()
    if goal:
        goal.current_progress = progress.value
        goal.updated_at = datetime.utcnow()
        
        # Check if goal is completed
        if goal.current_progress >= goal.target_progress:
            goal.status = GoalStatus.COMPLETED
    
    db.commit()
    db.refresh(db_progress)
    return db_progress

@app.post("/sub-tasks", response_model=SubTaskResponse)
async def create_sub_task(sub_task: SubTaskCreate, db: Session = Depends(get_db)):
    """Create a new sub-task for a goal"""
    db_sub_task = SubTask(**sub_task.dict())
    db.add(db_sub_task)
    db.commit()
    db.refresh(db_sub_task)
    return db_sub_task

@app.put("/sub-tasks/{sub_task_id}", response_model=SubTaskResponse)
async def update_sub_task(sub_task_id: int, is_completed: bool, db: Session = Depends(get_db)):
    """Update a sub-task completion status"""
    sub_task = db.query(SubTask).filter(SubTask.id == sub_task_id).first()
    if not sub_task:
        raise HTTPException(status_code=404, detail="Sub-task not found")
    
    sub_task.is_completed = is_completed
    db.commit()
    db.refresh(sub_task)
    return sub_task

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
