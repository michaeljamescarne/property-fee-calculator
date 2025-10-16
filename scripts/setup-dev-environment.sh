#!/bin/bash

# Development Environment Setup Script
# Run this to quickly set up your development environment

echo "🚀 Setting up Australian Property Investment Calculator Development Environment..."

# Navigate to project directory
cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please copy from env.example.txt and configure:"
    echo "   cp env.example.txt .env.local"
    echo "   Then edit .env.local with your API keys"
else
    echo "✅ Environment variables configured"
fi

# Start development server
echo "🌐 Starting development server..."
echo "   Production URL: https://aupropertyinvestmentmc.vercel.app"
echo "   Local URL: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

