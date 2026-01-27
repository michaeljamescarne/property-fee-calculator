# PDF Chart Testing Guide

This document explains how to test PDF generation with charts and debug issues.

## Quick Start

### Browser Console Testing

The PDF testing utilities are automatically loaded in development mode. Open the browser console on a results page with investment analytics and run:

```javascript
// Run full test suite
await window.testPDFGeneration()

// Or test individual functions
window.verifyChartElements()      // Check if chart elements exist
window.checkSectionVisibility()   // Check if sections are visible
await window.testChartCapture()   // Test chart capture only
```

## Testing Workflow

### 1. Verify Chart Elements Exist

Before generating a PDF, ensure chart elements are in the DOM:

```javascript
const elements = window.verifyChartElements();
// Returns: { projection: boolean, cashFlow: boolean, roiComparison: boolean }
```

### 2. Check Section Visibility

Charts are in collapsible sections. Verify they're visible:

```javascript
const visibility = window.checkSectionVisibility();
// Returns: { cashFlow: boolean, projections: boolean, comparison: boolean }
```

### 3. Test Chart Capture

Test if charts can be captured:

```javascript
const result = await window.testChartCapture();
// Returns detailed test results with captured images
```

## Common Issues & Solutions

### Issue: Charts not appearing in PDF

**Symptoms:**
- PDF generates but charts are missing
- Console shows "Chart not provided" warnings

**Diagnosis:**
1. Check if sections are open:
   ```javascript
   window.checkSectionVisibility()
   ```
2. Check if chart elements exist:
   ```javascript
   window.verifyChartElements()
   ```
3. Test chart capture:
   ```javascript
   await window.testChartCapture()
   ```

**Solutions:**

1. **Sections are closed**: Charts are in collapsible sections that may be closed. The PDF generation should automatically open them, but you can manually open sections first:
   - Open "Cash Flow Analysis" section
   - Open "Investment Projections" section  
   - Open "Investment Comparison" section

2. **Charts haven't rendered**: Recharts needs time to render SVG elements. Wait a few seconds after page load or section expansion.

3. **html2canvas issues**: If html2canvas fails to capture, check browser console for errors. Common issues:
   - CORS issues (shouldn't happen with same-origin)
   - SVG not rendering properly
   - Element has zero dimensions

### Issue: Chart images are invalid

**Symptoms:**
- Console shows "Invalid chart image format" warnings
- PDF generation completes but charts are blank

**Diagnosis:**
```javascript
const result = await window.testChartCapture();
console.log(result.charts); // Check if dataUrl is valid
```

**Solutions:**

1. **Empty data URL**: Chart container exists but has no content. Ensure:
   - Recharts has rendered (check for SVG elements)
   - Section is fully expanded and visible
   - Wait longer for rendering (increased from 500ms to 800ms)

2. **Malformed data URL**: html2canvas failed to capture. Check:
   - Element dimensions are non-zero
   - Element is visible in viewport
   - No CSS transforms causing rendering issues

### Issue: Charts appear but are blank/white

**Symptoms:**
- Charts appear in PDF but show blank space
- Image size is correct but content is missing

**Solutions:**

1. **Background color**: Charts might have transparent backgrounds. Try:
   - Setting explicit background color in chart components
   - Using `backgroundColor` option in `captureChartElement`

2. **SVG rendering**: html2canvas may not render SVG properly. Ensure:
   - SVG elements are properly nested
   - No external resources required for rendering
   - Use `foreignObjectRendering: true` in html2canvas options (already set)

## Manual Testing

### Step-by-Step Test Process

1. **Navigate to calculator results page with analytics**
   - Complete calculator with investment inputs
   - Ensure analytics section is visible

2. **Open browser console**
   - Press F12 or Cmd+Option+I

3. **Run test suite**
   ```javascript
   await window.testPDFGeneration()
   ```

4. **Review results**
   - Check which charts were captured
   - Review any errors or warnings
   - Verify chart images are valid

5. **Generate PDF**
   - Click "Download PDF" button
   - Open generated PDF
   - Verify charts appear correctly

## Debugging Tips

### Enable Verbose Logging

Chart capture functions include detailed console logging. Look for:
- `✅ Successfully captured chart` - Chart captured successfully
- `❌ Failed to capture chart` - Chart capture failed
- `⚠️ Chart not provided` - Chart image was null/undefined

### Check Network Tab

When generating PDF, check Network tab for:
- `/api/pdf/generate` request
- Request payload should include `chartImages` object
- Verify `chartImages` contains valid data URLs

### Verify Image Format

Chart images should be base64-encoded PNG data URLs:
```javascript
// Valid format
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

// Invalid formats
null
undefined
""
"data:text/html,..."
```

## Automated Testing

### Add to Test Suite

You can add PDF generation tests to your test suite:

```typescript
import { testPDFGeneration } from '@/lib/pdf/testPDFGeneration';

describe('PDF Generation', () => {
  it('should capture all charts', async () => {
    // Navigate to results page
    // ... setup code ...
    
    const result = await testPDFGeneration();
    
    expect(result.success).toBe(true);
    expect(result.charts.projection.captured).toBe(true);
    expect(result.charts.cashFlow.captured).toBe(true);
  });
});
```

### Integration with Playwright

For E2E testing with Playwright:

```typescript
test('PDF generation includes charts', async ({ page }) => {
  // Navigate to results page
  await page.goto('/calculator');
  // ... complete calculator ...
  
  // Run test utilities
  const result = await page.evaluate(() => {
    return window.testPDFGeneration();
  });
  
  expect(result.success).toBe(true);
});
```

## Performance Considerations

- Chart capture adds ~1-2 seconds to PDF generation
- Charts are captured sequentially to avoid race conditions
- Each chart capture waits 500ms for rendering
- Total capture time: ~2-3 seconds for 3 charts

## Future Improvements

1. **Caching**: Cache chart images if analytics haven't changed
2. **Parallel capture**: After sections are open, capture charts in parallel
3. **Progressive loading**: Show PDF with text first, add charts progressively
4. **Fallback rendering**: If html2canvas fails, use server-side chart generation
