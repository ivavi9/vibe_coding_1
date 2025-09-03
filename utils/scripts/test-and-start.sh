#!/bin/bash

# Clarity Test-Driven Development Workflow
# This script runs all tests and then starts development servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
PIDS_DIR="$PROJECT_ROOT/utils/pids"

# Load configuration from our global config
source "$PROJECT_ROOT/load-config.sh" 2>/dev/null || {
    # Fallback configuration if load-config.sh doesn't exist
    BACKEND_PORT=8001
    FRONTEND_PORT=3000
    BACKEND_HOST="127.0.0.1"
    FRONTEND_HOST="localhost"
}

echo -e "${BLUE}🚀 Starting Clarity Development Workflow...${NC}"
echo "=========================================="

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

# Function to validate project structure
validate_project() {
    print_status "📁 Project structure validated"
    
    # Check if we're in the project root
    if [ ! -f "client/package.json" ] || [ ! -f "requirements.txt" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "📦 Installing frontend dependencies..."
    cd client
    npm install --silent
    print_success "Frontend dependencies installed"
    
    print_status "📦 Installing backend dependencies..."
    cd ../server
    source venv/bin/activate
    pip install -r ../requirements.txt --quiet
    print_success "Backend dependencies installed"
    cd ..
}

# Function to run tests
run_tests() {
    print_status "🧪 Running ALL tests using unified test runner..."
    
    # Use the centralized test runner
    if [ -f "tests/run-all-tests.sh" ]; then
        ./tests/run-all-tests.sh
        if [ $? -eq 0 ]; then
            print_success "🎉 All tests passed! Starting development servers..."
        else
            print_error "Tests failed - cannot start servers"
            exit 1
        fi
    else
        print_error "Unified test runner not found at tests/run-all-tests.sh"
        exit 1
    fi
}

# Function to start backend server
start_backend() {
    print_status "🚀 Starting backend server on port $BACKEND_PORT..."
    
    # Create PIDs directory if it doesn't exist
    mkdir -p "$PIDS_DIR"
    
    # Start backend server
    cd server
    source venv/bin/activate
    nohup python -m uvicorn app.main:app --port $BACKEND_PORT --host $BACKEND_HOST > ../utils/pids/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > "$PIDS_DIR/backend.pid"
    cd ..
    
    print_status "⏳ Waiting for backend to be ready..."
    
    # Wait for backend to be ready
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://$BACKEND_HOST:$BACKEND_PORT/health" > /dev/null 2>&1; then
            print_success "Backend server is running and healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Backend server failed to start within timeout"
            exit 1
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
}

# Function to start frontend server
start_frontend() {
    print_status "🚀 Starting frontend server on port $FRONTEND_PORT..."
    
    # Start frontend server
    cd client
    nohup npm run dev > ../utils/pids/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$PIDS_DIR/frontend.pid"
    cd ..
    
    print_status "⏳ Waiting for frontend to be ready..."
    
    # Wait for frontend to be ready
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://$FRONTEND_HOST:$FRONTEND_PORT" > /dev/null 2>&1; then
            print_success "Frontend server is running"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Frontend server failed to start within timeout"
            exit 1
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
}

# Function to display server information
display_server_info() {
    print_success "🎉 Development environment is ready!"
    echo ""
    echo -e "${GREEN}📱 Frontend:${NC} http://$FRONTEND_HOST:$FRONTEND_PORT"
    echo -e "${GREEN}🔧 Backend:${NC} http://$BACKEND_HOST:$BACKEND_PORT"
    echo -e "${GREEN}📚 API Docs:${NC} http://$BACKEND_HOST:$BACKEND_PORT/docs"
    echo ""
    echo -e "${YELLOW}🛑 To stop servers, run:${NC}"
    echo -e "  ${GREEN}./utils/scripts/stop-servers.sh${NC}"
    echo ""
    echo -e "${YELLOW}🧪 To run tests only, run:${NC}"
    echo -e "  ${GREEN}./utils/scripts/run-tests.sh${NC}"
    echo ""
    echo -e "${BLUE}💡 The servers are now running in the background.${NC}"
    echo -e "${BLUE}   You can close this terminal and open a new one for development.${NC}"
    echo -e "${BLUE}   Or keep this terminal open to see server logs.${NC}"
}

# Main execution
main() {
    validate_project
    install_dependencies
    run_tests
    start_backend
    start_frontend
    display_server_info
    
    # Exit successfully - servers are running in background
    print_success "🚀 Servers started successfully! Exiting script..."
    exit 0
}

# Run main function
main "$@"
