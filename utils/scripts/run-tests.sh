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

# Function to run all tests using unified runner
run_all_tests() {
    print_status "🧪 Running ALL tests using unified test runner..."
    
    # Use the centralized test runner
    if [ -f "tests/run-all-tests.sh" ]; then
        ./tests/run-all-tests.sh
        if [ $? -eq 0 ]; then
            print_success "All tests completed successfully"
        else
            print_error "Tests failed"
            exit 1
        fi
    else
        print_error "Unified test runner not found at tests/run-all-tests.sh"
        exit 1
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
    echo -e "🧩 Component Tests: tests/frontend/"
    echo -e "🔗 Integration Tests: tests/functional/ + tests/regression/"
    echo -e "⚙️ Backend Tests: tests/backend/"
    echo ""
    echo -e "${GREEN}📁 Unified Test Structure:${NC}"
    echo -e "📂 All tests are now centralized in: tests/"
    echo -e "🎯 Frontend: tests/frontend/"
    echo -e "🔧 Backend: tests/backend/"
    echo -e "🔗 Integration: tests/functional/ + tests/regression/"
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
    run_all_tests
    display_test_summary
}

# Run main function
main "$@"
