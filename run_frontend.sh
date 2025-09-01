#!/bin/bash

# Progress Tracker Frontend Startup Script

echo "🚀 Starting Progress Tracker Frontend..."

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start the React development server
echo "🌟 Starting React development server..."
cd frontend
npm start
