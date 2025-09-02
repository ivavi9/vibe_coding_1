#!/bin/bash

echo "🔍 Checking Clarity Development Environment Status..."
echo ""

# Check Backend Server
echo "🔧 Backend Server (FastAPI):"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Running on http://localhost:8000"
    echo "   📚 API Docs: http://localhost:8000/docs"
    
    # Test API endpoint
    if curl -s http://localhost:8000/api/v1/goals > /dev/null 2>&1; then
        echo "   ✅ API endpoints responding"
    else
        echo "   ❌ API endpoints not responding"
    fi
else
    echo "   ❌ Not running"
fi

echo ""

# Check Frontend Client
echo "🎨 Frontend Client (React):"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Running on http://localhost:3000"
else
    echo "   ❌ Not running"
fi

echo ""

# Check if processes are running
echo "📊 Process Status:"
BACKEND_PROCESSES=$(ps aux | grep "uvicorn app.main:app" | grep -v grep | wc -l)
FRONTEND_PROCESSES=$(ps aux | grep "npm run dev" | grep -v grep | wc -l)

echo "   Backend processes: $BACKEND_PROCESSES"
echo "   Frontend processes: $FRONTEND_PROCESSES"

echo ""
echo "💡 To start the development environment, run: ./start-dev.sh"
