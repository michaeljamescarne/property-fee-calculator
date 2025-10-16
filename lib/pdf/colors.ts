/**
 * Color Utilities for PDF Generation
 * Converts website OKLCH colors to RGB for jsPDF
 */

/**
 * Convert OKLCH to RGB
 * Approximation for PDF generation
 * 
 * Website colors from globals.css:
 * --primary: oklch(0.65 0.15 250);
 * --accent: oklch(0.75 0.12 240);
 * --destructive: oklch(0.577 0.245 27.325);
 */

export type RGBColor = [number, number, number];

// Website brand colors converted to RGB
export const PDF_COLORS = {
  // Primary blue (oklch(0.65 0.15 250))
  primary: [59, 130, 246] as RGBColor,
  
  // Accent lighter blue (oklch(0.75 0.12 240))
  accent: [96, 165, 250] as RGBColor,
  
  // Success green
  success: [16, 185, 129] as RGBColor,
  
  // Warning amber
  warning: [245, 158, 11] as RGBColor,
  
  // Danger red (oklch(0.577 0.245 27.325))
  danger: [239, 68, 68] as RGBColor,
  
  // Neutral grays
  gray: {
    light: [243, 244, 246] as RGBColor,
    medium: [156, 163, 175] as RGBColor,
    dark: [55, 65, 81] as RGBColor,
  },
  
  // Chart colors (from website charts)
  chart: {
    blue: [99, 102, 241] as RGBColor,
    purple: [139, 92, 246] as RGBColor,
    cyan: [6, 182, 212] as RGBColor,
    green: [16, 185, 129] as RGBColor,
    orange: [249, 115, 22] as RGBColor,
  }
};

/**
 * Get color with alpha/opacity
 * @param color RGB color tuple
 * @param alpha Alpha value 0-1
 * @returns RGBA color string for canvas contexts
 */
export function withAlpha(color: RGBColor, alpha: number): string {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

/**
 * Lighten a color by percentage
 * @param color RGB color tuple
 * @param percent Percentage to lighten (0-100)
 * @returns Lightened RGB color
 */
export function lighten(color: RGBColor, percent: number): RGBColor {
  const factor = 1 + (percent / 100);
  return [
    Math.min(255, Math.round(color[0] + (255 - color[0]) * (factor - 1))),
    Math.min(255, Math.round(color[1] + (255 - color[1]) * (factor - 1))),
    Math.min(255, Math.round(color[2] + (255 - color[2]) * (factor - 1)))
  ];
}

/**
 * Darken a color by percentage
 * @param color RGB color tuple
 * @param percent Percentage to darken (0-100)
 * @returns Darkened RGB color
 */
export function darken(color: RGBColor, percent: number): RGBColor {
  const factor = 1 - (percent / 100);
  return [
    Math.max(0, Math.round(color[0] * factor)),
    Math.max(0, Math.round(color[1] * factor)),
    Math.max(0, Math.round(color[2] * factor))
  ];
}




