/**
 * Client-Side Chart Image Capture
 * Captures Recharts SVG elements and converts to PNG base64
 * Uses html2canvas for reliable browser-based rendering
 */

import html2canvas from "html2canvas";

interface ChartCaptureOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  scale?: number;
  scrollIntoView?: boolean;
}

/**
 * Ensure element is visible in the viewport for proper capture
 */
function ensureElementVisible(element: HTMLElement): void {
  // Check if element or any parent is hidden
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    // Temporarily make visible
    element.style.display = "block";
    element.style.visibility = "visible";
    element.style.opacity = "1";
  }

  // Scroll element into view
  element.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
}

/**
 * Capture chart from DOM element by ID
 * Returns base64 PNG data URL
 */
export async function captureChartElement(
  elementId: string,
  options: ChartCaptureOptions = {}
): Promise<string | null> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Chart element with ID "${elementId}" not found`);
      return null;
    }

    // Ensure element is visible before capture
    ensureElementVisible(element);

    // Wait for DOM updates and chart rendering
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if element has actual content (Recharts renders into a container)
    const chartContent = element.querySelector("svg, canvas");
    if (!chartContent) {
      console.warn(`Chart element "${elementId}" has no SVG/canvas content. Waiting longer...`);
      // Wait longer for charts to render
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check again
      const retryContent = element.querySelector("svg, canvas");
      if (!retryContent) {
        console.error(`Chart element "${elementId}" still has no content after waiting`);
        return null;
      }
    }

    // Get actual dimensions from the element or its content
    const rect = element.getBoundingClientRect();
    const actualWidth = options.width || rect.width || element.offsetWidth || element.scrollWidth;
    const actualHeight = options.height || rect.height || element.offsetHeight || element.scrollHeight;

    if (actualWidth === 0 || actualHeight === 0) {
      console.error(`Chart element "${elementId}" has zero dimensions: ${actualWidth}x${actualHeight}`);
      return null;
    }

    // Use html2canvas to capture the element
    const canvas = await html2canvas(element, {
      backgroundColor: options.backgroundColor || "#FFFFFF",
      scale: options.scale || 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: actualWidth,
      height: actualHeight,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      // Important: Include these options for SVG rendering
      foreignObjectRendering: true,
      removeContainer: false,
    });

    // Convert canvas to base64 PNG data URL
    const dataUrl = canvas.toDataURL("image/png", 1.0);
    
    // Verify the image was captured (data URL should start with "data:image/png")
    if (!dataUrl || !dataUrl.startsWith("data:image/png")) {
      console.error(`Failed to generate valid image data URL for "${elementId}"`);
      return null;
    }

    // Log success with image size info
    console.log(`✅ Successfully captured chart "${elementId}": ${actualWidth}x${actualHeight}px, ${Math.round(dataUrl.length / 1024)}KB`);
    
    return dataUrl;
  } catch (error) {
    console.error(`Failed to capture chart element "${elementId}":`, error);
    return null;
  }
}

/**
 * Find and open the collapsible section containing a chart
 * Since sections use conditional rendering, we need to click the toggle button
 */
async function ensureChartSectionVisible(chartElementId: string): Promise<void> {
  // First check if element exists (section might be open)
  let element = document.getElementById(chartElementId);
  
  if (element) {
    // Element exists, ensure it's visible
    ensureElementVisible(element);
    return;
  }

  // Element doesn't exist - section is closed. Find and click the toggle button.
  // Chart container IDs map to section IDs:
  // projection-chart-container -> projections
  // cash-flow-chart-container -> cashFlow
  // roi-comparison-chart-container -> comparison (but might not be in a section)
  
  const sectionIdMap: Record<string, string> = {
    "projection-chart-container": "projections",
    "cash-flow-chart-container": "cashFlow",
    "roi-comparison-chart-container": "comparison",
  };

  const sectionId = sectionIdMap[chartElementId];
  if (!sectionId) {
    console.warn(`No section mapping found for chart "${chartElementId}"`);
    return;
  }

  // Find the Card containing this section and its toggle button
  // Look for Cards with CardHeader that have a button with ChevronDown icon
  const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
  for (const card of cards) {
    const header = card.querySelector('[class*="CardHeader"]');
    if (!header) continue;

    // Check if this card's section ID matches (we need to find a way to identify it)
    // Since we don't have direct section ID in DOM, we'll look for the toggle button
    // and check if clicking it reveals our chart element
    
    const toggleButton = header.querySelector('button') as HTMLButtonElement;
    if (!toggleButton) continue;

    // Check if button has ChevronDown icon (section is closed)
    const chevronDown = toggleButton.querySelector('svg[class*="ChevronDown"], svg[class*="chevron-down"]');
    if (!chevronDown) continue;

    // Try clicking the button to open the section
    toggleButton.click();
    
    // Wait for React to re-render and element to appear
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if element now exists
    element = document.getElementById(chartElementId);
    if (element) {
      ensureElementVisible(element);
      return;
    }
  }

  console.warn(`Could not open section containing chart "${chartElementId}"`);
}

/**
 * Capture projection chart
 * The chart should be wrapped in a container with id="projection-chart-container"
 */
export async function captureProjectionChart(): Promise<string | null> {
  await ensureChartSectionVisible("projection-chart-container");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for React to render
  return captureChartElement("projection-chart-container", {
    backgroundColor: "#FFFFFF",
    scale: 2,
  });
}

/**
 * Capture cash flow chart
 * The chart should be wrapped in a container with id="cash-flow-chart-container"
 */
export async function captureCashFlowChart(): Promise<string | null> {
  await ensureChartSectionVisible("cash-flow-chart-container");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for React to render
  return captureChartElement("cash-flow-chart-container", {
    backgroundColor: "#FFFFFF",
    scale: 2,
  });
}

/**
 * Capture ROI comparison chart
 * The chart should be wrapped in a container with id="roi-comparison-chart-container"
 * Note: This chart may be in a section that's not in the collapsible list
 */
export async function captureROIComparisonChart(): Promise<string | null> {
  await ensureChartSectionVisible("roi-comparison-chart-container");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for React to render
  return captureChartElement("roi-comparison-chart-container", {
    backgroundColor: "#FFFFFF",
    scale: 2,
  });
}