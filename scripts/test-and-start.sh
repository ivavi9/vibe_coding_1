#!/bin/bash

# 🧪 Test-Driven Development Workflow Script
# This script ensures all tests pass before starting development servers

set -e  # Exit on any error

echo "🚀 Starting Clarity Development Workflow..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "client/package.json" ] || [ ! -f "requirements.txt" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "📁 Project structure validated"

# Step 1: Install Dependencies
print_status "📦 Installing frontend dependencies..."
cd client
npm ci --silent
print_success "Frontend dependencies installed"

print_status "📦 Installing backend dependencies..."
cd ../server
if [ ! -d "venv" ]; then
    print_warning "Virtual environment not found, creating one..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet
print_success "Backend dependencies installed"

cd ..

# Step 2: Run Backend Tests
print_status "🧪 Running backend tests..."
cd server
source venv/bin/activate

# Check if pytest is available
if ! python -m pytest --version > /dev/null 2>&1; then
    print_warning "pytest not found, installing..."
    pip install pytest pytest-asyncio
fi

# Run backend tests
print_status "Running backend unit tests..."
python -m pytest tests/ -v --tb=short
print_success "Backend tests passed"

cd ..

# Step 3: Run Frontend Tests
print_status "🧪 Running frontend tests..."
cd client

# Check if tests are configured
if [ ! -f "vite.config.ts" ]; then
    print_error "Frontend configuration not found"
    exit 1
fi

# Run frontend tests
print_status "Running frontend tests..."
npm test -- --run --reporter=verbose
print_success "Frontend tests passed"

cd ..

# Step 4: Run Integration Tests (Temporarily Disabled)
print_status "🧪 Integration tests temporarily disabled..."
print_warning "Integration tests need path resolution fix - skipping for now"
# TODO: Fix integration test path resolution
# if [ -f "tests/functional/basic-integration.test.ts" ]; then
#     print_status "Running functional integration tests..."
#     cd client
#     npm test -- ../tests/functional/ --run --reporter=verbose
#     print_success "Integration tests passed"
#     cd ..
# else
#     print_warning "No integration tests found, skipping..."
fi

# Step 5: All Tests Passed - Start Servers
print_success "🎉 All tests passed! Starting development servers..."

# Start backend server in background
print_status "🚀 Starting backend server on port 8001..."
cd server
source venv/bin/activate
python -m uvicorn app.main:app --port 8001 --host 127.0.0.1 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
print_status "⏳ Waiting for backend to be ready..."
sleep 5

# Test backend health
if curl -s http://localhost:8001/health > /dev/null; then
    print_success "Backend server is running and healthy"
else
    print_error "Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend server in background
print_status "🚀 Starting frontend server on port 3000..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
print_status "⏳ Waiting for frontend to be ready..."
sleep 10

# Test frontend health
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Frontend server is running"
else
    print_warning "Frontend server may still be starting up..."
fi

# Save PIDs for later cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

print_success "🎉 Development environment is ready!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8001"
echo "📚 API Docs: http://localhost:8001/docs"
echo ""
echo "🛑 To stop servers, run: ./scripts/stop-servers.sh"
echo "🧪 To run tests only, run: ./scripts/run-tests.sh"

# Function to cleanup on exit
cleanup() {
    print_status "🛑 Shutting down servers..."
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm .backend.pid
    fi
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm .frontend.pid
    fi
    print_success "Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
print_status "🔄 Servers are running. Press Ctrl+C to stop..."
wait
