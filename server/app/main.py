"""
Clarity API - Main Application Entry Point
AI-Native Personal Achievement Partner
"""
import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.constants import ALLOWED_ORIGINS, API_TITLE, API_VERSION, API_DESCRIPTION
from app.api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup
    logger.info("Starting Clarity API...")
    yield
    # Shutdown
    logger.info("Shutting down Clarity API...")

# Create FastAPI application
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and response times."""
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url.path} from {request.client.host}")
    
    # Process request
    response = await call_next(request)
    
    # Calculate and log response time
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} took {process_time:.4f}s")
    
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {exc}")
    return {"error": "Internal server error", "detail": str(exc)}

# Include main API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": API_TITLE,
        "version": API_VERSION,
        "timestamp": time.time()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": f"Welcome to {API_TITLE}",
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "docs": "/docs",
        "health": "/health"
    }

# Test Google OAuth endpoint (simple version)
@app.post("/test-google-oauth")
async def test_google_oauth():
    """Test endpoint for Google OAuth without database dependencies."""
    return {
        "message": "Google OAuth test endpoint working",
        "status": "success",
        "endpoints": {
            "google_callback": "/api/v1/auth/google/callback",
            "validate_token": "/api/v1/auth/validate",
            "logout": "/api/v1/auth/logout"
        }
    }
