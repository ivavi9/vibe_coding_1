"""
Document Service for Clarity API.
Handles document processing, text extraction, and file validation.
"""
import logging
from typing import Dict, Any, Optional
from fastapi import UploadFile, HTTPException
import PyPDF2
import io
from app.core.config import settings

logger = logging.getLogger(__name__)

class DocumentService:
    """Service for document processing and text extraction."""
    
    def __init__(self):
        """Initialize the document service."""
        self.allowed_types = settings.ALLOWED_FILE_TYPES
        self.max_file_size = settings.MAX_FILE_SIZE
    
    async def process_document(self, file: UploadFile, description: str = "") -> Dict[str, Any]:
        """
        Process uploaded document and extract text content.
        
        Args:
            file: The uploaded file
            description: Optional description for the document
            
        Returns:
            Dictionary containing processing results
            
        Raises:
            HTTPException: If file processing fails
        """
        try:
            # Validate file
            self._validate_file(file)
            
            # Extract text based on file type
            text_content = await self._extract_text_content(file)
            
            # Return processing results
            return {
                "success": True,
                "filename": file.filename,
                "content_type": file.content_type,
                "text_content": text_content,
                "content_length": len(text_content),
                "description": description
            }
            
        except Exception as e:
            logger.error(f"Error processing document {file.filename}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Error processing document: {str(e)}"
            )
    
    def _validate_file(self, file: UploadFile) -> None:
        """
        Validate uploaded file.
        
        Args:
            file: The file to validate
            
        Raises:
            HTTPException: If validation fails
        """
        # Check file type
        if file.content_type not in self.allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Allowed types: {', '.join(self.allowed_types)}"
            )
        
        # Check file size (if available)
        if hasattr(file, 'size') and file.size > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {self.max_file_size / (1024*1024):.1f}MB"
            )
    
    async def _extract_text_content(self, file: UploadFile) -> str:
        """
        Extract text content from uploaded file.
        
        Args:
            file: The file to extract text from
            
        Returns:
            Extracted text content
        """
        try:
            if file.content_type == "application/pdf":
                return self._extract_text_from_pdf(file)
            elif file.content_type == "text/plain":
                return await self._extract_text_from_txt(file)
            else:
                # For DOCX, we'd need python-docx library
                return "Document content extraction for DOCX not yet implemented"
                
        except Exception as e:
            logger.error(f"Error extracting text from {file.filename}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to extract text from document: {str(e)}"
            )
    
    def _extract_text_from_pdf(self, file: UploadFile) -> str:
        """
        Extract text content from PDF file.
        
        Args:
            file: The PDF file to process
            
        Returns:
            Extracted text content
        """
        try:
            # Read PDF content
            pdf_content = file.file.read()
            file.file.seek(0)  # Reset file pointer
            
            # Parse PDF
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
            text = ""
            
            # Extract text from all pages
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            extracted_text = text.strip()
            logger.info(f"Extracted {len(extracted_text)} characters from PDF: {file.filename}")
            return extracted_text
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF {file.filename}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to extract text from PDF: {str(e)}"
            )
    
    async def _extract_text_from_txt(self, file: UploadFile) -> str:
        """
        Extract text content from text file.
        
        Args:
            file: The text file to process
            
        Returns:
            Extracted text content
        """
        try:
            content = await file.read()
            text_content = content.decode('utf-8')
            
            logger.info(f"Extracted {len(text_content)} characters from text file: {file.filename}")
            return text_content
            
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                file.file.seek(0)
                content = await file.read()
                text_content = content.decode('latin-1')
                logger.info(f"Extracted text using latin-1 encoding: {file.filename}")
                return text_content
            except Exception as e:
                logger.error(f"Failed to decode text file {file.filename}: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="Failed to decode text file content"
                )
        except Exception as e:
            logger.error(f"Error reading text file {file.filename}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to read text file: {str(e)}"
            )
    
    def get_content_preview(self, text_content: str, max_length: int = 200) -> str:
        """
        Get a preview of the text content.
        
        Args:
            text_content: The full text content
            max_length: Maximum length of preview
            
        Returns:
            Content preview string
        """
        if len(text_content) <= max_length:
            return text_content
        
        # Find the last complete word within the limit
        preview = text_content[:max_length]
        last_space = preview.rfind(' ')
        
        if last_space > 0:
            preview = preview[:last_space]
        
        return preview + "..."

# Create global document service instance
document_service = DocumentService()
