#!/bin/bash

# Clarity Development Startup Script
echo "🚀 Starting Clarity Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down development servers..."
    pkill -f "uvicorn app.main:app"
    pkill -f "npm run dev"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the backend server
echo "🔧 Starting Backend Server (FastAPI)..."
cd server
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start the frontend client
echo "🎨 Starting Frontend Client (React)..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
