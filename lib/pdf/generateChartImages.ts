/**
 * Chart Generation Utilities for PDF Reports
 * Generates chart images for embedding in PDFs
 * Uses canvas to convert SVG to PNG for jsPDF compatibility
 */

import { InvestmentAnalytics } from "@/types/investment";
import { createCanvas } from "canvas";
import { Canvg } from "canvg";

interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const DEFAULT_CHART_DIMS: ChartDimensions = {
  width: 400,
  height: 200,
  margin: { top: 20, right: 20, bottom: 40, left: 60 },
};

/**
 * Convert SVG string to PNG data URL using canvg
 * Falls back to empty string if conversion fails
 */
async function svgToPngDataUrl(svgString: string): Promise<string> {
  try {
    // Create canvas
    const canvas = createCanvas(DEFAULT_CHART_DIMS.width, DEFAULT_CHART_DIMS.height);
    const ctx = canvas.getContext("2d");

    // Use canvg to render SVG to canvas
    const canvg = Canvg.fromString(ctx as unknown as CanvasRenderingContext2D, svgString);
    await canvg.render();

    // Convert to PNG data URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error converting SVG to PNG:", error);
    // Return empty string to skip chart rendering
    return "";
  }
}

/**
 * Generate 10-Year Projection Line Chart as Data URL
 * Shows Property Value, Loan Balance, and Equity over time
 */
export async function generateProjectionChart(analytics: InvestmentAnalytics): Promise<string> {
  const dims = DEFAULT_CHART_DIMS;
  const chartWidth = dims.width - dims.margin.left - dims.margin.right;
  const chartHeight = dims.height - dims.margin.top - dims.margin.bottom;

  // Get data points (first 10 years)
  const dataPoints = analytics.yearByYear.slice(0, 10);
  if (dataPoints.length === 0) return "";

  // Calculate scales
  const maxValue = Math.max(...dataPoints.map((d) => d.propertyValue));
  const minValue = Math.min(...dataPoints.map((d) => d.propertyValue));
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1;

  const xScale = (year: number) => dims.margin.left + (year / 9) * chartWidth;
  const yScale = (value: number) =>
    dims.margin.top +
    chartHeight -
    ((value - minValue + padding) / (valueRange + padding * 2)) * chartHeight;

  // Generate SVG
  const svg = `
    <svg width="${dims.width}" height="${dims.height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${dims.width}" height="${dims.height}" fill="#ffffff"/>
      
      <!-- Grid lines -->
      ${generateGridLines(dataPoints, xScale, yScale, dims)}
      
      <!-- Property Value Line -->
      <polyline
        points="${dataPoints.map((d) => `${xScale(d.year - dataPoints[0].year)},${yScale(d.propertyValue)}`).join(" ")}"
        fill="none"
        stroke="#3b82f6"
        stroke-width="2"
      />
      
      <!-- Loan Balance Line -->
      <polyline
        points="${dataPoints.map((d) => `${xScale(d.year - dataPoints[0].year)},${yScale(d.loanBalance)}`).join(" ")}"
        fill="none"
        stroke="#ef4444"
        stroke-width="2"
      />
      
      <!-- Equity Line -->
      <polyline
        points="${dataPoints.map((d) => `${xScale(d.year - dataPoints[0].year)},${yScale(d.equity)}`).join(" ")}"
        fill="none"
        stroke="#10b981"
        stroke-width="2"
      />
      
      <!-- Data points -->
      ${dataPoints
        .map(
          (d) => `
        <circle cx="${xScale(d.year - dataPoints[0].year)}" cy="${yScale(d.propertyValue)}" r="3" fill="#3b82f6"/>
        <circle cx="${xScale(d.year - dataPoints[0].year)}" cy="${yScale(d.loanBalance)}" r="3" fill="#ef4444"/>
        <circle cx="${xScale(d.year - dataPoints[0].year)}" cy="${yScale(d.equity)}" r="3" fill="#10b981"/>
      `
        )
        .join("")}
      
      <!-- Axes -->
      <line x1="${dims.margin.left}" y1="${dims.margin.top}" x2="${dims.margin.left}" y2="${dims.margin.top + chartHeight}" stroke="#374151" stroke-width="1"/>
      <line x1="${dims.margin.left}" y1="${dims.margin.top + chartHeight}" x2="${dims.margin.left + chartWidth}" y2="${dims.margin.top + chartHeight}" stroke="#374151" stroke-width="1"/>
      
      <!-- Labels -->
      <text x="${dims.width / 2}" y="${dims.height - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#374151">Years</text>
      <text x="10" y="${dims.height / 2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#374151" transform="rotate(-90, 10, ${dims.height / 2})">Value ($)</text>
      
      <!-- Legend -->
      <rect x="${dims.width - 120}" y="10" width="110" height="60" fill="#f9fafb" stroke="#d1d5db"/>
      <line x1="${dims.width - 110}" y1="25" x2="${dims.width - 90}" y2="25" stroke="#3b82f6" stroke-width="2"/>
      <text x="${dims.width - 85}" y="30" font-family="Arial, sans-serif" font-size="9" fill="#374151">Property Value</text>
      <line x1="${dims.width - 110}" y1="40" x2="${dims.width - 90}" y2="40" stroke="#ef4444" stroke-width="2"/>
      <text x="${dims.width - 85}" y="45" font-family="Arial, sans-serif" font-size="9" fill="#374151">Loan Balance</text>
      <line x1="${dims.width - 110}" y1="55" x2="${dims.width - 90}" y2="55" stroke="#10b981" stroke-width="2"/>
      <text x="${dims.width - 85}" y="60" font-family="Arial, sans-serif" font-size="9" fill="#374151">Equity</text>
    </svg>
  `;

  return await svgToPngDataUrl(svg);
}

