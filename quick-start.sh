#!/bin/bash

# Quick Start Script for Google Meet Tone Monitor
# This script helps you set up and run the application

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     Google Meet Tone Monitor - Quick Start Script        ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
echo "📋 Checking prerequisites..."
echo ""

if command_exists node; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"

    # Check if version is 18+
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo "⚠️  Warning: Node.js version should be 18 or higher"
        echo "   Current version: $NODE_VERSION"
        echo "   Download from: https://nodejs.org/"
    fi
else
    echo "❌ Node.js not found!"
    echo "   Please install Node.js from: https://nodejs.org/"
    echo "   Then run this script again."
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: v$NPM_VERSION"
else
    echo "❌ npm not found!"
    exit 1
fi

# Check git
if command_exists git; then
    GIT_VERSION=$(git --version)
    echo "✅ $GIT_VERSION"
else
    echo "❌ git not found!"
    echo "   Please install git from: https://git-scm.com/"
    exit 1
fi

echo ""
echo "✅ All prerequisites met!"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Make sure you're in the project directory"
    echo "   Run: cd Romitkumarnath"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "   This may take 2-3 minutes (downloading Chrome)..."
    echo ""
    npm install
    echo ""
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎯 Configuration:"
if [ -f ".env" ]; then
    echo "✅ .env file found"
    MEET_URL=$(grep MEET_URL .env | cut -d'=' -f2)
    echo "   Meeting URL: $MEET_URL"
else
    echo "⚠️  .env file not found, using default from .env.example"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎮 Choose what to do:"
echo ""
echo "  1) Run demo mode (simulated meeting)"
echo "  2) Join real meeting (opens browser)"
echo "  3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🎬 Running demo mode..."
        echo ""
        npm run demo
        ;;
    2)
        echo ""
        echo "🚀 Starting Google Meet monitor..."
        echo ""
        echo "📝 Instructions:"
        echo "   1. Browser will open automatically"
        echo "   2. Meeting will join: https://meet.google.com/ybt-yxvu-ged"
        echo "   3. Press 'C' key to enable captions (REQUIRED!)"
        echo "   4. Speak test phrases to trigger alerts"
        echo "   5. Press Ctrl+C to stop monitoring"
        echo ""
        read -p "Press Enter to continue..."
        echo ""
        npm start
        ;;
    3)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
