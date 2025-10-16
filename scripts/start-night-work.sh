#!/bin/bash

# Master Script for Night Work Sessions
# This script sets up everything you need for a productive coding session

echo "🌙 Starting Night Work Session - Australian Property Investment Calculator"
echo "=================================================================="
echo ""

# Change to project directory
cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator

echo "📁 Current directory: $(pwd)"
echo ""

# Run health check
echo "🏥 Running health check..."
node scripts/automated-health-check.js
echo ""

# Show current git status
echo "📋 Git Status:"
git status --short
echo ""

# Show available tasks
echo "📋 Available Tasks (from TODO list):"
echo "1. Production verification"
echo "2. Enhanced PDF reports (12 hours)"
echo "3. Complete translations (8 hours)"
echo "4. Mobile optimization (4 hours)"
echo "5. Performance tuning"
echo "6. SEO optimization"
echo "7. User accounts system"
echo "8. Blog content system"
echo "9. Email capture system"
echo "10. Multi-property comparison"
echo ""

# Show quick commands
echo "🚀 Quick Commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run lint         - Check code quality"
echo "  ./scripts/quick-test.sh - Run quick tests"
echo ""

# Show production URL
echo "🌐 Production URL: https://aupropertyinvestmentmc.vercel.app"
echo ""

# Ask what to work on
echo "What would you like to work on tonight?"
echo ""
echo "Options:"
echo "A) Polish & Optimize (PDF, translations, mobile)"
echo "B) New Features (user accounts, blog, email capture)"
echo "C) Growth & Marketing (SEO, analytics)"
echo "D) Quick fixes and improvements"
echo "E) Test and verify current features"
echo ""

read -p "Choose option (A/B/C/D/E): " choice

case $choice in
    A|a)
        echo "🎯 Starting Polish & Optimize session..."
        echo "Focus areas: Enhanced PDF, translations, mobile optimization"
        echo ""
        echo "Recommended order:"
        echo "1. Enhanced PDF reports (biggest impact)"
        echo "2. Complete Chinese translations"
        echo "3. Mobile testing and optimization"
        ;;
    B|b)
        echo "🚀 Starting New Features session..."
        echo "Focus areas: User accounts, blog system, email capture"
        echo ""
        echo "Recommended order:"
        echo "1. User authentication system"
        echo "2. Save calculations feature"
        echo "3. Blog/content management"
        ;;
    C|c)
        echo "📈 Starting Growth & Marketing session..."
        echo "Focus areas: SEO optimization, analytics, user acquisition"
        echo ""
        echo "Recommended order:"
        echo "1. SEO optimization (Google Search Console)"
        echo "2. Analytics tracking improvements"
        echo "3. Email capture and nurture"
        ;;
    D|d)
        echo "🔧 Starting Quick Fixes session..."
        echo "Focus areas: Bug fixes, performance, UX improvements"
        echo ""
        echo "Recommended order:"
        echo "1. Run comprehensive testing"
        echo "2. Fix any bugs found"
        echo "3. Performance optimizations"
        ;;
    E|e)
        echo "🧪 Starting Testing & Verification session..."
        echo "Focus areas: Comprehensive testing, documentation"
        echo ""
        echo "Starting comprehensive tests..."
        ./scripts/quick-test.sh
        ;;
    *)
        echo "❓ No specific option chosen. Starting general development mode..."
        ;;
esac

echo ""
echo "🎯 Session Goals:"
echo "- Make measurable progress on chosen focus area"
echo "- Test all changes thoroughly"
echo "- Document any issues or next steps"
echo "- Update task status before ending"
echo ""

echo "📚 Useful Resources:"
echo "- Night work plan: scripts/night-work-plan.md"
echo "- Deployment checklist: scripts/deploy-checklist.md"
echo "- Project documentation: docs/"
echo ""

echo "✨ Happy coding! Remember to take breaks and stay hydrated."
echo ""

# Start development server if not already running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "🌐 Development server not running. Starting now..."
    echo "   Local URL: http://localhost:3000"
    echo "   Press Ctrl+C to stop when done"
    echo ""
    npm run dev
else
    echo "✅ Development server already running at http://localhost:3000"
fi

