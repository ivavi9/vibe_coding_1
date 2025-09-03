"""
Centralized constants for the Clarity API backend.
This file should be the single source of truth for all configuration values.
"""

import os
from typing import List

# Environment Configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Server Configuration
SERVER_HOST = os.getenv("SERVER_HOST", "127.0.0.1")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8001"))

# CORS Configuration
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# API Configuration
API_PREFIX = "/api/v1"
API_TITLE = "Clarity API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "AI-powered goal tracking and progress management API"

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./clarity.db")
DATABASE_TEST_URL = os.getenv("DATABASE_TEST_URL", "sqlite:///./test_clarity.db")

# Authentication Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")

# AI Service Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_FALLBACK_ENABLED = os.getenv("AI_FALLBACK_ENABLED", "true").lower() == "true"

# File Upload Configuration
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
ALLOWED_FILE_TYPES = os.getenv("ALLOWED_FILE_TYPES", "pdf,doc,docx,txt").split(",")

# Rate Limiting
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Guest Mode Configuration
GUEST_MODE_ENABLED = os.getenv("GUEST_MODE_ENABLED", "true").lower() == "true"
GUEST_TRIAL_DURATION_HOURS = int(os.getenv("GUEST_TRIAL_DURATION_HOURS", "24"))

# Validation Constants
MIN_TEXT_LENGTH = 10
MAX_TITLE_LENGTH = 200
MAX_DESCRIPTION_LENGTH = 1000
MIN_TARGET_PROGRESS = 0.1

# Response Messages
MESSAGES = {
    "GOAL_CREATED": "Goal created successfully",
    "GOAL_UPDATED": "Goal updated successfully",
    "GOAL_DELETED": "Goal deleted successfully",
    "GOAL_NOT_FOUND": "Goal not found",
    "INVALID_INPUT": "Invalid input data",
    "UNAUTHORIZED": "Unauthorized access",
    "FORBIDDEN": "Access forbidden",
    "INTERNAL_ERROR": "Internal server error",
    "EXTRACTION_SUCCESS": "Goals extracted successfully",
    "EXTRACTION_FAILED": "Failed to extract goals",
}

# HTTP Status Codes
HTTP_STATUS = {
    "OK": 200,
    "CREATED": 201,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "UNPROCESSABLE_ENTITY": 422,
    "INTERNAL_SERVER_ERROR": 500,
}
