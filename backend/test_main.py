import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import date, datetime
import json

from main import app
from database import get_db, Base
from models import Goal, ProgressEntry, DailyProgress

# Create in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    """Setup and teardown database for each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def sample_goal(test_db):
    goal = Goal(
        title="Test Goal",
        description="A test goal for testing",
        priority="medium",
        category="testing"
    )
    test_db.add(goal)
    test_db.commit()
    test_db.refresh(goal)
    return goal

@pytest.fixture
def sample_goals(test_db):
    goals = [
        Goal(
            title="High Priority Goal",
            description="A high priority goal",
            priority="high",
            category="work"
        ),
        Goal(
            title="Low Priority Goal",
            description="A low priority goal",
            priority="low",
            category="personal"
        ),
        Goal(
            title="Medium Priority Goal",
            description="A medium priority goal",
            priority="medium",
            category="health"
        )
    ]
    for goal in goals:
        test_db.add(goal)
    test_db.commit()
    return goals

class TestGoalsAPI:
    def test_get_goals_empty(self, test_db):
        """Test getting goals when none exist"""
        response = client.get("/goals")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_goals_with_data(self, test_db, sample_goals):
        """Test getting goals with data"""
        response = client.get("/goals")
        assert response.status_code == 200
        goals = response.json()
        assert len(goals) == 3
        
        # Check that progress fields are included
        for goal in goals:
            assert "current_progress" in goal
            assert "total_progress_entries" in goal
            assert goal["current_progress"] == 0.0
            assert goal["total_progress_entries"] == 0

    def test_get_goal_by_id(self, test_db, sample_goal):
        """Test getting a specific goal by ID"""
        response = client.get(f"/goals/{sample_goal.id}")
        assert response.status_code == 200
        goal = response.json()
        assert goal["id"] == sample_goal.id
        assert goal["title"] == "Test Goal"
        assert "progress_entries" in goal
        assert "daily_progress" in goal

    def test_get_goal_not_found(self, test_db):
        """Test getting a non-existent goal"""
        response = client.get("/goals/999")
        assert response.status_code == 404

class TestProgressAPI:
    def test_add_progress_entry(self, test_db, sample_goal):
        """Test adding a progress entry"""
        progress_data = {
            "goal_id": sample_goal.id,
            "description": "Made progress",
            "completion_percentage": 25.0,
            "notes": "Good progress today"
        }
        response = client.post("/progress", json=progress_data)
        assert response.status_code == 200
        progress = response.json()
        assert progress["goal_id"] == sample_goal.id
        assert progress["completion_percentage"] == 25.0

    def test_add_daily_progress(self, test_db, sample_goal):
        """Test adding daily progress"""
        progress_data = {
            "goal_id": sample_goal.id,
            "progress_value": 15.5,
            "notes": "Worked on this today"
        }
        response = client.post("/daily-progress", json=progress_data)
        assert response.status_code == 200
        progress = response.json()
        assert progress["goal_id"] == sample_goal.id
        assert progress["progress_value"] == 15.5
        assert progress["date"] == date.today().isoformat()

    def test_add_daily_progress_with_date(self, test_db, sample_goal):
        """Test adding daily progress with specific date"""
        test_date = "2024-01-15"
        progress_data = {
            "goal_id": sample_goal.id,
            "progress_value": 20.0,
            "date": test_date,
            "notes": "Progress on specific date"
        }
        response = client.post("/daily-progress", json=progress_data)
        assert response.status_code == 200
        progress = response.json()
        assert progress["date"] == test_date

    def test_update_existing_daily_progress(self, test_db, sample_goal):
        """Test updating existing daily progress"""
        # Add initial progress
        progress_data = {
            "goal_id": sample_goal.id,
            "progress_value": 10.0,
            "notes": "Initial progress"
        }
        client.post("/daily-progress", json=progress_data)
        
        # Update the same day's progress
        updated_data = {
            "goal_id": sample_goal.id,
            "progress_value": 25.0,
            "notes": "Updated progress"
        }
        response = client.post("/daily-progress", json=updated_data)
        assert response.status_code == 200
        progress = response.json()
        assert progress["progress_value"] == 25.0
        assert progress["notes"] == "Updated progress"

    def test_add_daily_progress_bulk(self, test_db, sample_goals):
        """Test adding daily progress for multiple goals"""
        progress_data = [
            {
                "goal_id": sample_goals[0].id,
                "progress_value": 15.0,
                "notes": "Progress on goal 1"
            },
            {
                "goal_id": sample_goals[1].id,
                "progress_value": 25.0,
                "notes": "Progress on goal 2"
            }
        ]
        response = client.post("/daily-progress-bulk", json=progress_data)
        assert response.status_code == 200
        result = response.json()
        assert "Successfully updated 2 progress entries" in result["message"]

    def test_get_progress_for_goal(self, test_db, sample_goal):
        """Test getting progress entries for a specific goal"""
        # Add some progress first
        progress_data = {
            "goal_id": sample_goal.id,
            "description": "Progress entry",
            "completion_percentage": 30.0
        }
        client.post("/progress", json=progress_data)
        
        response = client.get(f"/progress/{sample_goal.id}")
        assert response.status_code == 200
        progress_entries = response.json()
        assert len(progress_entries) == 1
        assert progress_entries[0]["goal_id"] == sample_goal.id

    def test_get_daily_progress_for_goal(self, test_db, sample_goal):
        """Test getting daily progress for a specific goal"""
        # Add some daily progress first
        progress_data = {
            "goal_id": sample_goal.id,
            "progress_value": 20.0,
            "notes": "Daily progress"
        }
        client.post("/daily-progress", json=progress_data)
        
        response = client.get(f"/daily-progress/{sample_goal.id}")
        assert response.status_code == 200
        daily_progress = response.json()
        assert len(daily_progress) == 1
        assert daily_progress[0]["goal_id"] == sample_goal.id

