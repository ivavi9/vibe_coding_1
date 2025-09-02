"""
Clarity API - Main Application Entry Point

This module initializes the FastAPI application with all necessary middleware,
routers, and configuration based on the version-3 manifest specifications.
"""

from fastapi import FastAPI, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
from typing import Dict, Any, List
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for demo purposes (replace with database later)
goals_db = [
    {
        "id": "1",
        "title": "Read 12 books",
        "description": "Read 12 books this year",
        "metric_type": "Numeric",
        "current_progress": 3,
        "target_progress": 12,
        "status": "active"
    },
    {
        "id": "2",
        "title": "Run 100km",
        "description": "Build endurance and fitness",
        "metric_type": "Numeric",
        "current_progress": 15,
        "target_progress": 100,
        "status": "active"
    }
]

progress_history = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting Clarity API...")
    logger.info("Clarity API started successfully")

    yield

    # Shutdown
    logger.info("Shutting down Clarity API...")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title="Clarity API",
        description="AI-Native Personal Achievement Partner API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Add middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )
        
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(
            f"Response: {response.status_code} "
            f"took {process_time:.4f}s"
        )
        
        return response
    
    # Add exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
    
    # Health check endpoint
    @app.get("/health")
    async def health_check() -> Dict[str, Any]:
        return {
            "status": "healthy",
            "service": "Clarity API",
            "version": "1.0.0"
        }

    # Goals CRUD endpoints
    @app.get("/api/v1/goals")
    async def get_goals():
        """Get all goals."""
        return {"data": goals_db}

    @app.get("/api/v1/goals/{goal_id}")
    async def get_goal(goal_id: str):
        """Get a specific goal by ID."""
        goal = next((g for g in goals_db if g["id"] == goal_id), None)
        if not goal:
            return JSONResponse(status_code=404, content={"detail": "Goal not found"})
        return {"data": goal}

    @app.post("/api/v1/goals")
    async def create_goal(request: Request):
        """Create a new goal."""
        body = await request.json()
        new_goal = {
            "id": str(len(goals_db) + 1),
            "title": body.get("title", "New Goal"),
            "description": body.get("description", ""),
            "metric_type": body.get("metric_type", "Numeric"),
            "current_progress": body.get("current_progress", 0),
            "target_progress": body.get("target_progress", 100),
            "status": "active"
        }
        goals_db.append(new_goal)
        return {"message": "Goal created successfully", "data": new_goal}

    @app.put("/api/v1/goals/{goal_id}")
    async def update_goal(goal_id: str, request: Request):
        """Update a goal."""
        body = await request.json()
        goal = next((g for g in goals_db if g["id"] == goal_id), None)
        if not goal:
            return JSONResponse(status_code=404, content={"detail": "Goal not found"})
        
        # Update goal fields
        for key, value in body.items():
            if key in goal:
                goal[key] = value
        
        return {"message": "Goal updated successfully", "data": goal}

    @app.delete("/api/v1/goals/{goal_id}")
    async def delete_goal(goal_id: str):
        """Delete a goal."""
        global goals_db
        goal = next((g for g in goals_db if g["id"] == goal_id), None)
        if not goal:
            return JSONResponse(status_code=404, content={"detail": "Goal not found"})
        
        goals_db = [g for g in goals_db if g["id"] != goal_id]
        return {"message": "Goal deleted successfully"}

    # Progress tracking endpoints
    @app.post("/api/v1/progress")
    async def track_progress(request: Request):
        """Track progress for goals."""
        body = await request.json()
        progress_entry = {
            "id": str(len(progress_history) + 1),
            "goal_id": body.get("goal_id"),
            "description": body.get("description", ""),
            "progress_value": body.get("progress_value", 0),
            "timestamp": time.time(),
            "type": "manual"
        }
        progress_history.append(progress_entry)
        
        # Update goal progress if goal_id is provided
        if body.get("goal_id"):
            goal = next((g for g in goals_db if g["id"] == body["goal_id"]), None)
            if goal:
                goal["current_progress"] = min(
                    goal["current_progress"] + body.get("progress_value", 0),
                    goal["target_progress"]
                )
        
        return {"message": "Progress tracked successfully", "data": progress_entry}

    @app.get("/api/v1/progress")
    async def get_progress_history():
        """Get progress history."""
        return {"data": progress_history}

    # File upload endpoints
    @app.post("/api/v1/upload/document")
    async def upload_document(
        file: UploadFile = File(...),
        description: str = Form("")
    ):
        """Upload a document (PDF, DOCX, TXT) for goal extraction."""
        # Validate file type
        allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                status_code=400, 
                content={"detail": "File type not supported. Please upload PDF, DOCX, or TXT files."}
            )
        
        # For demo purposes, we'll simulate processing
        # In production, this would use the Gemini API to extract goals
        logger.info(f"Processing document: {file.filename} ({file.content_type})")
        
        # Simulate extracted goals from document
        extracted_goals = [
            {
                "title": "Complete Project Documentation",
                "description": "Finish all project documentation and user guides",
                "metric_type": "Boolean",
                "target_progress": 1
            },
            {
                "title": "Learn New Framework",
                "description": "Master the new development framework within 3 months",
                "metric_type": "Numeric",
                "target_progress": 100
            }
        ]
        
        return {
            "message": "Document processed successfully",
            "filename": file.filename,
            "extracted_goals": extracted_goals
        }

    @app.post("/api/v1/goals/extract")
    async def extract_goals_from_text(request: Request):
        """Extract goals from natural language text."""
        body = await request.json()
        text = body.get("text", "")
        
        if not text:
            return JSONResponse(status_code=400, content={"detail": "Text is required"})
        
        # Simulate AI goal extraction
        # In production, this would use the Gemini API
        logger.info(f"Extracting goals from text: {text[:100]}...")
        
        # Simple keyword-based extraction for demo
        extracted_goals = []
        if "read" in text.lower() and any(char.isdigit() for char in text):
            extracted_goals.append({
                "title": "Reading Goal",
                "description": "Complete reading targets",
                "metric_type": "Numeric",
                "target_progress": 12
            })
        
        if "run" in text.lower() and any(char.isdigit() for char in text):
            extracted_goals.append({
                "title": "Fitness Goal",
                "description": "Achieve running distance targets",
                "metric_type": "Numeric",
                "target_progress": 100
            })
        
        return {
            "message": "Goals extracted successfully",
            "extracted_goals": extracted_goals
        }

    return app


# Create application instance
app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
