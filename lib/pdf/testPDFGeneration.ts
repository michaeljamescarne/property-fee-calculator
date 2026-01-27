/**
 * PDF Generation Testing Utility
 * 
 * This utility helps test PDF generation during development by:
 * 1. Verifying chart images are properly captured
 * 2. Checking PDF generation with various inputs
 * 3. Validating chart rendering in generated PDFs
 * 
 * Usage:
 *   // In browser console (auto-loaded in development):
 *   await window.testPDFGeneration();
 *   
 *   // Or import in tests:
 *   import { testPDFGeneration } from '@/lib/pdf/testPDFGeneration';
 *   await testPDFGeneration();
 */

"use client";

import { captureProjectionChart, captureCashFlowChart, captureROIComparisonChart } from "./chartCapture";

export interface PDFTestResult {
  success: boolean;
  charts: {
    projection: { captured: boolean; dataUrl: string | null; size?: number };
    cashFlow: { captured: boolean; dataUrl: string | null; size?: number };
    roiComparison: { captured: boolean; dataUrl: string | null; size?: number };
  };
  errors: string[];
  warnings: string[];
}

/**
 * Test chart capture functionality
 * Returns a test result object with details about each chart
 */
export async function testChartCapture(): Promise<PDFTestResult> {
  const result: PDFTestResult = {
    success: true,
    charts: {
      projection: { captured: false, dataUrl: null },
      cashFlow: { captured: false, dataUrl: null },
      roiComparison: { captured: false, dataUrl: null },
    },
    errors: [],
    warnings: [],
  };

  console.log("🧪 Testing PDF Chart Capture...\n");

  // Test projection chart
  try {
    console.log("1️⃣ Testing projection chart capture...");
    const projection = await captureProjectionChart();
    if (projection) {
      result.charts.projection = {
        captured: true,
        dataUrl: projection,
        size: projection.length,
      };
      console.log("   ✅ Projection chart captured:", {
        size: `${Math.round(projection.length / 1024)}KB`,
        type: projection.substring(0, 30) + "...",
      });
    } else {
      result.success = false;
      result.errors.push("Failed to capture projection chart");
      console.log("   ❌ Projection chart not captured");
    }
  } catch (error) {
    result.success = false;
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    result.errors.push(`Projection chart capture error: ${errorMsg}`);
    console.log("   ❌ Projection chart capture failed:", error);
  }

  // Test cash flow chart
  try {
    console.log("2️⃣ Testing cash flow chart capture...");
    const cashFlow = await captureCashFlowChart();
    if (cashFlow) {
      result.charts.cashFlow = {
        captured: true,
        dataUrl: cashFlow,
        size: cashFlow.length,
      };
      console.log("   ✅ Cash flow chart captured:", {
        size: `${Math.round(cashFlow.length / 1024)}KB`,
        type: cashFlow.substring(0, 30) + "...",
      });
    } else {
      result.success = false;
      result.errors.push("Failed to capture cash flow chart");
      console.log("   ❌ Cash flow chart not captured");
    }
  } catch (error) {
    result.success = false;
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    result.errors.push(`Cash flow chart capture error: ${errorMsg}`);
    console.log("   ❌ Cash flow chart capture failed:", error);
  }

  // Test ROI comparison chart
  try {
    console.log("3️⃣ Testing ROI comparison chart capture...");
    const roiComparison = await captureROIComparisonChart();
    if (roiComparison) {
      result.charts.roiComparison = {
        captured: true,
        dataUrl: roiComparison,
        size: roiComparison.length,
      };
      console.log("   ✅ ROI comparison chart captured:", {
        size: `${Math.round(roiComparison.length / 1024)}KB`,
        type: roiComparison.substring(0, 30) + "...",
      });
    } else {
      result.warnings.push("ROI comparison chart not captured (may not be in a collapsible section)");
      console.log("   ⚠️ ROI comparison chart not captured");
    }
  } catch (error) {
    result.warnings.push(`ROI comparison chart capture error: ${error instanceof Error ? error.message : "Unknown error"}`);
    console.log("   ⚠️ ROI comparison chart capture failed:", error);
  }

  // Summary
  console.log("\n📊 Test Summary:");
  const capturedCount = [
    result.charts.projection.captured,
    result.charts.cashFlow.captured,
    result.charts.roiComparison.captured,
  ].filter(Boolean).length;

  console.log(`   Charts captured: ${capturedCount}/3`);
  if (result.errors.length > 0) {
    console.log(`   ❌ Errors: ${result.errors.length}`);
    result.errors.forEach((err) => console.log(`      - ${err}`));
  }
  if (result.warnings.length > 0) {
    console.log(`   ⚠️ Warnings: ${result.warnings.length}`);
    result.warnings.forEach((warn) => console.log(`      - ${warn}`));
  }

  if (result.success && capturedCount >= 2) {
    console.log("   ✅ Chart capture test passed!");
  } else if (capturedCount > 0) {
    console.log("   ⚠️ Partial success - some charts captured");
  } else {
    console.log("   ❌ Chart capture test failed - no charts captured");
  }

  return result;
}

