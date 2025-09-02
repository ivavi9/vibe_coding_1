from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import uvicorn
import os
from datetime import date, datetime
from dotenv import load_dotenv
from typing import List

from database import get_db, engine, Base
from models import Goal, ProgressEntry, DailyProgress
from services.document_parser import DocumentParser
from services.progress_tracker import ProgressTracker
from schemas import (
    GoalCreate, GoalResponse, ProgressCreate, ProgressResponse,
    DailyProgressCreate, DailyProgressResponse, GoalWithProgress,
    DailyProgressSummary, GoalUpdate
)

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Progress Tracker API", version="2.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (commented out for now)
# app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize services
document_parser = DocumentParser()
progress_tracker = ProgressTracker()

@app.get("/")
async def root():
    return {"message": "Progress Tracker API v2.0 is running"}

@app.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and parse a document to extract goals"""
    try:
        # Save uploaded file temporarily
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse document to extract goals
        goals = await document_parser.parse_document(file_path)
        
        # Save goals to database
        goal_objects = []
        for goal_data in goals:
            # Parse target_date if it's a string
            target_date = goal_data.get("target_date")
            if target_date and isinstance(target_date, str):
                try:
                    from datetime import datetime
                    import re
                    
                    # Try to parse common date formats
                    target_date_lower = target_date.lower()
                    
                    # Month + Year patterns
                    if "february" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 2, 1)
                    elif "march" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 3, 1)
                    elif "april" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 4, 1)
                    elif "may" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 5, 1)
                    elif "june" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 6, 1)
                    elif "july" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 7, 1)
                    elif "august" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 8, 1)
                    elif "september" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 9, 1)
                    elif "october" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 10, 1)
                    elif "november" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 11, 1)
                    elif "december" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 12, 1)
                    elif "january" in target_date_lower and "2026" in target_date:
                        target_date = datetime(2026, 1, 1)
                    # Year only patterns
                    elif "2026" in target_date:
                        target_date = datetime(2026, 12, 31)  # End of year
                    elif "2025" in target_date:
                        target_date = datetime(2025, 12, 31)  # End of year
                    elif "2024" in target_date:
                        target_date = datetime(2024, 12, 31)  # End of year
                    else:
                        target_date = None
                except:
                    target_date = None
            
            goal = Goal(
                title=goal_data["title"],
                description=goal_data["description"],
                target_date=target_date,
                priority=goal_data.get("priority", "medium"),
                category=goal_data.get("category", "general")
            )
            db.add(goal)
            goal_objects.append(goal)
        
        db.commit()
        
        # Convert SQLAlchemy objects to dictionaries for JSON response
        goals_response = []
        for goal in goal_objects:
            goals_response.append({
                "id": goal.id,
                "title": goal.title,
                "description": goal.description,
                "target_date": goal.target_date.isoformat() if goal.target_date else None,
                "priority": goal.priority,
                "category": goal.category,
                "created_at": goal.created_at.isoformat() if goal.created_at else None
            })
        
        # Clean up temp file
        os.remove(file_path)
        
        return {"goals": goals_response, "message": f"Successfully extracted {len(goals)} goals"}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/goals", response_model=List[GoalResponse])
async def get_goals(db: Session = Depends(get_db)):
    """Get all goals with progress information"""
    goals = db.query(Goal).all()
    
    goals_response = []
    for goal in goals:
        # Calculate current progress from daily progress entries
        daily_progress = db.query(DailyProgress).filter(
            DailyProgress.goal_id == goal.id
        ).all()
        
        current_progress = sum(dp.progress_value for dp in daily_progress)
        total_entries = len(daily_progress)
        
        goals_response.append(GoalResponse(
            id=goal.id,
            title=goal.title,
            description=goal.description,
            target_date=goal.target_date,
            priority=goal.priority,
            category=goal.category,
            created_at=goal.created_at,
            updated_at=goal.updated_at,
            current_progress=current_progress,
            total_progress_entries=total_entries
        ))
    
    return goals_response

@app.get("/goals/{goal_id}", response_model=GoalWithProgress)
async def get_goal(goal_id: int, db: Session = Depends(get_db)):
    """Get a specific goal with all its progress"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Get all daily progress for this goal
    daily_progress = db.query(DailyProgress).filter(DailyProgress.goal_id == goal_id).all()
    
    # Calculate current progress
    current_progress = sum(dp.progress_value for dp in daily_progress)
    total_progress_entries = len(daily_progress)
    
    return GoalWithProgress(
        id=goal.id,
        title=goal.title,
        description=goal.description,
        target_date=goal.target_date,
        priority=goal.priority,
        category=goal.category,
        created_at=goal.created_at,
        updated_at=goal.updated_at,
        current_progress=current_progress,
        total_progress_entries=total_progress_entries,
        progress_entries=[],
        daily_progress=daily_progress
    )

@app.put("/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int, 
    goal_update: GoalUpdate, 
    db: Session = Depends(get_db)
):
    """Update a goal"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Update goal fields
    for field, value in goal_update.dict(exclude_unset=True).items():
        setattr(goal, field, value)
    
    goal.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(goal)
    
    return GoalResponse(
        id=goal.id,
        title=goal.title,
        description=goal.description,
        target_date=goal.target_date,
        priority=goal.priority,
        category=goal.category,
        created_at=goal.created_at,
        updated_at=goal.updated_at
    )

@app.delete("/goals/{goal_id}")
async def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    """Delete a goal and all its progress"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Delete associated daily progress first
    db.query(DailyProgress).filter(DailyProgress.goal_id == goal_id).delete()
    
    # Delete the goal
    db.delete(goal)
    db.commit()
    
    return {"message": "Goal deleted successfully"}

