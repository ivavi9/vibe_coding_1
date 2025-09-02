"""
Logging configuration for the Clarity API.

This module sets up structured logging as specified in the version-3 manifest.
"""

import logging
import logging.config
import sys
from typing import Dict, Any
from app.core.config import settings


def setup_logging() -> None:
    """Setup logging configuration."""
    
    # Define log format
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper()),
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )
    
    # Configure specific loggers
    loggers = {
        "uvicorn": {"level": "INFO"},
        "uvicorn.error": {"level": "INFO"},
        "uvicorn.access": {"level": "INFO"},
        "fastapi": {"level": "INFO"},
        "sqlalchemy": {"level": "WARNING"},
        "httpx": {"level": "WARNING"},
        "openai": {"level": "WARNING"},
        "google.generativeai": {"level": "WARNING"},
    }
    
    for logger_name, logger_config in loggers.items():
        logger = logging.getLogger(logger_name)
        logger.setLevel(logger_config["level"])
    
    # Set our app logger
    app_logger = logging.getLogger("clarity")
    app_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Create structured logger for API requests
    api_logger = logging.getLogger("clarity.api")
    api_logger.setLevel(logging.INFO)
    
    # Create structured logger for AI services
    ai_logger = logging.getLogger("clarity.ai")
    ai_logger.setLevel(logging.INFO)
    
    # Create structured logger for database operations
    db_logger = logging.getLogger("clarity.database")
    db_logger.setLevel(logging.INFO)


def log_api_request(
    method: str,
    path: str,
    status_code: int,
    duration: float,
    client_ip: str = None,
    user_id: str = None,
    **kwargs: Any
) -> None:
    """Log API request details in a structured format."""
    
    logger = logging.getLogger("clarity.api")
    
    log_data = {
        "event": "api_request",
        "method": method,
        "path": path,
        "status_code": status_code,
        "duration_ms": round(duration * 1000, 2),
        "client_ip": client_ip,
        "user_id": user_id,
        **kwargs
    }
    
    if status_code >= 400:
        logger.warning("API request failed", extra=log_data)
    else:
        logger.info("API request completed", extra=log_data)


def log_ai_request(
    service: str,
    prompt_length: int,
    response_length: int,
    duration: float,
    success: bool,
    error: str = None,
    **kwargs: Any
) -> None:
    """Log AI service requests in a structured format."""
    
    logger = logging.getLogger("clarity.ai")
    
    log_data = {
        "event": "ai_request",
        "service": service,
        "prompt_length": prompt_length,
        "response_length": response_length,
        "duration_ms": round(duration * 1000, 2),
        "success": success,
        "error": error,
        **kwargs
    }
    
    if success:
        logger.info("AI request successful", extra=log_data)
    else:
        logger.error("AI request failed", extra=log_data)


def log_database_operation(
    operation: str,
    table: str,
    duration: float,
    success: bool,
    error: str = None,
    **kwargs: Any
) -> None:
    """Log database operations in a structured format."""
    
    logger = logging.getLogger("clarity.database")
    
    log_data = {
        "event": "database_operation",
        "operation": operation,
        "table": table,
        "duration_ms": round(duration * 1000, 2),
        "success": success,
        "error": error,
        **kwargs
    }
    
    if success:
        logger.debug("Database operation completed", extra=log_data)
    else:
        logger.error("Database operation failed", extra=log_data)
