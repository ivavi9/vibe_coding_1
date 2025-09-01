from typing import List, Dict
from datetime import datetime, timedelta
from models import Goal, ProgressEntry

class ProgressTracker:
    def __init__(self):
        pass
    
    def generate_analytics(self, goal: Goal, progress_entries: List[ProgressEntry]) -> Dict:
        """Generate comprehensive analytics for a goal"""
        if not progress_entries:
            return {
                "goal_id": goal.id,
                "current_progress": 0.0,
                "progress_trend": [],
                "milestones": [],
                "estimated_completion": None,
                "insights": ["No progress data available yet."]
            }
        
        # Calculate current progress
        current_progress = progress_entries[-1].completion_percentage if progress_entries else 0.0
        
        # Generate progress trend data
        progress_trend = self._calculate_progress_trend(progress_entries)
        
        # Generate milestones
        milestones = self._generate_milestones(goal, progress_entries)
        
        # Estimate completion date
        estimated_completion = self._estimate_completion_date(goal, progress_entries)
        
        # Generate insights
        insights = self._generate_insights(goal, progress_entries, current_progress)
        
        return {
            "goal_id": goal.id,
            "current_progress": current_progress,
            "progress_trend": progress_trend,
            "milestones": milestones,
            "estimated_completion": estimated_completion,
            "insights": insights
        }
    
    def _calculate_progress_trend(self, progress_entries: List[ProgressEntry]) -> List[Dict]:
        """Calculate progress trend over time"""
        trend_data = []
        
        for entry in progress_entries:
            trend_data.append({
                "date": entry.created_at.isoformat(),
                "progress": entry.completion_percentage,
                "description": entry.description
            })
        
        return trend_data
    
    def _generate_milestones(self, goal: Goal, progress_entries: List[ProgressEntry]) -> List[Dict]:
        """Generate milestone markers for the goal"""
        milestones = []
        
        # Define milestone percentages
        milestone_percentages = [25, 50, 75, 90, 100]
        
        for percentage in milestone_percentages:
            # Find the first progress entry that reached this milestone
            milestone_entry = None
            for entry in progress_entries:
                if entry.completion_percentage >= percentage:
                    milestone_entry = entry
                    break
            
            milestone = {
                "percentage": percentage,
                "label": f"{percentage}% Complete",
                "achieved": milestone_entry is not None,
                "achieved_date": milestone_entry.created_at.isoformat() if milestone_entry else None,
                "description": milestone_entry.description if milestone_entry else None
            }
            milestones.append(milestone)
        
        return milestones
    
    def _estimate_completion_date(self, goal: Goal, progress_entries: List[ProgressEntry]) -> str:
        """Estimate completion date based on progress trend"""
        if len(progress_entries) < 2:
            return None
        
        # Calculate average progress rate
        progress_data = [(entry.created_at, entry.completion_percentage) for entry in progress_entries]
        progress_data.sort(key=lambda x: x[0])
        
        # Calculate daily progress rate
        total_days = (progress_data[-1][0] - progress_data[0][0]).days
        total_progress = progress_data[-1][1] - progress_data[0][1]
        
        if total_days > 0 and total_progress > 0:
            daily_rate = total_progress / total_days
            remaining_progress = 100 - progress_data[-1][1]
            
            if daily_rate > 0:
                days_to_completion = remaining_progress / daily_rate
                estimated_date = progress_data[-1][0] + timedelta(days=days_to_completion)
                return estimated_date.isoformat()
        
        return None
    
    def _generate_insights(self, goal: Goal, progress_entries: List[ProgressEntry], current_progress: float) -> List[str]:
        """Generate actionable insights based on progress data"""
        insights = []
        
        if not progress_entries:
            insights.append("Start tracking your progress to get personalized insights!")
            return insights
        
        # Progress rate insights
        if len(progress_entries) >= 2:
            recent_progress = progress_entries[-1].completion_percentage
            previous_progress = progress_entries[-2].completion_percentage
            progress_change = recent_progress - previous_progress
            
            if progress_change > 0:
                insights.append(f"Great progress! You've improved by {progress_change:.1f}% since your last update.")
            elif progress_change == 0:
                insights.append("Your progress has been steady. Consider setting smaller milestones to maintain momentum.")
            else:
                insights.append("Progress has decreased. Review your approach and consider adjusting your strategy.")
        
        # Completion insights
        if current_progress >= 100:
            insights.append("🎉 Congratulations! You've completed this goal!")
        elif current_progress >= 75:
            insights.append("You're in the final stretch! Keep up the momentum to reach 100%.")
        elif current_progress >= 50:
            insights.append("You're halfway there! This is a great milestone to celebrate.")
        elif current_progress >= 25:
            insights.append("Good start! You've made solid initial progress.")
        else:
            insights.append("Every journey begins with a single step. Keep building momentum!")
        
        # Time-based insights
        if goal.target_date:
            days_remaining = (goal.target_date - datetime.now()).days
            if days_remaining > 0:
                required_daily_progress = (100 - current_progress) / days_remaining
                if required_daily_progress > 2:
                    insights.append(f"To meet your target date, you'll need to make {required_daily_progress:.1f}% progress daily.")
                elif required_daily_progress > 0:
                    insights.append("You're on track to meet your target date!")
            else:
                insights.append("Your target date has passed. Consider setting a new realistic deadline.")
        
        return insights