@app.delete("/goals")
async def clear_all_goals(db: Session = Depends(get_db)):
    """Clear all goals and progress"""
    # Delete all daily progress
    db.query(DailyProgress).delete()
    
    # Delete all goals
    db.query(Goal).delete()
    db.commit()
    
    return {"message": "All goals cleared successfully"}

@app.post("/progress", response_model=ProgressResponse)
async def add_progress(
    progress_data: ProgressCreate,
    db: Session = Depends(get_db)
):
    """Add progress entry for a goal"""
    try:
        progress = ProgressEntry(
            goal_id=progress_data.goal_id,
            description=progress_data.description,
            completion_percentage=progress_data.completion_percentage,
            notes=progress_data.notes
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
        return progress
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/daily-progress", response_model=DailyProgressResponse)
async def add_daily_progress(
    progress_data: DailyProgressCreate,
    db: Session = Depends(get_db)
):
    """Add daily progress for a goal"""
    try:
        # Convert date string to date object if provided
        target_date = None
        if progress_data.date:
            try:
                target_date = datetime.strptime(progress_data.date, "%Y-%m-%d").date()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        else:
            target_date = date.today()
        
        # Check if progress already exists for this goal and date
        existing_progress = db.query(DailyProgress).filter(
            DailyProgress.goal_id == progress_data.goal_id,
            DailyProgress.date == target_date
        ).first()
        
        if existing_progress:
            # Update existing progress
            existing_progress.progress_value = progress_data.progress_value
            existing_progress.notes = progress_data.notes
            db.commit()
            db.refresh(existing_progress)
            return existing_progress
        else:
            # Create new progress
            progress = DailyProgress(
                goal_id=progress_data.goal_id,
                date=target_date,
                progress_value=progress_data.progress_value,
                notes=progress_data.notes
            )
            db.add(progress)
            db.commit()
            db.refresh(progress)
            return progress
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/daily-progress-bulk")
async def add_daily_progress_bulk(
    progress_data: List[DailyProgressCreate],
    db: Session = Depends(get_db)
):
    """Add daily progress for multiple goals at once"""
    try:
        results = []
        for progress in progress_data:
            # Convert date string to date object if provided
            target_date = None
            if progress.date:
                try:
                    target_date = datetime.strptime(progress.date, "%Y-%m-%d").date()
                except ValueError:
                    raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
            else:
                target_date = date.today()
            
            # Check if progress already exists for this goal and date
            existing_progress = db.query(DailyProgress).filter(
                DailyProgress.goal_id == progress.goal_id,
                DailyProgress.date == target_date
            ).first()
            
            if existing_progress:
                # Update existing progress
                existing_progress.progress_value = progress.progress_value
                existing_progress.notes = progress.notes
                results.append(existing_progress)
            else:
                # Create new progress
                new_progress = DailyProgress(
                    goal_id=progress.goal_id,
                    date=target_date,
                    progress_value=progress.progress_value,
                    notes=progress.notes
                )
                db.add(new_progress)
                results.append(new_progress)
        
        db.commit()
        return {"message": f"Successfully updated {len(results)} progress entries"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/progress/{goal_id}", response_model=List[ProgressResponse])
async def get_progress(goal_id: int, db: Session = Depends(get_db)):
    """Get progress entries for a specific goal"""
    progress_entries = db.query(ProgressEntry).filter(
        ProgressEntry.goal_id == goal_id
    ).order_by(ProgressEntry.created_at.desc()).all()
    return progress_entries

@app.get("/daily-progress/{goal_id}", response_model=List[DailyProgressResponse])
async def get_daily_progress(goal_id: int, db: Session = Depends(get_db)):
    """Get daily progress entries for a specific goal"""
    progress_entries = db.query(DailyProgress).filter(
        DailyProgress.goal_id == goal_id
    ).order_by(DailyProgress.date.desc()).all()
    return progress_entries

@app.get("/daily-progress-summary/{date}")
async def get_daily_progress_summary(
    date: str,
    db: Session = Depends(get_db)
):
    """Get summary of all progress for a specific date"""
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    daily_progress = db.query(DailyProgress).filter(
        DailyProgress.date == target_date
    ).all()
    
    total_progress = sum(dp.progress_value for dp in daily_progress)
    goals_updated = len(daily_progress)
    notes = [dp.notes for dp in daily_progress if dp.notes]
    
    return DailyProgressSummary(
        date=target_date,
        total_progress=total_progress,
        goals_updated=goals_updated,
        notes=notes
    )

@app.get("/analytics/{goal_id}")
async def get_analytics(goal_id: int, db: Session = Depends(get_db)):
    """Get analytics and visualizations for a goal"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    progress_entries = db.query(ProgressEntry).filter(
        ProgressEntry.goal_id == goal_id
    ).order_by(ProgressEntry.created_at.asc()).all()
    
    analytics = progress_tracker.generate_analytics(goal, progress_entries)
    return analytics

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
