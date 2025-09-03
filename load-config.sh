#!/bin/bash

# Clarity Configuration Loader
# This script loads configuration from our global config files

# Default configuration
export BACKEND_PORT=${BACKEND_PORT:-8001}
export FRONTEND_PORT=${FRONTEND_PORT:-3000}
export BACKEND_HOST=${BACKEND_HOST:-"127.0.0.1"}
export FRONTEND_HOST=${FRONTEND_HOST:-"localhost"}

# Try to load from environment-specific config
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Try to load from server config
if [ -f "server/app/core/constants.py" ]; then
    # Extract port from Python constants (basic parsing)
    PYTHON_PORT=$(grep -E "PORT.*=.*[0-9]+" server/app/core/constants.py | head -1 | grep -o '[0-9]\+' | head -1)
    if [ ! -z "$PYTHON_PORT" ]; then
        export BACKEND_PORT=$PYTHON_PORT
    fi
fi

# Try to load from client config
if [ -f "client/src/config/constants.ts" ]; then
    # Extract API URL from TypeScript constants (basic parsing)
    TS_API_URL=$(grep -E "BASE_URL.*localhost:[0-9]+" client/src/config/constants.ts | head -1 | grep -o 'localhost:[0-9]\+' | head -1)
    if [ ! -z "$TS_API_URL" ]; then
        TS_PORT=$(echo $TS_API_URL | cut -d: -f2)
        if [ ! -z "$TS_PORT" ]; then
            export BACKEND_PORT=$TS_PORT
        fi
    fi
fi

echo "Configuration loaded:"
echo "  Backend: $BACKEND_HOST:$BACKEND_PORT"
echo "  Frontend: $FRONTEND_HOST:$FRONTEND_PORT"
