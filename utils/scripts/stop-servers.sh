#!/bin/bash

# Stop Clarity Development Servers
# This script stops all running development servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PIDS_DIR="$PROJECT_ROOT/utils/pids"

echo -e "${YELLOW}🛑 Stopping Clarity Development Servers...${NC}"
echo "=========================================="

# Function to stop server by port
stop_server_by_port() {
    local port=$1
    local server_name=$2
    
    echo -e "${YELLOW}Looking for $server_name on port $port...${NC}"
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Found $server_name processes: $pids${NC}"
        
        for pid in $pids; do
            echo -e "${YELLOW}Stopping $server_name (PID: $pid)...${NC}"
            if kill -TERM $pid 2>/dev/null; then
                echo -e "${GREEN}✅ $server_name stopped gracefully${NC}"
            else
                echo -e "${YELLOW}Force killing $server_name (PID: $pid)...${NC}"
                kill -9 $pid 2>/dev/null || true
                echo -e "${GREEN}✅ $server_name force stopped${NC}"
            fi
        done
        
        # Wait a moment for processes to fully stop
        sleep 2
        
        # Verify port is free
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${RED}❌ Port $port is still in use${NC}"
            return 1
        else
            echo -e "${GREEN}✅ Port $port is now free${NC}"
        fi
    else
        echo -e "${GREEN}✅ No $server_name processes found on port $port${NC}"
    fi
}

# Function to remove PID files
cleanup_pid_files() {
    echo -e "${YELLOW}Cleaning up PID files...${NC}"
    
    # Remove backend PID file
    if [ -f "$PIDS_DIR/backend.pid" ]; then
        rm -f "$PIDS_DIR/backend.pid"
        echo -e "${GREEN}✅ Backend PID file removed${NC}"
    fi
    
    # Remove frontend PID file
    if [ -f "$PIDS_DIR/frontend.pid" ]; then
        rm -f "$PIDS_DIR/frontend.pid"
        echo -e "${GREEN}✅ Frontend PID file removed${NC}"
    fi
}

# Stop servers by port
stop_server_by_port 8001 "Backend"
stop_server_by_port 3000 "Frontend"

# Clean up PID files
cleanup_pid_files

echo ""
echo -e "${GREEN}🎉 All development servers stopped successfully!${NC}"
echo ""
echo -e "${YELLOW}To restart servers, run:${NC}"
echo -e "  ${GREEN}./utils/scripts/test-and-start.sh${NC}"
echo ""
echo -e "${YELLOW}To run tests only, run:${NC}"
echo -e "  ${GREEN}./utils/scripts/run-tests.sh${NC}"
