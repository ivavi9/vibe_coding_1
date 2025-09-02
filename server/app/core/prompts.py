"""
Prompt management for Clarity API.
Contains all AI prompts used for goal extraction and analysis.
Analysts can easily modify these prompts without touching the main code.
"""

# Goal Extraction Prompt for Gemini API
GOAL_EXTRACTION_PROMPT = """
You are an AI assistant that extracts actionable goals from text content. 
Analyze the following text and identify specific, measurable goals that someone could track and achieve.

TEXT TO ANALYZE:
{text}

INSTRUCTIONS:
1. Identify 3-5 specific, actionable goals from the text
2. Each goal should be clear, measurable, and achievable
3. Focus on goals related to training, fitness, learning, or personal development
4. For each goal, provide:
   - A clear, concise title
   - A detailed description
   - The metric type (Numeric, Boolean, or Percentage)
   - A target value or completion criteria

RESPONSE FORMAT:
Return a JSON array of goals with this exact structure:
[
    {{
        "title": "Goal Title",
        "description": "Detailed description of what needs to be achieved",
        "metric_type": "Numeric|Boolean|Percentage",
        "target_progress": <target_value>
    }}
]

EXAMPLES:
- For marathon training: {{"title": "Complete 6-Month Training Program", "description": "Follow the complete training schedule from start to finish", "metric_type": "Boolean", "target_progress": 1}}
- For fitness: {{"title": "Build Running Endurance", "description": "Gradually increase running distance and stamina", "metric_type": "Numeric", "target_progress": 26.2}}
- For learning: {{"title": "Master Training Techniques", "description": "Learn and practice proper running form and training methods", "metric_type": "Percentage", "target_progress": 100}}

IMPORTANT: Return ONLY the JSON array, no additional text or explanations.
"""

# Progress Analysis Prompt (for future use)
PROGRESS_ANALYSIS_PROMPT = """
You are an AI assistant that analyzes progress updates and provides insights.
Analyze the following progress update and provide actionable feedback.

PROGRESS UPDATE:
{progress_text}

GOAL CONTEXT:
{goal_context}

INSTRUCTIONS:
1. Analyze if the progress aligns with the goal
2. Provide encouragement and motivation
3. Suggest next steps or adjustments if needed
4. Keep the response positive and actionable

RESPONSE FORMAT:
Return a JSON object with this structure:
{{
    "analysis": "Brief analysis of the progress",
    "feedback": "Encouraging feedback for the user",
    "next_steps": "Suggested next steps or adjustments",
    "motivation_score": <score from 1-10>
}}
"""

# Goal Refinement Prompt (for future use)
GOAL_REFINEMENT_PROMPT = """
You are an AI assistant that helps refine and improve goal definitions.
Analyze the following goal and suggest improvements to make it more specific and achievable.

ORIGINAL GOAL:
{goal_text}

INSTRUCTIONS:
1. Identify areas where the goal could be more specific
2. Suggest measurable metrics if missing
3. Break down complex goals into smaller sub-goals
4. Ensure the goal follows SMART principles (Specific, Measurable, Achievable, Relevant, Time-bound)

RESPONSE FORMAT:
Return a JSON object with this structure:
{{
    "refined_goal": "Improved goal definition",
    "suggested_metrics": ["metric1", "metric2"],
    "sub_goals": ["sub-goal1", "sub-goal2"],
    "smart_analysis": "Analysis of how well the goal follows SMART principles"
}}
"""

# Document Analysis Prompt (for future use)
DOCUMENT_ANALYSIS_PROMPT = """
You are an AI assistant that analyzes documents to extract key insights and action items.
Analyze the following document content and provide a structured summary.

DOCUMENT CONTENT:
{document_text}

INSTRUCTIONS:
1. Identify the main themes and topics
2. Extract key action items and deadlines
3. Identify potential challenges or obstacles
4. Provide a structured summary with priorities

RESPONSE FORMAT:
Return a JSON object with this structure:
{{
    "main_themes": ["theme1", "theme2"],
    "action_items": ["action1", "action2"],
    "deadlines": ["deadline1", "deadline2"],
    "challenges": ["challenge1", "challenge2"],
    "priority_level": "high|medium|low"
}}
"""
