#!/bin/bash

# MyShop App - Local Development Server Launcher
# This script starts the Expo web development server

PROJECT_DIR="/Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp"
PORT=${1:-8081}

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           MyShop React Native - Local Development Server        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Project: $PROJECT_DIR"
echo "🌐 Port: $PORT"
echo ""

# Navigate to project
cd "$PROJECT_DIR" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed!"
    echo ""
fi

# Start the server
echo "🚀 Starting Expo web development server..."
echo ""
echo "Once started, open your browser to:"
echo "   http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# Run expo start with web platform
npx expo start --web --port $PORT --localhost

echo ""
echo "❌ Server stopped."

