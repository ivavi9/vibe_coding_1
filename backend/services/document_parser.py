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
        """Use Google Gemini to extract specific, actionable goals from text"""
        try:
            if not self.model:
                print("Gemini API key not configured, using fallback method")
                return self._extract_goals_fallback(text)
            
            prompt = f"""
            You are an expert goal extraction specialist. Your task is to analyze the following text and extract ONLY specific, actionable, measurable goals.

            CRITICAL RULES:
            1. ONLY extract items that are clearly stated as goals, objectives, targets, or actionable commitments
            2. IGNORE general statements, descriptions, processes, or informational text
            3. Each goal must be SPECIFIC and MEASURABLE
            4. Filter out vague statements, fragments, or non-actionable content
            5. Focus on goals that have clear success criteria

            GOAL QUALITY CRITERIA:
            - Must be actionable (someone can do something about it)
            - Must be specific (not vague or general)
            - Must be measurable (can track progress)
            - Must be time-bound or have clear completion criteria
            - Must be a commitment or intention, not just a description

            EXAMPLES OF GOOD GOALS:
            ✅ "Complete 60 minutes of focused study on MS task daily"
            ✅ "Achieve 8 hours of sleep on WFH days"
            ✅ "Dedicate 45 minutes of screen-free time with wife daily"
            ✅ "Complete 90 minutes of study review on WFH days"

            EXAMPLES OF WHAT TO IGNORE:
            ❌ "workday" (too vague)
            ❌ "process" (not a goal)
            ❌ "energy" (not actionable)
            ❌ "workouts" (not specific enough)
            ❌ "commute" (not a goal)
            ❌ "session" (too vague)

            Text to analyze:
            {text[:4000]}

            Return ONLY a JSON array of high-quality goals. Each goal object should have:
            - title: Clear, specific goal title
            - description: Detailed explanation of what needs to be accomplished
            - target_date: Date if specified, null if not mentioned
            - priority: "low", "medium", or "high" based on importance
            - category: "work", "personal", "health", "learning", "finance", "career", etc.

            If no clear, actionable goals are found, return an empty array.
            Return ONLY valid JSON, no additional text or explanations.
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
            
            # Additional validation to filter out low-quality goals
            validated_goals = []
            for goal in goals:
                if isinstance(goal, dict) and 'title' in goal:
                    title = goal.get('title', '').strip()
                    description = goal.get('description', '').strip()
                    
                    # Skip goals that are too vague or short
                    if (len(title) < 10 or 
                        len(description) < 20 or
                        title.lower() in ['workday', 'process', 'energy', 'workouts', 'commute', 'session', 'blocks', 'switch', 'cooldown', 'protocol'] or
                        any(word in title.lower() for word in ['workout', 'session', 'block', 'process', 'energy'])):
                        continue
                    
                    # Ensure the goal is actionable
                    action_words = ['complete', 'achieve', 'dedicate', 'maintain', 'spend', 'get', 'aim', 'ensure', 'build', 'create', 'learn', 'study', 'exercise', 'save', 'invest']
                    if not any(word in description.lower() for word in action_words):
                        continue
                    
                    validated_goals.append({
                        'title': title,
                        'description': description,
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
        """Fallback method to extract goals using regex patterns - more selective"""
        goals = []
        
        # Look for specific, actionable goal patterns only
        patterns = [
            # Explicit goal statements
            r'(?:goal|target|objective|aim|commitment):\s*([^.\n]{15,})',
            r'(?:I want to|I will|I plan to|I need to|I commit to)\s+([^.\n]{15,})',
            r'(?:achieve|complete|finish|accomplish|maintain|dedicate)\s+([^.\n]{15,})',
            
            # Specific time-based commitments
            r'(?:every day|daily|weekly|monthly)\s+(?:I will|I need to|I plan to)\s+([^.\n]{15,})',
            r'(?:spend|dedicate|allocate)\s+\d+\s+(?:minutes|hours|days)\s+(?:to|on)\s+([^.\n]{15,})',
            
            # Learning and development goals
            r'(?:learn|study|master|practice)\s+([^.\n]{15,})',
            r'(?:complete|finish|pass)\s+(?:course|training|workshop|certification)\s+([^.\n]{15,})',
            
            # Health and fitness goals
            r'(?:exercise|workout|run|walk|train)\s+([^.\n]{15,})',
            r'(?:achieve|maintain|get)\s+\d+\s+(?:hours|minutes)\s+of\s+([^.\n]{15,})',
            
            # Work and career goals
            r'(?:promotion|raise|job|career|project)\s+([^.\n]{15,})',
            r'(?:deliver|complete|finish|present)\s+([^.\n]{15,})',
            
            # Financial goals
            r'(?:save|budget|invest|earn|spend)\s+([^.\n]{15,})',
            r'(?:pay off|reduce|eliminate)\s+([^.\n]{15,})',
            
            # Personal development goals
            r'(?:read|write|create|build|make)\s+([^.\n]{15,})',
            r'(?:visit|explore|discover|experience)\s+([^.\n]{15,})',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                match = match.strip()
                # Additional filtering to ensure quality
                if (len(match) >= 15 and 
                    not any(word in match.lower() for word in ['workday', 'process', 'energy', 'workouts', 'commute', 'session', 'blocks', 'switch', 'cooldown', 'protocol']) and
                    not match.lower().startswith(('workout', 'session', 'block', 'process', 'energy'))):
                    
                    # Determine category based on content
                    category = 'general'
                    if any(word in match.lower() for word in ['work', 'job', 'career', 'office', 'meeting', 'project']):
                        category = 'work'
                    elif any(word in match.lower() for word in ['health', 'exercise', 'workout', 'sleep', 'diet', 'fitness']):
                        category = 'health'
                    elif any(word in match.lower() for word in ['learn', 'study', 'course', 'training', 'education']):
                        category = 'learning'
                    elif any(word in match.lower() for word in ['save', 'budget', 'money', 'financial', 'invest']):
                        category = 'finance'
                    elif any(word in match.lower() for word in ['family', 'wife', 'husband', 'children', 'relationship']):
                        category = 'personal'
                    
                    # Determine priority based on content
                    priority = 'medium'
                    if any(word in match.lower() for word in ['urgent', 'critical', 'important', 'high', 'priority']):
                        priority = 'high'
                    elif any(word in match.lower() for word in ['optional', 'low', 'minor', 'someday']):
                        priority = 'low'
                    
                    goals.append({
                        'title': match[:100],  # Limit title length
                        'description': f"Goal extracted from document: {match}",
                        'target_date': None,
                        'priority': priority,
                        'category': category
                    })
        
        # Remove duplicates and limit results
        unique_goals = []
        seen_titles = set()
        for goal in goals:
            title_lower = goal['title'].lower()
            if title_lower not in seen_titles and len(unique_goals) < 10:  # Limit to 10 goals
                seen_titles.add(title_lower)
                unique_goals.append(goal)
        
        return unique_goals
