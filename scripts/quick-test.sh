#!/bin/bash

# Quick Testing Script
# Run this to test key functionality

echo "🧪 Running Quick Tests for Australian Property Investment Calculator..."

cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator

echo ""
echo "📋 Test Checklist:"
echo ""

# Check if development server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running on http://localhost:3000"
else
    echo "❌ Development server not running. Start with: npm run dev"
fi

echo ""
echo "🔍 Manual Testing Steps:"
echo "1. Visit: http://localhost:3000/en/firb-calculator"
echo "2. Complete a calculation with sample data:"
echo "   - Property Value: $1,500,000"
echo "   - Purchase Price: $1,500,000"
echo "   - Address: Sydney NSW 2000"
echo "3. Click 'Show Investment Analysis'"
echo "4. Verify all charts and metrics display"
echo "5. Test PDF download"
echo "6. Test email functionality"
echo "7. Test mobile responsiveness"
echo ""

echo "📱 Mobile Testing:"
echo "- Open Chrome DevTools (F12)"
echo "- Toggle device toolbar (Ctrl+Shift+M)"
echo "- Test on iPhone/Android viewports"
echo ""

echo "🌐 Production Testing:"
echo "Visit: https://aupropertyinvestmentmc.vercel.app/en/firb-calculator"
echo ""

echo "📊 Performance Testing:"
echo "Run Lighthouse audit in Chrome DevTools"
echo "Target scores:"
echo "- Performance: 90+"
echo "- Accessibility: 95+"
echo "- Best Practices: 95+"
echo "- SEO: 95+"










