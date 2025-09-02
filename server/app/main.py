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
import google.generativeai as genai
import PyPDF2
import io

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

def extract_text_from_pdf(pdf_file: UploadFile) -> str:
    """Extract text content from PDF file."""
    try:
        # Read PDF content
        pdf_content = pdf_file.file.read()
        pdf_file.file.seek(0)  # Reset file pointer
        
        # Parse PDF
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        text = ""
        
        # Extract text from all pages
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        logger.info(f"Extracted {len(text)} characters from PDF")
        return text.strip()
        
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_goals_with_gemini(text: str) -> List[Dict[str, Any]]:
    """Extract goals from text using Gemini API or fallback to keyword extraction."""
    try:
        # Check if Gemini API key is available
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        if gemini_api_key:
            try:
                # Configure Gemini API
                genai.configure(api_key=gemini_api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                # Create the prompt for goal extraction
                prompt = f"""
                You are an AI assistant that extracts actionable goals from text content. 
                Analyze the following text and identify specific, measurable goals that someone could track and achieve.
                
                TEXT TO ANALYZE:
                {text}
                
                INSTRUCTIONS:
                1. Identify 3-5 specific, actionable goals from the text
                2. Each goal should be clear, measurable, and achievable
                3. Focus on goals related to training, fitness, learning, or personal development
                4. For each goal, provide:
                   - A clear, concise title
                   - A detailed description
                   - The metric type (Numeric, Boolean, or Percentage)
                   - A target value or completion criteria
                
                RESPONSE FORMAT:
                Return a JSON array of goals with this exact structure:
                [
                    {{
                        "title": "Goal Title",
                        "description": "Detailed description of what needs to be achieved",
                        "metric_type": "Numeric|Boolean|Percentage",
                        "target_progress": <target_value>
                    }}
                ]
                
                EXAMPLES:
                - For marathon training: {{"title": "Complete 6-Month Training Program", "description": "Follow the complete training schedule from start to finish", "metric_type": "Boolean", "target_progress": 1}}
                - For fitness: {{"title": "Build Running Endurance", "description": "Gradually increase running distance and stamina", "metric_type": "Numeric", "target_progress": 26.2}}
                - For learning: {{"title": "Master Training Techniques", "description": "Learn and practice proper running form and training methods", "metric_type": "Percentage", "target_progress": 100}}
                
                IMPORTANT: Return ONLY the JSON array, no additional text or explanations.
                """
                
                # Call Gemini API
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                # Try to parse the JSON response
                try:
                    # Clean the response to extract just the JSON
                    if '[' in response_text and ']' in response_text:
                        start = response_text.find('[')
                        end = response_text.rfind(']') + 1
                        json_str = response_text[start:end]
                        
                        extracted_goals = json.loads(json_str)
                        logger.info(f"Successfully extracted {len(extracted_goals)} goals using Gemini API")
                        return extracted_goals
                    else:
                        logger.warning("Gemini response doesn't contain valid JSON array, falling back to keyword extraction")
                        
                except json.JSONDecodeError as e:
                    logger.warning(f"Failed to parse Gemini response as JSON: {e}, falling back to keyword extraction")
                    logger.debug(f"Gemini response: {response_text}")
                    
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}, falling back to keyword extraction")
        
        # Enhanced keyword-based extraction as fallback
        logger.info("Using keyword-based goal extraction as fallback")
        extracted_goals = []
        
        # Look for marathon/training related goals
        if any(word in text.lower() for word in ["marathon", "training", "race", "running"]):
            if "6 month" in text.lower() or "6-month" in text.lower():
                extracted_goals.append({
                    "title": "Complete 6-Month Marathon Training",
                    "description": "Follow the marathon training blueprint to prepare for race day",
                    "metric_type": "Boolean",
                    "target_progress": 1
                })
            
            if any(word in text.lower() for word in ["mile", "km", "distance"]):
                extracted_goals.append({
                    "title": "Build Running Endurance",
                    "description": "Gradually increase running distance and stamina",
                    "metric_type": "Numeric",
                    "target_progress": 26.2  # Marathon distance
                })
        
        # Look for fitness/health goals
        if any(word in text.lower() for word in ["fitness", "health", "exercise", "workout"]):
            extracted_goals.append({
                "title": "Improve Overall Fitness",
                "description": "Build strength, endurance, and cardiovascular health",
                "metric_type": "Numeric",
                "target_progress": 100
            })
        
        # Look for time-based goals
        if any(word in text.lower() for word in ["week", "month", "year", "schedule"]):
            extracted_goals.append({
                "title": "Follow Training Schedule",
                "description": "Adhere to the planned training timeline and milestones",
                "metric_type": "Boolean",
                "target_progress": 1
            })
        
        # If no specific goals found, create a general one
        if not extracted_goals:
            extracted_goals.append({
                "title": "Complete Training Program",
                "description": "Successfully complete the outlined training program",
                "metric_type": "Boolean",
                "target_progress": 1
            })
        
        return extracted_goals
        
    except Exception as e:
        logger.error(f"Error extracting goals: {e}")
        return []

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
        
        try:
            logger.info(f"Processing document: {file.filename} ({file.content_type})")
            
            # Extract text based on file type
            if file.content_type == "application/pdf":
                text_content = extract_text_from_pdf(file)
            elif file.content_type == "text/plain":
                text_content = (await file.read()).decode('utf-8')
            else:
                # For DOCX, we'd need python-docx library
                text_content = "Document content extraction for DOCX not yet implemented"
            
            # Extract goals from the actual text content
            extracted_goals = extract_goals_with_gemini(text_content)
            
            logger.info(f"Extracted {len(extracted_goals)} goals from document content")
            
            return {
                "message": "Document processed successfully",
                "filename": file.filename,
                "extracted_goals": extracted_goals,
                "content_preview": text_content[:200] + "..." if len(text_content) > 200 else text_content
            }
            
        except Exception as e:
            logger.error(f"Error processing document: {e}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Error processing document: {str(e)}"}
            )

    @app.post("/api/v1/goals/extract")
    async def extract_goals_from_text(request: Request):
        """Extract goals from natural language text."""
        body = await request.json()
        text = body.get("text", "")
        
        if not text:
            return JSONResponse(status_code=400, content={"detail": "Text is required"})
        
        # Extract goals from the actual text content using Gemini API
        extracted_goals = extract_goals_with_gemini(text)
        
        logger.info(f"Extracted {len(extracted_goals)} goals from text: {text[:100]}...")
        
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