/**
 * Generate Monthly Cash Flow Bar Chart as Data URL
 * Shows Income vs Expenses breakdown
 */
export async function generateCashFlowChart(analytics: InvestmentAnalytics): Promise<string> {
  const dims = DEFAULT_CHART_DIMS;
  const chartWidth = dims.width - dims.margin.left - dims.margin.right;
  const chartHeight = dims.height - dims.margin.top - dims.margin.bottom;

  // Prepare data
  const monthlyData = [
    { label: "Rent", value: analytics.cashFlow.annual.rentalIncome / 12, color: "#10b981" },
    { label: "Expenses", value: -analytics.cashFlow.annual.totalExpenses / 12, color: "#ef4444" },
    { label: "Net", value: analytics.cashFlow.monthly.afterTaxCashFlow, color: "#3b82f6" },
  ];

  const maxValue = Math.max(...monthlyData.map((d) => Math.abs(d.value)));
  const minValue = Math.min(...monthlyData.map((d) => d.value));
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.2;

  const barWidth = (chartWidth / monthlyData.length) * 0.6;
  const xScale = (index: number) =>
    dims.margin.left + (index + 0.2) * (chartWidth / monthlyData.length);
  const yScale = (value: number) => {
    const normalizedValue = (value - minValue + padding) / (valueRange + padding * 2);
    return dims.margin.top + chartHeight - normalizedValue * chartHeight;
  };

  const svg = `
    <svg width="${dims.width}" height="${dims.height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${dims.width}" height="${dims.height}" fill="#ffffff"/>
      
      <!-- Zero line -->
      <line x1="${dims.margin.left}" y1="${yScale(0)}" x2="${dims.margin.left + chartWidth}" y2="${yScale(0)}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2,2"/>
      
      <!-- Bars -->
      ${monthlyData
        .map(
          (item, index) => `
        <rect
          x="${xScale(index)}"
          y="${Math.min(yScale(0), yScale(item.value))}"
          width="${barWidth}"
          height="${Math.abs(yScale(item.value) - yScale(0))}"
          fill="${item.color}"
          opacity="0.8"
        />
        <text x="${xScale(index) + barWidth / 2}" y="${yScale(item.value) - 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#374151">
          ${formatCurrencyCompact(item.value)}
        </text>
      `
        )
        .join("")}
      
      <!-- Axes -->
      <line x1="${dims.margin.left}" y1="${dims.margin.top}" x2="${dims.margin.left}" y2="${dims.margin.top + chartHeight}" stroke="#374151" stroke-width="1"/>
      <line x1="${dims.margin.left}" y1="${dims.margin.top + chartHeight}" x2="${dims.margin.left + chartWidth}" y2="${dims.margin.top + chartHeight}" stroke="#374151" stroke-width="1"/>
      
      <!-- Labels -->
      ${monthlyData
        .map(
          (item, index) => `
        <text x="${xScale(index) + barWidth / 2}" y="${dims.height - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#374151">
          ${item.label}
        </text>
      `
        )
        .join("")}
      
      <!-- Title -->
      <text x="${dims.width / 2}" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Monthly Cash Flow</text>
    </svg>
  `;

  return await svgToPngDataUrl(svg);
}

/**
 * Generate Investment Comparison Bar Chart as Data URL
 * Shows Property vs ASX vs Bonds ROI
 */