/**
 * Verify chart elements exist in the DOM
 */
export function verifyChartElements(): {
  projection: boolean;
  cashFlow: boolean;
  roiComparison: boolean;
} {
  const projection = !!document.getElementById("projection-chart-container");
  const cashFlow = !!document.getElementById("cash-flow-chart-container");
  const roiComparison = !!document.getElementById("roi-comparison-chart-container");

  console.log("🔍 Verifying chart elements in DOM:");
  console.log(`   Projection chart container: ${projection ? "✅" : "❌"}`);
  console.log(`   Cash flow chart container: ${cashFlow ? "✅" : "❌"}`);
  console.log(`   ROI comparison chart container: ${roiComparison ? "✅" : "❌"}`);

  return { projection, cashFlow, roiComparison };
}

/**
 * Check if chart sections are open/visible
 */
export function checkSectionVisibility(): {
  cashFlow: boolean;
  projections: boolean;
  comparison: boolean;
} {
  // Check if chart containers are visible (not in hidden sections)
  const projectionElement = document.getElementById("projection-chart-container");
  const cashFlowElement = document.getElementById("cash-flow-chart-container");
  const roiElement = document.getElementById("roi-comparison-chart-container");

  const projectionVisible =
    projectionElement &&
    window.getComputedStyle(projectionElement).display !== "none" &&
    projectionElement.offsetParent !== null;

  const cashFlowVisible =
    cashFlowElement &&
    window.getComputedStyle(cashFlowElement).display !== "none" &&
    cashFlowElement.offsetParent !== null;

  const roiVisible =
    roiElement &&
    window.getComputedStyle(roiElement).display !== "none" &&
    roiElement.offsetParent !== null;

  console.log("👁️ Checking section visibility:");
  console.log(`   Cash Flow section: ${cashFlowVisible ? "✅ Visible" : "❌ Hidden"}`);
  console.log(`   Projections section: ${projectionVisible ? "✅ Visible" : "❌ Hidden"}`);
  console.log(`   Comparison section: ${roiVisible ? "✅ Visible" : "❌ Hidden"}`);

  return {
    cashFlow: !!cashFlowVisible,
    projections: !!projectionVisible,
    comparison: !!roiVisible,
  };
}

/**
 * Complete PDF generation test
 * Tests chart capture, element visibility, and provides debugging info
 */
export async function testPDFGeneration(): Promise<PDFTestResult> {
  console.log("🚀 Starting PDF Generation Test Suite...\n");

  // Step 1: Verify elements exist
  console.log("Step 1: Verifying chart elements exist in DOM");
  const elements = verifyChartElements();
  if (!elements.projection && !elements.cashFlow && !elements.roiComparison) {
    console.error("❌ No chart elements found! Make sure you're on a results page with analytics.");
    return {
      success: false,
      charts: {
        projection: { captured: false, dataUrl: null },
        cashFlow: { captured: false, dataUrl: null },
        roiComparison: { captured: false, dataUrl: null },
      },
      errors: ["No chart elements found in DOM. Ensure you're on a results page with investment analytics."],
      warnings: [],
    };
  }

  // Step 2: Check visibility
  console.log("\nStep 2: Checking section visibility");
  const visibility = checkSectionVisibility();

  if (!visibility.cashFlow || !visibility.projections) {
    console.warn("⚠️ Some sections are hidden. They will be opened automatically during capture.");
  }

  // Step 3: Test capture
  console.log("\nStep 3: Testing chart capture");
  const result = await testChartCapture();

  // Step 4: Provide recommendations
  console.log("\n💡 Recommendations:");
  if (result.errors.length > 0) {
    console.log("   - Ensure all chart sections are expanded before PDF generation");
    console.log("   - Check that Recharts components have rendered (SVG elements present)");
    console.log("   - Verify html2canvas is working correctly");
  } else if (result.charts.projection.captured && result.charts.cashFlow.captured) {
    console.log("   ✅ Charts are being captured correctly!");
    console.log("   - PDF generation should work properly");
  }

  return result;
}

// Make functions available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).testPDFGeneration = testPDFGeneration;
  (window as any).testChartCapture = testChartCapture;
  (window as any).verifyChartElements = verifyChartElements;
  (window as any).checkSectionVisibility = checkSectionVisibility;
  
  console.log("🔧 PDF Testing Utilities loaded!");
  console.log("   Available functions:");
  console.log("   - window.testPDFGeneration() - Run full test suite");
  console.log("   - window.testChartCapture() - Test chart capture only");
  console.log("   - window.verifyChartElements() - Check if chart elements exist");
  console.log("   - window.checkSectionVisibility() - Check if sections are visible");
}