class TestDailyProgressSummary:
    def test_get_daily_progress_summary(self, test_db, sample_goals):
        """Test getting daily progress summary"""
        # Add progress for today
        today = date.today()
        progress_data = [
            {
                "goal_id": sample_goals[0].id,
                "progress_value": 15.0,
                "notes": "Progress on goal 1"
            },
            {
                "goal_id": sample_goals[1].id,
                "progress_value": 25.0,
                "notes": "Progress on goal 2"
            }
        ]
        client.post("/daily-progress-bulk", json=progress_data)
        
        # Get summary for today
        response = client.get(f"/daily-progress-summary/{today.isoformat()}")
        assert response.status_code == 200
        summary = response.json()
        assert summary["date"] == today.isoformat()
        assert summary["total_progress"] == 40.0
        assert summary["goals_updated"] == 2
        assert len(summary["notes"]) == 2

    def test_get_daily_progress_summary_invalid_date(self, test_db):
        """Test getting daily progress summary with invalid date"""
        response = client.get("/daily-progress-summary/invalid-date")
        assert response.status_code == 400
        assert "Invalid date format" in response.json()["detail"]

class TestProgressCalculation:
    def test_goal_progress_calculation(self, test_db, sample_goal):
        """Test that goal progress is calculated correctly from daily entries"""
        # Add multiple daily progress entries for different dates
        progress_entries = [
            {"progress_value": 10.0, "notes": "Day 1", "date": "2024-01-01"},
            {"progress_value": 15.0, "notes": "Day 2", "date": "2024-01-02"},
            {"progress_value": 25.0, "notes": "Day 3", "date": "2024-01-03"}
        ]
        
        for entry in progress_entries:
            client.post("/daily-progress", json={
                "goal_id": sample_goal.id,
                "progress_value": entry["progress_value"],
                "date": entry["date"],
                "notes": entry["notes"]
            })
        
        # Get the goal and check total progress
        response = client.get(f"/goals/{sample_goal.id}")
        assert response.status_code == 200
        goal = response.json()
        assert goal["current_progress"] == 50.0  # 10 + 15 + 25
        assert goal["total_progress_entries"] == 3

    def test_multiple_goals_progress(self, test_db, sample_goals):
        """Test progress calculation across multiple goals"""
        # Add progress to different goals
        client.post("/daily-progress", json={
            "goal_id": sample_goals[0].id,
            "progress_value": 20.0
        })
        client.post("/daily-progress", json={
            "goal_id": sample_goals[1].id,
            "progress_value": 30.0
        })
        
        # Get all goals and check progress
        response = client.get("/goals")
        assert response.status_code == 200
        goals = response.json()
        
        goal1 = next(g for g in goals if g["id"] == sample_goals[0].id)
        goal2 = next(g for g in goals if g["id"] == sample_goals[1].id)
        goal3 = next(g for g in goals if g["id"] == sample_goals[2].id)
        
        assert goal1["current_progress"] == 20.0
        assert goal2["current_progress"] == 30.0
        assert goal3["current_progress"] == 0.0

class TestErrorHandling:
    def test_add_progress_invalid_goal_id(self, test_db):
        """Test adding progress with invalid goal ID"""
        progress_data = {
            "goal_id": 999,
            "progress_value": 15.0
        }
        response = client.post("/daily-progress", json=progress_data)
        # Should still succeed as we're creating a new entry
        assert response.status_code == 200

    def test_add_progress_invalid_data(self, test_db):
        """Test adding progress with invalid data"""
        progress_data = {
            "goal_id": "invalid",
            "progress_value": "not_a_number"
        }
        response = client.post("/daily-progress", json=progress_data)
        # Pydantic validation returns 422 for invalid data
        assert response.status_code == 422

if __name__ == "__main__":
    pytest.main([__file__])
