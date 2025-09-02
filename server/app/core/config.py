"""
Configuration management for Clarity API.
Centralizes all environment variables and app settings.
"""
from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Clarity API"
    PROJECT_DESCRIPTION: str = "AI-Native Personal Achievement Partner API"
    VERSION: str = "1.0.0"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Gemini Configuration
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Get allowed file types from env or use defaults
    @property
    def ALLOWED_FILE_TYPES(self) -> List[str]:
        env_types = os.getenv("ALLOWED_FILE_TYPES", "")
        if env_types:
            # Parse comma-separated string from env
            return [f"application/{ext.strip('.')}" if ext.startswith('.') else ext for ext in env_types.split(',')]
        return [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
        ]
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()

