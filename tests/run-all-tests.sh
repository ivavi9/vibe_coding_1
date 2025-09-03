#!/bin/bash

# Unified Test Runner for Progress Tracker
# This script runs ALL tests from the centralized tests directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLIENT_DIR="$PROJECT_ROOT/client"
SERVER_DIR="$PROJECT_ROOT/server"

echo -e "${BLUE}🧪 Unified Test Runner Starting...${NC}"
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

# Function to run backend tests
run_backend_tests() {
    print_status "🧪 Running backend tests..."
    
    cd "$SERVER_DIR"
    source venv/bin/activate
    
    # Run unit tests
    print_status "Running backend unit tests..."
    python -m pytest "$PROJECT_ROOT/tests/backend/unit/" -v --tb=short
    if [ $? -eq 0 ]; then
        print_success "Backend unit tests passed"
    else
        print_error "Backend unit tests failed"
        exit 1
    fi
    
    # Run integration tests if they exist
    if [ -d "$PROJECT_ROOT/tests/backend/integration" ] && [ "$(ls -A "$PROJECT_ROOT/tests/backend/integration")" ]; then
        print_status "Running backend integration tests..."
        python -m pytest "$PROJECT_ROOT/tests/backend/integration/" -v --tb=short
        if [ $? -eq 0 ]; then
            print_success "Backend integration tests passed"
        else
            print_error "Backend integration tests failed"
            exit 1
        fi
    fi
    
    cd "$PROJECT_ROOT"
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "🧪 Running frontend tests..."
    
    # Run component tests from client directory
    print_status "Running frontend component tests..."
    cd "$CLIENT_DIR"
    npm test -- --run --silent
    if [ $? -eq 0 ]; then
        print_success "Frontend component tests passed"
    else
        print_error "Frontend component tests failed"
        exit 1
    fi
    cd "$PROJECT_ROOT"
    
    # Run integration tests from client directory
    print_status "Running integration tests..."
    cd "$CLIENT_DIR"
    
    # Run integration tests from the new src/tests location
    if npm test -- --run --silent "src/tests/" 2>/dev/null; then
        print_success "Integration tests passed"
    else
        print_error "Integration tests failed"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# Function to display test summary
display_test_summary() {
    print_success "🎉 All tests completed successfully!"
    echo ""
    echo -e "${GREEN}📊 Test Summary:${NC}"
    echo -e "✅ Backend tests: PASSED"
    echo -e "✅ Frontend component tests: PASSED"
    echo -e "✅ Integration tests: PASSED"
    echo ""
    echo -e "${GREEN}🧪 Test Coverage:${NC}"
echo -e "🧩 Component Tests: client/src/**/__tests__/"
echo -e "🔗 Integration Tests: client/src/tests/"
echo -e "⚙️ Backend Tests: tests/backend/"
    echo ""
    echo -e "${GREEN}📁 Test Structure:${NC}"
echo -e "🎯 Component Tests: client/src/**/__tests__/"
echo -e "🔧 Backend Tests: tests/backend/"
echo -e "🔗 Integration Tests: client/src/tests/"
}

# Main execution
main() {
    print_status "Starting unified test execution..."
    
    run_backend_tests
    run_frontend_tests
    
    display_test_summary
}

# Run main function
main "$@"
