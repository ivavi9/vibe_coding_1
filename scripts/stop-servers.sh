#!/bin/bash

# 🛑 Server Stop Script
# This script stops all running development servers

echo "🛑 Stopping Clarity Development Servers..."
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

# Stop backend server
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    print_status "Stopping backend server (PID: $BACKEND_PID)..."
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        sleep 2
        
        # Force kill if still running
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_warning "Backend server still running, force killing..."
            kill -9 $BACKEND_PID
        fi
        
        print_success "Backend server stopped"
    else
        print_warning "Backend server already stopped"
    fi
    
    rm .backend.pid
else
    print_warning "No backend PID file found"
fi

# Stop frontend server
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    print_status "Stopping frontend server (PID: $FRONTEND_PID)..."
    
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        sleep 2
        
        # Force kill if still running
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_warning "Frontend server still running, force killing..."
            kill -9 $FRONTEND_PID
        fi
        
        print_success "Frontend server stopped"
    else
        print_warning "Frontend server already stopped"
    fi
    
    rm .frontend.pid
else
    print_warning "No frontend PID file found"
fi

# Kill any remaining processes on our ports
print_status "Checking for remaining processes on ports 8001 and 3000..."

# Kill processes on port 8001 (backend)
BACKEND_PROCESSES=$(lsof -ti:8001 2>/dev/null || true)
if [ ! -z "$BACKEND_PROCESSES" ]; then
    print_warning "Found processes on port 8001, killing them..."
    echo $BACKEND_PROCESSES | xargs kill -9
    print_success "Port 8001 cleared"
fi

# Kill processes on port 3000 (frontend)
FRONTEND_PROCESSES=$(lsof -ti:3000 2>/dev/null || true)
if [ ! -z "$FRONTEND_PROCESSES" ]; then
    print_warning "Found processes on port 3000, killing them..."
    echo $FRONTEND_PROCESSES | xargs kill -9
    print_success "Port 3000 cleared"
fi

print_success "🎉 All servers stopped successfully!"
echo ""
echo "🧪 To run tests, run: ./scripts/run-tests.sh"
echo "🚀 To start servers, run: ./scripts/test-and-start.sh"
