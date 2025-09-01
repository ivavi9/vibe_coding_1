import os
import re
from typing import List, Dict
import docx
import PyPDF2
import google.generativeai as genai
import json

class DocumentParser:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
    
    async def parse_document(self, file_path: str) -> List[Dict]:
        """Parse document and extract goals using AI"""
        try:
            # Extract text based on file type
            text = self._extract_text(file_path)
            
            # Use AI to extract goals from text
            goals = await self._extract_goals_with_ai(text)
            
            return goals
        except Exception as e:
            print(f"Error parsing document: {e}")
            return []
    
    def _extract_text(self, file_path: str) -> str:
        """Extract text from various document formats"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.txt':
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        
        elif file_extension == '.docx':
            doc = docx.Document(file_path)
            return '\n'.join([paragraph.text for paragraph in doc.paragraphs])
        
        elif file_extension == '.pdf':
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ''
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
        
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    async def _extract_goals_with_ai(self, text: str) -> List[Dict]:
        """Use Google Gemini to extract goals from text"""
        try:
            if not self.model:
                print("Gemini API key not configured, using fallback method")
                return self._extract_goals_fallback(text)
            
            prompt = f"""
            Analyze the following text and extract specific, measurable goals. 
            For each goal, provide:
            1. A clear, actionable title
            2. A detailed description
            3. A target date if mentioned
            4. Priority level (low, medium, high)
            5. Category (work, personal, health, learning, etc.)
            
            Text to analyze:
            {text[:4000]}  # Limit text length for API
            
            Return the results as a JSON array of objects with keys: title, description, target_date, priority, category.
            If no specific goals are found, return an empty array.
            Only return valid JSON, no additional text.
            """
            
            response = self.model.generate_content(prompt)
            result = response.text.strip()
            
            # Clean the response to extract JSON
            if result.startswith('```json'):
                result = result[7:]
            if result.endswith('```'):
                result = result[:-3]
            result = result.strip()
            
            goals = json.loads(result)
            
            # Validate and clean the goals
            validated_goals = []
            for goal in goals:
                if isinstance(goal, dict) and 'title' in goal:
                    validated_goals.append({
                        'title': goal.get('title', ''),
                        'description': goal.get('description', ''),
                        'target_date': goal.get('target_date'),
                        'priority': goal.get('priority', 'medium'),
                        'category': goal.get('category', 'general')
                    })
            
            return validated_goals
            
        except Exception as e:
            print(f"Error extracting goals with AI: {e}")
            # Fallback: extract simple goals using regex
            return self._extract_goals_fallback(text)
    
    def _extract_goals_fallback(self, text: str) -> List[Dict]:
        """Fallback method to extract goals using regex patterns"""
        goals = []
        
        # Look for common goal patterns - more flexible
        patterns = [
            # Explicit goals
            r'(?:goal|target|objective|aim):\s*([^.\n]+)',
            r'(?:I want to|I will|I plan to|I need to)\s+([^.\n]+)',
            r'(?:achieve|complete|finish|accomplish)\s+([^.\n]+)',
            
            # Habits and routines
            r'(?:habit|routine|schedule):\s*([^.\n]+)',
            r'(?:every day|daily|weekly|monthly)\s+([^.\n]+)',
            r'(?:start|begin|stop|quit)\s+([^.\n]+)',
            
            # Learning and development
            r'(?:learn|study|master|practice)\s+([^.\n]+)',
            r'(?:course|training|workshop|certification)\s+([^.\n]+)',
            
            # Health and fitness
            r'(?:exercise|workout|gym|run|walk)\s+([^.\n]+)',
            r'(?:diet|eat|drink|sleep)\s+([^.\n]+)',
            
            # Work and career
            r'(?:promotion|raise|job|career|project)\s+([^.\n]+)',
            r'(?:meeting|deadline|deliver|present)\s+([^.\n]+)',
            
            # Financial
            r'(?:save|budget|invest|earn|spend)\s+([^.\n]+)',
            r'(?:debt|loan|mortgage|retirement)\s+([^.\n]+)',
            
            # Personal development
            r'(?:read|write|create|build|make)\s+([^.\n]+)',
            r'(?:travel|visit|explore|discover)\s+([^.\n]+)',
            
            # Numbered lists
            r'^\s*\d+\.\s*([^.\n]+)',
            r'^\s*[-*]\s*([^.\n]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                goal_text = match.strip()
                if len(goal_text) > 5:  # More lenient length requirement
                    # Determine category based on content
                    category = 'general'
                    if any(word in goal_text.lower() for word in ['work', 'job', 'career', 'meeting', 'project']):
                        category = 'work'
                    elif any(word in goal_text.lower() for word in ['exercise', 'gym', 'run', 'walk', 'diet', 'health']):
                        category = 'health'
                    elif any(word in goal_text.lower() for word in ['learn', 'study', 'course', 'read', 'book']):
                        category = 'learning'
                    elif any(word in goal_text.lower() for word in ['save', 'money', 'budget', 'invest']):
                        category = 'finance'
                    elif any(word in goal_text.lower() for word in ['travel', 'visit', 'family', 'friend']):
                        category = 'personal'
                    
                    goals.append({
                        'title': goal_text,
                        'description': f"Goal extracted from document: {goal_text}",
                        'target_date': None,
                        'priority': 'medium',
                        'category': category
                    })
        
        # Remove duplicates and limit
        unique_goals = []
        seen = set()
        for goal in goals:
            if goal['title'].lower() not in seen:
                seen.add(goal['title'].lower())
                unique_goals.append(goal)
        
        return unique_goals[:15]  # Increased limit to 15 goals
