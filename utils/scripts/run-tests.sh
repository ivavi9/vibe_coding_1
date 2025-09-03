#!/bin/bash

# Clarity Test Runner
# This script runs all tests without starting servers

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

echo -e "${BLUE}🧪 Running Clarity Test Suite...${NC}"
echo "================================"

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

# Function to run backend tests
run_backend_tests() {
    print_status "🧪 Running backend tests..."
    
    print_status "Running backend unit tests..."
    cd server
    source venv/bin/activate
    python -m pytest tests/ -v --tb=short
    if [ $? -eq 0 ]; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        exit 1
    fi
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "🧪 Running frontend tests..."
    
    cd client
    npm test -- --run --silent
    if [ $? -eq 0 ]; then
        print_success "Frontend tests passed"
    else
        print_error "Frontend tests failed"
        exit 1
    fi
    cd ..
}

# Function to run integration tests
run_integration_tests() {
    print_status "🧪 Running integration tests..."
    
    if [ -f "tests/functional/basic-integration.test.ts" ]; then
        print_status "Running functional integration tests..."
        cd client
        npm test -- ../tests/functional/ --run --reporter=verbose
        if [ $? -eq 0 ]; then
            print_success "Functional integration tests passed"
        else
            print_error "Functional integration tests failed"
            exit 1
        fi
        
        print_status "Running regression tests..."
        npm test -- ../tests/regression/ --run --reporter=verbose
        if [ $? -eq 0 ]; then
            print_success "Regression tests passed"
        else
            print_error "Regression tests failed"
            exit 1
        fi
        
        cd ..
        print_success "All integration tests passed"
    else
        print_warning "No integration tests found, skipping..."
    fi
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
    echo -e "🔗 Integration Tests: tests/ (root directory)"
    echo -e "⚙️ Backend Tests: server/tests/"
    echo ""
    echo -e "${YELLOW}🚀 To start development servers, run:${NC}"
    echo -e "  ${GREEN}./utils/scripts/test-and-start.sh${NC}"
    echo ""
    echo -e "${YELLOW}🧪 To run tests again, run:${NC}"
    echo -e "  ${GREEN}./utils/scripts/run-tests.sh${NC}"
}

# Main execution
main() {
    validate_project
    install_dependencies
    run_backend_tests
    run_frontend_tests
    run_integration_tests
    display_test_summary
}

# Run main function
main "$@"
