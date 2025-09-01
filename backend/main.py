from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import uvicorn
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import Goal, ProgressEntry
from services.document_parser import DocumentParser
from services.progress_tracker import ProgressTracker
from schemas import GoalCreate, GoalResponse, ProgressCreate, ProgressResponse

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Progress Tracker API", version="1.0.0")

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
    return {"message": "Progress Tracker API is running"}

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

@app.get("/goals", response_model=list[GoalResponse])
async def get_goals(db: Session = Depends(get_db)):
    """Get all goals"""
    goals = db.query(Goal).all()
    return goals

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

@app.get("/progress/{goal_id}", response_model=list[ProgressResponse])
async def get_progress(goal_id: int, db: Session = Depends(get_db)):
    """Get progress entries for a specific goal"""
    progress_entries = db.query(ProgressEntry).filter(
        ProgressEntry.goal_id == goal_id
    ).order_by(ProgressEntry.created_at.desc()).all()
    return progress_entries

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
