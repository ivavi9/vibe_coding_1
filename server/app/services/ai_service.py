"""
AI Service for Clarity API.
Handles all AI-related operations including Gemini API integration and goal extraction.
"""
import logging
import json
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings
from app.core.prompts import GOAL_EXTRACTION_PROMPT

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI operations including Gemini API integration."""
    
    def __init__(self):
        """Initialize the AI service."""
        self.gemini_api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._configure_gemini()
    
    def _configure_gemini(self) -> None:
        """Configure Gemini API if key is available."""
        if self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                logger.info("Gemini API configured successfully")
            except Exception as e:
                logger.error(f"Failed to configure Gemini API: {e}")
        else:
            logger.warning("No Gemini API key found, will use fallback extraction")
    
    async def extract_goals_from_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract goals from text using Gemini API or fallback to keyword extraction.
        
        Args:
            text: The text content to analyze
            
        Returns:
            List of extracted goals with title, description, metric_type, and target_progress
        """
        try:
            # Try Gemini API first if available
            if self.gemini_api_key:
                goals = await self._extract_goals_with_gemini(text)
                if goals:
                    return goals
            
            # Fallback to keyword-based extraction
            logger.info("Using keyword-based goal extraction as fallback")
            return self._extract_goals_with_keywords(text)
            
        except Exception as e:
            logger.error(f"Error in goal extraction: {e}")
            return self._extract_goals_with_keywords(text)
    
    async def _extract_goals_with_gemini(self, text: str) -> Optional[List[Dict[str, Any]]]:
        """
        Extract goals using Gemini API.
        
        Args:
            text: The text content to analyze
            
        Returns:
            List of extracted goals or None if extraction fails
        """
        try:
            # Create the prompt with the actual text
            prompt = GOAL_EXTRACTION_PROMPT.format(text=text)
            
            # Call Gemini API
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Parse the JSON response
            goals = self._parse_gemini_response(response_text)
            if goals:
                logger.info(f"Successfully extracted {len(goals)} goals using Gemini API")
                return goals
            else:
                logger.warning("Gemini response parsing failed, falling back to keyword extraction")
                return None
                
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return None
    
    def _parse_gemini_response(self, response_text: str) -> Optional[List[Dict[str, Any]]]:
        """
        Parse Gemini API response to extract JSON goals.
        
        Args:
            response_text: Raw response from Gemini API
            
        Returns:
            Parsed goals list or None if parsing fails
        """
        try:
            # Clean the response to extract just the JSON
            if '[' in response_text and ']' in response_text:
                start = response_text.find('[')
                end = response_text.rfind(']') + 1
                json_str = response_text[start:end]
                
                # Parse the JSON
                goals = json.loads(json_str)
                
                # Validate the goals structure
                if self._validate_goals_structure(goals):
                    return goals
                else:
                    logger.warning("Goals structure validation failed")
                    return None
            else:
                logger.warning("Gemini response doesn't contain valid JSON array")
                return None
                
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse Gemini response as JSON: {e}")
            logger.debug(f"Gemini response: {response_text}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error parsing Gemini response: {e}")
            return None
    
    def _validate_goals_structure(self, goals: List[Dict[str, Any]]) -> bool:
        """
        Validate that goals have the required structure.
        
        Args:
            goals: List of goals to validate
            
        Returns:
            True if structure is valid, False otherwise
        """
        if not isinstance(goals, list):
            return False
        
        required_fields = {"title", "description", "metric_type", "target_progress"}
        valid_metric_types = {"Numeric", "Boolean", "Percentage"}
        
        for goal in goals:
            if not isinstance(goal, dict):
                return False
            
            # Check required fields
            if not all(field in goal for field in required_fields):
                return False
            
            # Validate metric type
            if goal.get("metric_type") not in valid_metric_types:
                return False
            
            # Validate target progress
            target = goal.get("target_progress")
            if not isinstance(target, (int, float, bool)):
                return False
        
        return True
    
    def _extract_goals_with_keywords(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract goals using keyword-based analysis as fallback.
        
        Args:
            text: The text content to analyze
            
        Returns:
            List of extracted goals
        """
        text_lower = text.lower()
        extracted_goals = []
        
        # Look for marathon/training related goals
        if any(word in text_lower for word in ["marathon", "training", "race", "running"]):
            if "6 month" in text_lower or "6-month" in text_lower:
                extracted_goals.append({
                    "title": "Complete 6-Month Marathon Training",
                    "description": "Follow the marathon training blueprint to prepare for race day",
                    "metric_type": "Boolean",
                    "target_progress": 1
                })
            
            if any(word in text_lower for word in ["mile", "km", "distance"]):
                extracted_goals.append({
                    "title": "Build Running Endurance",
                    "description": "Gradually increase running distance and stamina",
                    "metric_type": "Numeric",
                    "target_progress": 26.2  # Marathon distance
                })
        
        # Look for fitness/health goals
        if any(word in text_lower for word in ["fitness", "health", "exercise", "workout"]):
            extracted_goals.append({
                "title": "Improve Overall Fitness",
                "description": "Build strength, endurance, and cardiovascular health",
                "metric_type": "Numeric",
                "target_progress": 100
            })
        
        # Look for time-based goals
        if any(word in text_lower for word in ["week", "month", "year", "schedule"]):
            extracted_goals.append({
                "title": "Follow Training Schedule",
                "description": "Adhere to the planned training timeline and milestones",
                "metric_type": "Boolean",
                "target_progress": 1
            })
        
        # Look for learning/study goals
        if any(word in text_lower for word in ["study", "learn", "course", "degree", "certification"]):
            extracted_goals.append({
                "title": "Complete Learning Program",
                "description": "Successfully complete the outlined learning or study program",
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
        
        logger.info(f"Extracted {len(extracted_goals)} goals using keyword analysis")
        return extracted_goals

# Create global AI service instance
ai_service = AIService()
