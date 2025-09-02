"""
Document schemas for Clarity API.
Pydantic models for document processing and upload operations.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.goals import GoalBase

class DocumentUploadRequest(BaseModel):
    """Request model for document upload."""
    description: Optional[str] = Field(None, max_length=500, description="Optional description for the document")

class DocumentProcessingResult(BaseModel):
    """Model for document processing results."""
    success: bool = Field(..., description="Processing success status")
    filename: str = Field(..., description="Name of the uploaded file")
    content_type: str = Field(..., description="MIME type of the file")
    text_content: str = Field(..., description="Extracted text content from the document")
    content_length: int = Field(..., description="Length of extracted text content")
    description: Optional[str] = Field(None, description="User-provided description")
    content_preview: str = Field(..., description="Preview of the extracted content")

class DocumentUploadResponse(BaseModel):
    """Response model for document upload and processing."""
    success: bool = Field(..., description="Operation success status")
    data: DocumentProcessingResult = Field(..., description="Document processing results")
    message: Optional[str] = Field(None, description="Response message")
    error: Optional[str] = Field(None, description="Error message if operation failed")

class DocumentGoalExtractionResponse(BaseModel):
    """Response model for goal extraction from documents."""
    success: bool = Field(..., description="Extraction success status")
    document_info: DocumentProcessingResult = Field(..., description="Document processing information")
    extracted_goals: List[GoalBase] = Field(..., description="Goals extracted from the document")
    goals_count: int = Field(..., description="Number of goals extracted")
    message: Optional[str] = Field(None, description="Response message")

class DocumentValidationError(BaseModel):
    """Model for document validation errors."""
    field: str = Field(..., description="Field that caused the validation error")
    error: str = Field(..., description="Description of the validation error")
    value: Optional[str] = Field(None, description="Value that caused the error")

class DocumentErrorResponse(BaseModel):
    """Response model for document processing errors."""
    success: bool = Field(default=False, description="Operation success status")
    error: str = Field(..., description="Error message")
    details: Optional[List[DocumentValidationError]] = Field(None, description="Detailed validation errors")
    document_info: Optional[DocumentProcessingResult] = Field(None, description="Partial document info if available")

class SupportedFileType(BaseModel):
    """Model for supported file type information."""
    mime_type: str = Field(..., description="MIME type of the file")
    extension: str = Field(..., description="File extension")
    description: str = Field(..., description="Human-readable description of the file type")
    max_size_mb: float = Field(..., description="Maximum file size in MB")

class FileTypeSupportResponse(BaseModel):
    """Response model for supported file types."""
    success: bool = Field(..., description="Operation success status")
    supported_types: List[SupportedFileType] = Field(..., description="List of supported file types")
    max_file_size_mb: float = Field(..., description="Maximum file size in MB")
    message: Optional[str] = Field(None, description="Response message")
