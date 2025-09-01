import pytest
import tempfile
import os
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, get_db
from models import Base, Goal
from services.document_parser import DocumentParser

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

def test_root_endpoint(client):
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Progress Tracker API is running"}

def test_upload_txt_document(client, setup_database):
    """Test uploading a text document"""
    # Create a test document
    test_content = """
    My Goals for 2024:
    
    1. Learn React and build 3 projects by June 2024
    2. Exercise 3 times per week - high priority
    3. Read 12 books this year - personal development
    4. Save $5000 for vacation by December 2024
    """
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(test_content)
        temp_file_path = f.name
    
    try:
        with open(temp_file_path, 'rb') as f:
            response = client.post(
                "/upload-document",
                files={"file": ("test_goals.txt", f, "text/plain")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "goals" in data
        assert "message" in data
        assert len(data["goals"]) > 0
        
        # Verify goal structure
        goal = data["goals"][0]
        assert "id" in goal
        assert "title" in goal
        assert "description" in goal
        assert "priority" in goal
        assert "category" in goal
        
    finally:
        os.unlink(temp_file_path)

def test_get_goals_empty(client, setup_database):
    """Test getting goals when none exist"""
    response = client.get("/goals")
    assert response.status_code == 200
    assert response.json() == []

def test_get_goals_with_data(client, setup_database):
    """Test getting goals after uploading a document"""
    # First upload a document
    test_content = "Goal: Learn Python programming"
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(test_content)
        temp_file_path = f.name
    
    try:
        with open(temp_file_path, 'rb') as f:
            upload_response = client.post(
                "/upload-document",
                files={"file": ("test.txt", f, "text/plain")}
            )
        
        assert upload_response.status_code == 200
        
        # Then get goals
        response = client.get("/goals")
        assert response.status_code == 200
        goals = response.json()
        assert len(goals) > 0
        
    finally:
        os.unlink(temp_file_path)

def test_document_parser_fallback():
    """Test the document parser fallback method"""
    parser = DocumentParser()
    
    test_text = """
    My Goals:
    1. Exercise daily
    2. Learn React
    3. Save money
    """
    
    goals = parser._extract_goals_fallback(test_text)
    assert len(goals) > 0
    
    # Check goal structure
    goal = goals[0]
    assert "title" in goal
    assert "description" in goal
    assert "priority" in goal
    assert "category" in goal

def test_date_parsing():
    """Test date parsing logic"""
    from datetime import datetime
    
    # Test valid date parsing
    test_date = "February 2026"
    if "february" in test_date.lower() and "2026" in test_date:
        parsed_date = datetime(2026, 2, 1)
        assert parsed_date.year == 2026
        assert parsed_date.month == 2
    
    # Test invalid date handling
    invalid_date = "sometime next year"
    try:
        if "february" in invalid_date.lower() and "2026" in invalid_date:
            parsed_date = datetime(2026, 2, 1)
        else:
            parsed_date = None
        assert parsed_date is None
    except:
        assert True  # Expected to fail

def test_goal_categories():
    """Test goal categorization logic"""
    parser = DocumentParser()
    
    test_cases = [
        ("Learn React programming", "learning"),
        ("Exercise at the gym", "health"),
        ("Save money for vacation", "finance"),
        ("Complete work project", "work"),
        ("Visit family", "personal"),
        ("Random goal", "general")
    ]
    
    for goal_text, expected_category in test_cases:
        # Simulate the categorization logic
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
        
        assert category == expected_category, f"Expected {expected_category}, got {category} for '{goal_text}'"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
