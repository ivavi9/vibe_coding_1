#!/bin/bash

# Progress Tracker Test Runner

echo "🧪 Running Progress Tracker Tests..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Run tests
echo "🚀 Running tests..."
cd backend
python -m pytest test_main.py -v

echo "✅ Tests completed!"