export async function generateROIComparisonChart(analytics: InvestmentAnalytics): Promise<string> {
  const dims = DEFAULT_CHART_DIMS;
  const chartWidth = dims.width - dims.margin.left - dims.margin.right;
  const chartHeight = dims.height - dims.margin.top - dims.margin.bottom;

  // Prepare comparison data
  const comparisonData = [
    {
      label: "Property",
      value: analytics.comparisons.propertyInvestment.annualizedReturn * 100,
      color: "#3b82f6",
    },
    { label: "ASX 200", value: analytics.comparisons.asxStocks.rate * 100, color: "#10b981" },
    {
      label: "Term Deposit",
      value: analytics.comparisons.termDeposit.rate * 100,
      color: "#f59e0b",
    },
    { label: "Bonds", value: analytics.comparisons.governmentBonds.rate * 100, color: "#ef4444" },
  ];

  const maxValue = Math.max(...comparisonData.map((d) => d.value));
  const valueRange = maxValue;
  const padding = valueRange * 0.1;

  const barWidth = (chartWidth / comparisonData.length) * 0.7;
  const xScale = (index: number) =>
    dims.margin.left + (index + 0.15) * (chartWidth / comparisonData.length);
  const yScale = (value: number) => {
    const normalizedValue = value / (valueRange + padding);
    return dims.margin.top + chartHeight - normalizedValue * chartHeight;
  };

  const svg = `
    <svg width="${dims.width}" height="${dims.height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${dims.width}" height="${dims.height}" fill="#ffffff"/>
      
      <!-- Grid lines -->
      ${generateComparisonGridLines(comparisonData, xScale, yScale, dims)}
      
      <!-- Bars -->
      ${comparisonData
        .map(
          (item, index) => `
        <rect
          x="${xScale(index)}"
          y="${yScale(item.value)}"
          width="${barWidth}"
          height="${dims.margin.top + chartHeight - yScale(item.value)}"
          fill="${item.color}"
          opacity="0.8"
        />
        <text x="${xScale(index) + barWidth / 2}" y="${yScale(item.value) - 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#374151">
          ${item.value.toFixed(1)}%
        </text>
      `
        )
        .join("")}
      
      <!-- Axes -->
      <line x1="${dims.margin.left}" y1="${dims.margin.top}" x2="${dims.margin.left}" y2="${dims.margin.top + chartHeight}" stroke="#374151" stroke-width="1"/>
      <line x1="${dims.margin.left}" y1="${dims.margin.top + chartHeight}" x2="${dims.margin.left + chartWidth}" y2="${dims.margin.top + chartHeight}" stroke="#374151" stroke-width="1"/>
      
      <!-- Labels -->
      ${comparisonData
        .map(
          (item, index) => `
        <text x="${xScale(index) + barWidth / 2}" y="${dims.height - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#374151">
          ${item.label}
        </text>
      `
        )
        .join("")}
      
      <!-- Y-axis labels -->
      <text x="${dims.margin.left - 5}" y="${dims.margin.top + 5}" text-anchor="end" font-family="Arial, sans-serif" font-size="8" fill="#374151">${maxValue.toFixed(1)}%</text>
      <text x="${dims.margin.left - 5}" y="${dims.margin.top + chartHeight / 2}" text-anchor="end" font-family="Arial, sans-serif" font-size="8" fill="#374151">${(maxValue / 2).toFixed(1)}%</text>
      <text x="${dims.margin.left - 5}" y="${dims.margin.top + chartHeight + 5}" text-anchor="end" font-family="Arial, sans-serif" font-size="8" fill="#374151">0%</text>
      
      <!-- Title -->
      <text x="${dims.width / 2}" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Investment Return Comparison</text>
    </svg>
  `;

  return await svgToPngDataUrl(svg);
}

// Helper functions
function generateGridLines(
  dataPoints: Array<{ year: number; propertyValue: number }>,
  xScale: (value: number) => number,
  yScale: (value: number) => number,
  dims: ChartDimensions
): string {
  const chartWidth = dims.width - dims.margin.left - dims.margin.right;
  const chartHeight = dims.height - dims.margin.top - dims.margin.bottom;

  let gridLines = "";

  // Vertical grid lines
  for (let i = 0; i <= 9; i++) {
    const x = xScale(i);
    gridLines += `<line x1="${x}" y1="${dims.margin.top}" x2="${x}" y2="${dims.margin.top + chartHeight}" stroke="#e5e7eb" stroke-width="0.5"/>`;
  }

  // Horizontal grid lines
  const maxValue = Math.max(...dataPoints.map((d) => d.propertyValue));
  const minValue = Math.min(...dataPoints.map((d) => d.propertyValue));
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1;

  for (let i = 0; i <= 5; i++) {
    const value = minValue - padding + (valueRange + padding * 2) * (i / 5);
    const y = yScale(value);
    gridLines += `<line x1="${dims.margin.left}" y1="${y}" x2="${dims.margin.left + chartWidth}" y2="${y}" stroke="#e5e7eb" stroke-width="0.5"/>`;
  }

  return gridLines;
}

function generateComparisonGridLines(
  comparisonData: Array<{ value: number }>,
  xScale: (index: number) => number,
  yScale: (value: number) => number,
  dims: ChartDimensions
): string {
  const chartWidth = dims.width - dims.margin.left - dims.margin.right;

  let gridLines = "";

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const value = Math.max(...comparisonData.map((d) => d.value)) * 1.1 * (i / 5);
    const y = yScale(value);
    gridLines += `<line x1="${dims.margin.left}" y1="${y}" x2="${dims.margin.left + chartWidth}" y2="${y}" stroke="#e5e7eb" stroke-width="0.5"/>`;
  }

  return gridLines;
}

function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
}
