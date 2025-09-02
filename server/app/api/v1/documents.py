"""
Document API routes for Clarity API.
Handles document upload, processing, and goal extraction using service layer architecture.
"""
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.document_service import document_service
from app.services.goal_service import goal_service
from app.schemas.documents import (
    DocumentUploadResponse, DocumentGoalExtractionResponse,
    FileTypeSupportResponse, SupportedFileType
)
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    description: str = Form("")
):
    """
    Upload and process a document.
    
    Args:
        file: The document file to upload
        description: Optional description for the document
        
    Returns:
        Document processing results with success status
    """
    try:
        # Process the document
        result = await document_service.process_document(file, description)
        
        # Get content preview
        content_preview = document_service.get_content_preview(result["text_content"])
        result["content_preview"] = content_preview
        
        return DocumentUploadResponse(
            success=True,
            data=result,
            message=f"Document '{file.filename}' processed successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing document {file.filename}: {e}")
        raise HTTPException(status_code=500, detail="Failed to process document")

@router.post("/upload/document", response_model=DocumentGoalExtractionResponse)
async def upload_document_and_extract_goals(
    file: UploadFile = File(...),
    description: str = Form("")
):
    """
    Upload a document and extract goals using AI.
    
    Args:
        file: The document file to upload
        description: Optional description for the document
        
    Returns:
        Document processing results and extracted goals
    """
    try:
        # Process the document
        result = await document_service.process_document(file, description)
        
        # Extract goals from the document content
        extracted_goals = await goal_service.extract_goals_from_document(result["text_content"])
        
        # Get content preview
        content_preview = document_service.get_content_preview(result["text_content"])
        result["content_preview"] = content_preview
        
        logger.info(f"Successfully extracted {len(extracted_goals)} goals from document content")
        
        return DocumentGoalExtractionResponse(
            success=True,
            document_info=result,
            extracted_goals=extracted_goals,
            goals_count=len(extracted_goals),
            message=f"Document processed and {len(extracted_goals)} goals extracted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing document and extracting goals: {e}")
        raise HTTPException(status_code=500, detail="Failed to process document and extract goals")

@router.get("/supported-types", response_model=FileTypeSupportResponse)
async def get_supported_file_types():
    """
    Get information about supported file types.
    
    Returns:
        List of supported file types and size limits
    """
    try:
        supported_types = []
        
        # Define supported file types with descriptions
        file_type_info = {
            "application/pdf": {
                "extension": ".pdf",
                "description": "Portable Document Format",
                "max_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024)
            },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
                "extension": ".docx",
                "description": "Microsoft Word Document",
                "max_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024)
            },
            "text/plain": {
                "extension": ".txt",
                "description": "Plain Text File",
                "max_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024)
            }
        }
        
        for mime_type, info in file_type_info.items():
            supported_types.append(SupportedFileType(
                mime_type=mime_type,
                extension=info["extension"],
                description=info["description"],
                max_size_mb=info["max_size_mb"]
            ))
        
        return FileTypeSupportResponse(
            success=True,
            supported_types=supported_types,
            max_file_size_mb=settings.MAX_FILE_SIZE / (1024 * 1024),
            message="Supported file types retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Error retrieving supported file types: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve supported file types")

@router.get("/health")
async def document_service_health():
    """
    Check document service health.
    
    Returns:
        Service health status
    """
    try:
        return {
            "success": True,
            "service": "Document Service",
            "status": "healthy",
            "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
            "supported_types_count": len(settings.ALLOWED_FILE_TYPES),
            "message": "Document service is operational"
        }
    except Exception as e:
        logger.error(f"Document service health check failed: {e}")
        return {
            "success": False,
            "service": "Document Service",
            "status": "unhealthy",
            "error": str(e),
            "message": "Document service health check failed"
        }
