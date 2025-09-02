"""
Clarity API - Main Application Entry Point

This module initializes the FastAPI application with all necessary middleware,
routers, and configuration based on the version-3 manifest specifications.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
    
    # Demo endpoints
    @app.get("/api/v1/goals")
    async def get_goals():
        """Get demo goals."""
        return {
            "data": [
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
        }
    
    @app.post("/api/v1/goals")
    async def create_goal(request: Request):
        """Create a demo goal."""
        body = await request.json()
        return {
            "message": "Goal created successfully",
            "data": {
                "id": "3",
                "title": body.get("title", "New Goal"),
                "description": body.get("description", ""),
                "metric_type": body.get("metric_type", "Numeric"),
                "current_progress": 0,
                "target_progress": body.get("target_progress", 100),
                "status": "active"
            }
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
