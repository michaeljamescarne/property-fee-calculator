/**
 * PDF Template Helpers
 * Reusable utilities for generating PDF elements with consistent styling
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Color constants matching template design
export const COLORS = {
  primary: '#3B82F6',    // Blue
  success: '#10B981',     // Green
  danger: '#DC2626',      // Red
  warning: '#F97316',     // Orange
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
} as const;

// Typography constants
export const FONTS = {
  title: 24,
  subtitle: 12,
  body: 10,
  small: 8
} as const;

// Spacing constants
export const SPACING = {
  margin: 20, // 2cm margins
  sectionGap: 15,
  elementGap: 10,
  lineHeight: 1.2
} as const;

/**
 * Helper function to get current Y position from jsPDF
 */
function getCurrentY(doc: jsPDF): number {
  return (doc as unknown as { getCurrentY(): number }).getCurrentY();
}

/**
 * Helper function to get current X position from jsPDF
 */
function getCurrentX(doc: jsPDF): number {
  return (doc as unknown as { getCurrentX(): number }).getCurrentX();
}

/**
 * Adds a cover page with blue header, centered title, and property details
 */
export function addCoverPage(
  doc: jsPDF,
  title: string,
  propertyAddress: string,
  purchasePrice: number,
  generationDate: string
): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Blue header bar
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // White title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONTS.title);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 35, { align: 'center' });

  // Property details section
  doc.setTextColor(COLORS.gray[800]);
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'normal');
  
  const startY = 100;
  doc.text('Property Details', SPACING.margin, startY);
  
  doc.setFont('helvetica', 'bold');
  doc.text(propertyAddress, SPACING.margin, startY + 15);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Purchase Price: $${purchasePrice.toLocaleString()}`, SPACING.margin, startY + 30);
  doc.text(`Report Generated: ${generationDate}`, SPACING.margin, startY + 45);

  // Add new page for content
  doc.addPage();
}

/**
 * Adds a table of contents with two-column layout and dot leaders
 */
export function addTableOfContents(
  doc: jsPDF,
  sections: Array<{ title: string; page: number }>
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftColumnX = SPACING.margin;
  const rightColumnX = pageWidth / 2 + SPACING.margin;
  const lineHeight = 12;
  let currentY = SPACING.margin + 20;

  // Title
  doc.setTextColor(COLORS.gray[800]);
  doc.setFontSize(FONTS.title);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', SPACING.margin, currentY);
  currentY += 20;

  // Sections in two columns
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'normal');

  const midPoint = Math.ceil(sections.length / 2);
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const isLeftColumn = i < midPoint;
    const x = isLeftColumn ? leftColumnX : rightColumnX;
    const y = isLeftColumn ? currentY + (i * lineHeight) : currentY + ((i - midPoint) * lineHeight);

    // Section title
    doc.text(section.title, x, y);
    
    // Dot leaders
    const dotsStart = x + 120;
    const dotsEnd = x + 140;
    const dotsY = y - 2;
    
    for (let dotX = dotsStart; dotX < dotsEnd; dotX += 2) {
      doc.text('.', dotX, dotsY);
    }
    
    // Page number
    doc.text(section.page.toString(), x + 145, y);
  }

  // Add new page
  doc.addPage();
}

/**
 * Adds a section header with blue bar and white text
 */
export function addSectionHeader(
  doc: jsPDF,
  title: string,
  subtitle?: string
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const currentY = getCurrentY(doc);

  // Blue header bar
  doc.setFillColor(COLORS.primary);
  doc.rect(0, currentY - 5, pageWidth, 25, 'F');

  // White title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONTS.title);
  doc.setFont('helvetica', 'bold');
  doc.text(title, SPACING.margin, currentY + 8);

  // White subtitle text (if provided)
  if (subtitle) {
    doc.setFontSize(FONTS.subtitle);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, SPACING.margin, currentY + 18);
  }

  // Reset text color and position
  doc.setTextColor(COLORS.gray[800]);
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'normal');
  
  // Move cursor below header
  (doc as unknown as { setCursor(x: number, y: number): void }).setCursor(SPACING.margin, currentY + 35);
}

/**
 * Adds a styled data table with gray headers and striped rows
 */
export function addDataTable(
  doc: jsPDF,
  headers: string[],
  rows: (string | number)[][],
  options?: {
    title?: string;
    widths?: number[];
    align?: ('left' | 'center' | 'right')[];
  }
): void {
  const currentY = getCurrentY(doc);

  // Add title if provided
  if (options?.title) {
    doc.setFontSize(FONTS.body);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title, SPACING.margin, currentY);
    (doc as unknown as { setCursor(x: number, y: number): void }).setCursor(SPACING.margin, currentY + 15);
  }

  // Generate table using autoTable
  (doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
    startY: getCurrentY(doc),
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.gray[200],
      textColor: COLORS.gray[800],
      fontStyle: 'bold',
      fontSize: FONTS.body
    },
    bodyStyles: {
      fontSize: FONTS.body,
      textColor: COLORS.gray[700]
    },
    alternateRowStyles: {
      fillColor: COLORS.gray[50]
    },
    columnStyles: options?.align ? 
      Object.fromEntries(options.align.map((align, i) => [i, { halign: align }])) : 
      {},
    columnWidths: options?.widths,
    margin: { left: SPACING.margin, right: SPACING.margin },
    didDrawPage: () => {
      // Add footer to each page
      addFooter(doc);
    }
  });

  // Move cursor below table
  (doc as unknown as { setCursor(x: number, y: number): void }).setCursor(SPACING.margin, (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10);
}

/**
 * Adds a metric card with border, label, value, and optional subtext
 */
export function addMetricCard(
  doc: jsPDF,
  label: string,
  value: string | number,
  subtext?: string,
  color: string = COLORS.gray[800]
): void {
  const cardWidth = 80;
  const cardHeight = 40;
  const currentX = getCurrentX(doc);
  const currentY = getCurrentY(doc);

  // Card border
  doc.setDrawColor(COLORS.gray[300]);
  doc.setLineWidth(0.5);
  doc.rect(currentX, currentY, cardWidth, cardHeight);

  // Label
  doc.setTextColor(COLORS.gray[600]);
  doc.setFontSize(FONTS.small);
  doc.setFont('helvetica', 'normal');
  doc.text(label, currentX + 5, currentY + 8);

  // Value
  doc.setTextColor(color);
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'bold');
  doc.text(value.toString(), currentX + 5, currentY + 20);

  // Subtext (if provided)
  if (subtext) {
    doc.setTextColor(COLORS.gray[500]);
    doc.setFontSize(FONTS.small);
    doc.setFont('helvetica', 'normal');
    doc.text(subtext, currentX + 5, currentY + 32);
  }

  // Move cursor to next position
  (doc as unknown as { setCursor(x: number, y: number): void }).setCursor(currentX + cardWidth + 10, currentY);
}

/**
 * Adds an alert box with color-coded background
 */
export function addAlertBox(
  doc: jsPDF,
  message: string,
  type: 'info' | 'warning' | 'success' | 'danger' = 'info',
  title?: string
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const currentY = getCurrentY(doc);
  const boxWidth = pageWidth - (SPACING.margin * 2);
  const boxHeight = title ? 50 : 35;

  // Color mapping
  const colorMap = {
    info: COLORS.primary,
    warning: COLORS.warning,
    success: COLORS.success,
    danger: COLORS.danger
  };

  const bgColor = colorMap[type];

  // Background
  doc.setFillColor(bgColor);
  (doc as unknown as { setAlpha(alpha: number): void }).setAlpha(0.1);
  doc.rect(SPACING.margin, currentY, boxWidth, boxHeight, 'F');
  (doc as unknown as { setAlpha(alpha: number): void }).setAlpha(1);

  // Border
  doc.setDrawColor(bgColor);
  doc.setLineWidth(1);
  doc.rect(SPACING.margin, currentY, boxWidth, boxHeight);

  // Title (if provided)
  if (title) {
    doc.setTextColor(bgColor);
    doc.setFontSize(FONTS.body);
    doc.setFont('helvetica', 'bold');
    doc.text(title, SPACING.margin + 10, currentY + 12);
  }

  // Message
  doc.setTextColor(COLORS.gray[800]);
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'normal');
  const messageY = title ? currentY + 25 : currentY + 15;
  doc.text(message, SPACING.margin + 10, messageY);

  // Move cursor below box
  (doc as unknown as { setCursor(x: number, y: number): void }).setCursor(SPACING.margin, currentY + boxHeight + 10);
}

/**
 * Adds a footer with generator name, page number, and date
 */
export function addFooter(doc: jsPDF): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageNumber = doc.getCurrentPageInfo().pageNumber;
  const totalPages = doc.getNumberOfPages();
  const currentDate = new Date().toLocaleDateString();

  // Footer line
  doc.setDrawColor(COLORS.gray[300]);
  doc.setLineWidth(0.5);
  doc.line(SPACING.margin, pageHeight - 20, pageWidth - SPACING.margin, pageHeight - 20);

  // Footer text
  doc.setTextColor(COLORS.gray[500]);
  doc.setFontSize(FONTS.small);
  doc.setFont('helvetica', 'normal');

  // Left: Generator name
  doc.text('Property Investment Calculator', SPACING.margin, pageHeight - 10);

  // Center: Page number
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Right: Date
  doc.text(currentDate, pageWidth - SPACING.margin, pageHeight - 10, { align: 'right' });
}

/**
 * Adds a page break and ensures footer is added
 */
export function addPageBreak(doc: jsPDF): void {
  addFooter(doc);
  doc.addPage();
}

/**
 * Formats currency values with proper locale formatting
 */
export function formatCurrency(amount: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats percentage values with proper precision
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats large numbers with K/M suffixes
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

/**
 * Checks if content will fit on current page and adds page break if needed
 */
export function checkPageBreak(doc: jsPDF, requiredHeight: number): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  const currentY = getCurrentY(doc);
  const availableHeight = pageHeight - currentY - 30; // Reserve space for footer

  if (requiredHeight > availableHeight) {
    addPageBreak(doc);
  }
}
