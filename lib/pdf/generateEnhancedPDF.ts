/**
 * Enhanced FIRB PDF Generator with Investment Analytics
 * Generates comprehensive 7-page investment analysis report
 * Supports multiple languages and locales
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import { FIRBCalculatorFormData } from '@/lib/validations/firb';
import type { InvestmentAnalytics } from '@/types/investment';
import { formatCurrency, formatPercent, formatDate, formatNumber } from '@/lib/utils/format';
import type { PDFTranslations } from './pdfTranslations';
import { PDF_COLORS } from './colors';
import { GLOSSARY_TERMS_ARRAY } from './glossaryTerms';
import { ContentTier, TIER_FEATURES } from './contentAccess';
// Chart generation temporarily disabled for reliability
// import { generateProjectionChart, generateCashFlowChart, generateROIComparisonChart } from './generateChartImages';

// Extend jsPDF types for autotable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export async function generateEnhancedPDF(
  formData: Partial<FIRBCalculatorFormData>,
  eligibility: EligibilityResult,
  costs: CostBreakdown,
  analytics: InvestmentAnalytics,
  locale: string = 'en',
  translations: PDFTranslations,
  contentTier: ContentTier = 'premium' // NEW: Support tiered content
): Promise<Blob> {
  console.log('🚀 Generating Enhanced PDF with latest changes -', new Date().toISOString());
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Table of Contents tracking
  const tableOfContents: Array<{ title: string; page: number; level: number }> = [];

  // Helper: Add item to table of contents
  const addToTOC = (title: string, level: number = 1) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (doc as any).internal.getNumberOfPages();
    tableOfContents.push({ title, page: pageCount, level });
  };

  // Helper: Generate Table of Contents page
  const generateTableOfContents = () => {
    if (tableOfContents.length === 0) return;

    doc.addPage();
    yPosition = margin;
    addFooter();

    // TOC Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Table of Contents', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('FIRB Investment Analysis Report', pageWidth / 2, 30, { align: 'center' });

    yPosition = 50;
    doc.setTextColor(0, 0, 0);

    // TOC Items
    tableOfContents.forEach((item) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
        addFooter();
      }

      const indent = item.level * 10;
      const dotLeaderLength = pageWidth - margin * 2 - indent - 60;

      // Title
      doc.setFontSize(item.level === 1 ? 12 : 10);
      doc.setFont('helvetica', item.level === 1 ? 'bold' : 'normal');
      doc.text(item.title, margin + indent, yPosition);

      // Dots
      const dots = '.'.repeat(Math.floor(dotLeaderLength / 2));
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(dots, margin + indent + doc.getTextWidth(item.title) + 5, yPosition);

      // Page number
      doc.text(item.page.toString(), pageWidth - margin - 10, yPosition, { align: 'right' });

      yPosition += item.level === 1 ? 8 : 6;
    });

    // Reset font
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  // Add defensive defaults for translations to prevent undefined errors
  const safeTranslations = {
    title: translations?.title || 'FIRB Investment Analysis Report',
    subtitle: translations?.subtitle || 'Comprehensive Property Investment Analysis',
    page: translations?.page || 'Page',
    generatedOn: translations?.generatedOn || 'Generated on',
    sections: {
      propertyDetails: translations?.sections?.propertyDetails || 'Property Details',
      keyMetrics: translations?.sections?.keyMetrics || 'Key Investment Metrics',
      costBreakdown: translations?.sections?.costBreakdown || 'Cost Breakdown',
      investmentPerformance: translations?.sections?.investmentPerformance || 'Investment Performance',
      cashFlow: translations?.sections?.cashFlow || 'Cash Flow Analysis',
      projections: translations?.sections?.projections || '10-Year Projections',
      comparison: translations?.sections?.comparison || 'Investment Comparison',
      sensitivity: translations?.sections?.sensitivity || 'Sensitivity Analysis',
      taxAnalysis: translations?.sections?.taxAnalysis || 'Tax Analysis',
      recommendations: translations?.sections?.recommendations || 'Recommendations'
    },
    labels: {
      ...translations?.labels,
      overallVerdict: translations?.labels?.overallVerdict || 'Investment Rating',
      value: translations?.labels?.value || 'Value',
      deposit: translations?.labels?.deposit || 'Deposit'
    }
  } as PDFTranslations;

  // Get tier features
  const features = TIER_FEATURES[contentTier];
  
  // Colors - Updated to match website branding
  const primaryColor = PDF_COLORS.primary;
  const accentColor = PDF_COLORS.accent;
  const greenColor = PDF_COLORS.success;
  const redColor = PDF_COLORS.danger;
  const amberColor = PDF_COLORS.warning;

  // Chart generation disabled for reliability - using enhanced text-based summaries instead

  // Helper: Check page break
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      addFooter();
      return true;
    }
    return false;
  };

  // Helper: Add footer
  const addFooter = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (doc as any).internal.getNumberOfPages();
    
    // Set consistent font for all footer elements
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.setFont('helvetica', 'normal');
    
    // Disclaimer (left) - shorter text to avoid overlap
    const disclaimerText = locale === 'zh' ? '基于提供信息分析' : 'Analysis based on provided information';
    doc.text(disclaimerText, margin, pageHeight - 10);
    
    // Page number (center)
    const pageText = locale === 'zh' ? `${safeTranslations.page}${pageCount}页` : `${safeTranslations.page} ${pageCount}`;
    doc.text(pageText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Generation date (right)
    doc.text(`${safeTranslations.generatedOn} ${formatDate(new Date(), locale === 'zh' ? 'zh-CN' : 'en-AU')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    
    // Watermark for non-premium tiers
    if (contentTier !== 'premium') {
      doc.saveGraphicsState();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gstate = new (doc as any).GState({ opacity: 0.1 });
      doc.setGState(gstate);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      doc.text(contentTier.toUpperCase(), pageWidth / 2, pageHeight / 2, { 
        align: 'center',
        angle: 45 
      });
      doc.restoreGraphicsState();
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    }
  };

  // Helper: Add section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPosition + 7);
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
  };

  // Helper: Add upgrade prompt for locked features
  const addUpgradePrompt = (sectionName: string, description: string) => {
    doc.addPage();
    yPosition = margin;
    addFooter();
    
    // Blurred/obscured content background
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 180, 'F');
    
    // Lock icon circle
    doc.setFillColor(200, 200, 200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).circle(pageWidth / 2, yPosition + 50, 20, 'F');
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text('🔒', pageWidth / 2, yPosition + 58, { align: 'center' });
    
    // Section title
    yPosition += 85;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sectionName} - Premium Feature`, pageWidth / 2, yPosition, { align: 'center' });
    
    // Description
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(description, pageWidth - 2 * margin - 40);
    doc.text(descLines, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += descLines.length * 6 + 10;
    
    // Upgrade CTA
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(pageWidth / 2 - 60, yPosition, 120, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Upgrade to Access Full Report', pageWidth / 2, yPosition + 8, { align: 'center' });
    
    yPosition += 20;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Visit propertycosts.com.au to upgrade your account', pageWidth / 2, yPosition, { align: 'center' });
  };

  // Locale-aware formatting helpers
  const fmt = {
    currency: (value: number): string => formatCurrency(value, locale === 'zh' ? 'zh-CN' : 'en-AU', 'AUD'),
    percent: (value: number): string => formatPercent(value, locale === 'zh' ? 'zh-CN' : 'en-AU', 1),
    number: (value: number): string => formatNumber(value, locale === 'zh' ? 'zh-CN' : 'en-AU', { maximumFractionDigits: 0 }),
  };
  
  // Helper: Format property/citizenship types for display
  const formatPropertyType = (type?: string): string => {
    if (!type) return 'N/A';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const formatCitizenshipStatus = (status?: string): string => {
    if (!status) return 'N/A';
    const map: Record<string, string> = {
      'australian_citizen': 'Australian Citizen',
      'australian_permanent_resident': 'Australian Permanent Resident',
      'new_zealand_citizen': 'New Zealand Citizen',
      'foreign_national_temporary_visa': 'Foreign National (Temporary Visa)',
      'foreign_national_no_visa': 'Foreign National (No Visa)'
    };
    return map[status] || formatPropertyType(status);
  };
  
  const formatEntityType = (entity?: string): string => {
    if (!entity) return 'Individual';
    const map: Record<string, string> = {
      'individual': 'Individual',
      'company': 'Company',
      'trust': 'Trust'
    };
    return map[entity] || formatPropertyType(entity);
  };

  // =================
  // PAGE 1: EXECUTIVE SUMMARY
  // =================
  
  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(safeTranslations.title, pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(safeTranslations.subtitle, pageWidth / 2, 25, { align: 'center' });
  doc.text(`${formatDate(new Date(), locale === 'zh' ? 'zh-CN' : 'en-AU')}`, pageWidth / 2, 30, { align: 'center' });

  yPosition = 50;

  // Investment Analysis Score (Prominent Header)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Investment Analysis Score:', margin, yPosition);
  
  // Large Score Display
  doc.setFontSize(32);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${analytics.score.overall.toFixed(1)}/10`, margin + 120, yPosition);
  
  // Property Image Placeholder (moved to right side)
  doc.setFillColor(245, 245, 245);
  doc.rect(pageWidth - margin - 80, yPosition - 5, 80, 60, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth - margin - 80, yPosition - 5, 80, 60, 'S');
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Property Image', pageWidth - margin - 40, yPosition + 20, { align: 'center' });
  doc.text('(Not Available)', pageWidth - margin - 40, yPosition + 30, { align: 'center' });
  
  yPosition += 45;
  
  // Score breakdown in a clean grid
  const scoreGridY = yPosition;
  const scoreGridWidth = (pageWidth - 2 * margin) / 3;
  const scoreGridHeight = 30;
  
  // Rental Yield Score
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, scoreGridY, scoreGridWidth - 5, scoreGridHeight, 3, 3, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Rental Yield', margin + 5, scoreGridY + 10);
  doc.setFontSize(14);
  doc.text(`${analytics.score.rentalYield.toFixed(1)}`, margin + 5, scoreGridY + 22);
  
  // Capital Growth Score
  doc.setFillColor(240, 255, 248);
  doc.roundedRect(margin + scoreGridWidth, scoreGridY, scoreGridWidth - 5, scoreGridHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Capital Growth', margin + scoreGridWidth + 5, scoreGridY + 10);
  doc.setFontSize(14);
  doc.text(`${analytics.score.capitalGrowth.toFixed(1)}`, margin + scoreGridWidth + 5, scoreGridY + 22);
  
  // Cash Flow Score
  doc.setFillColor(255, 248, 240);
  doc.roundedRect(margin + scoreGridWidth * 2, scoreGridY, scoreGridWidth - 5, scoreGridHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Cash Flow', margin + scoreGridWidth * 2 + 5, scoreGridY + 10);
  doc.setFontSize(14);
  doc.text(`${analytics.score.cashFlow.toFixed(1)}`, margin + scoreGridWidth * 2 + 5, scoreGridY + 22);
  
  yPosition += scoreGridHeight + 20;

  // Key Investment Highlights Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Investment Highlights', margin, yPosition);
  yPosition += 15;
  
  // Create table for key highlights
  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value', 'Status']],
    body: [
      ['FIRB Status', eligibility.canPurchase ? 'Eligible to Purchase' : 'Review Required', eligibility.canPurchase ? '✅ Approved' : '⚠️ Review Required'],
      ['Gross Rental Yield', `${(analytics.rentalYield.gross * 100).toFixed(1)}%`, analytics.rentalYield.gross > 0.05 ? '📈 Good' : '📉 Below Average'],
      ['Monthly Cash Flow', fmt.currency(analytics.cashFlow.monthly.afterTaxCashFlow), analytics.cashFlow.monthly.afterTaxCashFlow >= 0 ? '✅ Positive' : '⚠️ Negative'],
      ['Total Investment', fmt.currency(costs.totalInvestmentCost), '💰 Total Cost']
    ],
    styles: {
      fontSize: 10,
      cellPadding: 8,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
  doc.setTextColor(0, 0, 0);

  // Property Details
  addSectionHeader(safeTranslations.sections.propertyDetails);
  addToTOC('Property Investment Details', 1);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Property Information', 'Details']],
    body: [
      ['Address', formData.propertyAddress || 'Not specified'],
      ['Property Type', formData.propertyType?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'],
      ['State/Territory', formData.state || 'N/A'],
      [safeTranslations.labels.value, fmt.currency(formData.propertyValue || 0)],
      [safeTranslations.labels.deposit, `${formData.depositPercent}% (${fmt.currency((formData.propertyValue || 0) * (formData.depositPercent || 20) / 100)})`],
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 11 },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // FIRB Eligibility Assessment Section
  addSectionHeader('FIRB Eligibility Assessment');

  // FIRB Status Banner (matching website styling)
  let firbStatusColor: [number, number, number];
  let firbStatusText: string;
  let firbStatusDesc: string;

  if (!eligibility.canPurchase) {
    firbStatusColor = redColor; // Red for prohibited
    firbStatusText = 'PURCHASE PROHIBITED';
    firbStatusDesc = 'You are not eligible to purchase this property type';
  } else if (eligibility.requiresFIRB) {
    firbStatusColor = amberColor; // Amber for required
    firbStatusText = 'FIRB APPROVAL REQUIRED';
    firbStatusDesc = 'You must obtain FIRB approval before purchasing';
  } else {
    firbStatusColor = greenColor; // Green for not required
    firbStatusText = 'FIRB APPROVAL NOT REQUIRED';
    firbStatusDesc = 'You can purchase without FIRB approval';
  }

  doc.setFillColor(firbStatusColor[0], firbStatusColor[1], firbStatusColor[2]);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 18, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRB Eligibility Assessment', margin + 5, yPosition + 6);
  doc.setFontSize(14);
  doc.text(firbStatusText, pageWidth - margin - 5, yPosition + 10, { align: 'right' });
  
  yPosition += 22;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(firbStatusDesc, margin, yPosition);
  yPosition += 8;

  // FIRB Inputs Table
  autoTable(doc, {
    startY: yPosition,
    head: [['FIRB Assessment Inputs', 'Details']],
    body: [
      ['Citizenship Status', formatCitizenshipStatus(formData.citizenshipStatus)],
      ['Visa Type', formData.visaType || 'N/A'],
      ['Ordinarily Resident', formData.isOrdinarilyResident !== false ? 'Yes' : 'No'],
      ['Property Type', formatPropertyType(formData.propertyType)],
      ['Investment Property', formData.isFirstHome ? 'Principal Place of Residence' : 'Investment Property'],
      ['Entity Type', formatEntityType(formData.entityType)],
      ['Property Value', fmt.currency(formData.propertyValue || 0)],
      ['State/Territory', formData.state || 'N/A'],
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 11 },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // FIRB Requirements (if applicable)
  if (eligibility.requiresFIRB) {
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.text('FIRB Requirements:', margin, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    const requirements = [
      'Complete FIRB online application form',
      'Provide proof of identity (passport, visa documents)',
      'Provide evidence of funds for purchase',
      `Pay application fee: ${fmt.currency(costs.upfrontCosts.firbFee)}`,
      'Provide property details and contract information',
      'Ensure application is submitted before signing any contract'
    ];
    
    requirements.forEach(req => {
      doc.text(`• ${req}`, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // FIRB Restrictions (if any)
  if (eligibility.restrictions && eligibility.restrictions.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
    doc.text('Important Restrictions:', margin, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    eligibility.restrictions.forEach(restriction => {
      const lines = doc.splitTextToSize(`• ${restriction}`, pageWidth - 2 * margin - 10);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 4 + 2;
    });
    yPosition += 5;
  }

  // FIRB Recommendations (if any)
  if (eligibility.recommendations && eligibility.recommendations.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Recommendations:', margin, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    eligibility.recommendations.forEach(recommendation => {
      const lines = doc.splitTextToSize(`• ${recommendation}`, pageWidth - 2 * margin - 10);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 4 + 2;
    });
    yPosition += 5;
  }

  // Key Investment Metrics
  addSectionHeader(safeTranslations.sections.keyMetrics);
  addToTOC('Key Investment Metrics', 1);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value', 'Benchmark']],
        body: [
          ['Gross Rental Yield', fmt.percent(analytics.rentalYield.gross), analytics.rentalYield.comparison],
          ['Net Rental Yield', fmt.percent(analytics.rentalYield.net), 'After all expenses'],
          ['Annualized ROI', fmt.percent(analytics.roi.annualizedROI), analytics.roi.annualizedROI > 7.2 ? 'Beats ASX 200 (7.2% avg)' : 'Below ASX 200 (7.2% avg)'],
          ['Monthly Cash Flow', fmt.currency(analytics.cashFlow.monthly.afterTaxCashFlow), analytics.cashFlow.monthly.afterTaxCashFlow >= 0 ? 'Positive' : 'Negative (tax benefits applied)'],
        ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 11 },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Recommendation Summary
      checkPageBreak(40);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Investment Analysis Summary:', margin, yPosition);
      yPosition += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const recommendationLines = doc.splitTextToSize(analytics.recommendation.description, pageWidth - 2 * margin);
      doc.text(recommendationLines, margin, yPosition);
      yPosition += recommendationLines.length * 5 + 10;

      // Information Input Disclaimer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const disclaimerText = 'This analysis is based on the information provided and current market conditions. Results may vary based on actual property performance, market changes, and individual circumstances.';
      const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin);
      doc.text(disclaimerLines, margin, yPosition);
      yPosition += disclaimerLines.length * 4 + 5;

  addFooter();

  // =================
  // TABLE OF CONTENTS - Will be generated at the end with correct page numbers
  // =================

  // =================
  // PAGE 2: ENHANCED PROPERTY DETAILS
  // =================
  
  if (features.propertyDetails) {
    doc.addPage();
    yPosition = margin;
    addFooter();

    addSectionHeader('Property Investment Details');

    // Property Information Card
    autoTable(doc, {
      startY: yPosition,
      head: [['Property Information', 'Details']],
      body: [
        ['Property Address', formData.propertyAddress || 'Not specified'],
        ['Property Type', formatPropertyType(formData.propertyType)],
        ['Property Value', fmt.currency(formData.propertyValue || 0)],
        ['State/Territory', formData.state || 'N/A'],
      ],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, fontSize: 11 },
      styles: { fontSize: 10 },
      margin: { left: margin, right: margin },
    });

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

    // Buyer Information Card
    checkPageBreak(60);
    autoTable(doc, {
      startY: yPosition,
      head: [['Buyer Information', 'Details']],
      body: [
        ['Citizenship Status', formatCitizenshipStatus(formData.citizenshipStatus)],
        ['Visa Type', formData.visaType || 'N/A'],
        ['Entity Type', formatEntityType(formData.entityType)],
        ['First Home Buyer', formData.isFirstHome ? 'Yes' : 'No'],
        ['Ordinarily Resident', formData.isOrdinarilyResident ? 'Yes' : 'No'],
      ],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, fontSize: 11 },
      styles: { fontSize: 10 },
      margin: { left: margin, right: margin },
    });

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

    // Financial Structure Card
    checkPageBreak(60);
    const depositAmount = (formData.propertyValue || 0) * (formData.depositPercent || 20) / 100;
    const loanAmount = (formData.propertyValue || 0) - depositAmount;
    const lvr = 100 - (formData.depositPercent || 20);

    autoTable(doc, {
      startY: yPosition,
      head: [['Financial Structure', 'Details']],
      body: [
        ['Deposit Percentage', `${formData.depositPercent || 20}%`],
        ['Deposit Amount', fmt.currency(depositAmount)],
        ['Loan Amount', fmt.currency(loanAmount)],
        ['Loan-to-Value Ratio (LVR)', `${lvr}%`],
        ['Estimated Interest Rate', '6.5% (typical current rate)'],
      ],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, fontSize: 11 },
      styles: { fontSize: 10 },
      margin: { left: margin, right: margin },
    });

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

    // FIRB Eligibility Summary
    checkPageBreak(40);
    const statusColor = eligibility.canPurchase ? greenColor : amberColor;
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FIRB Eligibility Status', margin + 5, yPosition + 10);
    doc.setFontSize(18);
    doc.text(eligibility.canPurchase ? 'ELIGIBLE' : 'REVIEW REQUIRED', pageWidth - margin - 5, yPosition + 16, { align: 'right' });
    yPosition += 30;
    doc.setTextColor(0, 0, 0);

    // Eligibility details
    if (eligibility.requiresFIRB) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`FIRB Application Required: Yes`, margin, yPosition);
      yPosition += 6;
      doc.text(`Estimated FIRB Fee: ${fmt.currency(costs.upfrontCosts.firbFee)}`, margin, yPosition);
      yPosition += 6;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`FIRB Application Required: No`, margin, yPosition);
      yPosition += 10;
    }
  }

  // =================
  // PAGE 3: COST BREAKDOWN
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  if (features.costBreakdown) {
    addSectionHeader(safeTranslations.sections.costBreakdown);
    addToTOC('Cost Breakdown', 1);

        // Total Investment
        doc.setFillColor(220, 220, 220);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 3, 3, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Investment Required', margin + 5, yPosition + 6);
        doc.setFontSize(14);
        doc.text(fmt.currency(costs.totalInvestmentCost), pageWidth - margin - 5, yPosition + 10, { align: 'right' });
        yPosition += 20;

  // Upfront Costs Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Upfront Costs', margin, yPosition);
  yPosition += 7;

  autoTable(doc, {
    startY: yPosition,
    head: [['Cost Item', 'Amount']],
    body: [
      ['Property Price', fmt.currency(costs.upfrontCosts.propertyPrice)],
      ['FIRB Application Fee', fmt.currency(costs.upfrontCosts.firbFee)],
      ['Stamp Duty', fmt.currency(costs.upfrontCosts.stampDuty)],
      ['Foreign Buyer Surcharge', fmt.currency(costs.upfrontCosts.foreignSurcharge)],
      ['Legal Fees', fmt.currency(costs.upfrontCosts.legalFees)],
      ['Inspection Fees', fmt.currency(costs.upfrontCosts.inspectionFees)],
      ['Loan Costs', fmt.currency(costs.upfrontCosts.loanCosts)],
      ['TOTAL UPFRONT', fmt.currency(costs.upfrontCosts.total)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    footStyles: { fillColor: [200, 200, 200], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Ongoing Costs Table
  checkPageBreak(60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Ongoing Costs', margin, yPosition);
  yPosition += 7;

  autoTable(doc, {
    startY: yPosition,
    head: [['Cost Item', 'Annual Amount']],
    body: [
      ['Annual Land Tax', fmt.currency(costs.ongoingCosts.annualLandTax)],
      ['Council Rates', fmt.currency(costs.ongoingCosts.councilRates)],
      ['Insurance', fmt.currency(costs.ongoingCosts.insurance)],
      ['Maintenance', fmt.currency(costs.ongoingCosts.maintenance)],
      ['Vacancy Fee', fmt.currency(costs.ongoingCosts.vacancyFee)],
      ['TOTAL ANNUAL', fmt.currency(costs.ongoingCosts.total)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    footStyles: { fillColor: [200, 200, 200], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });
  } else {
    // Show upgrade prompt for cost breakdown
    addUpgradePrompt(
      'Cost Breakdown',
      'Get detailed cost analysis including FIRB fees, stamp duty, foreign surcharges, legal fees, and all ongoing costs with itemized breakdowns.'
    );
  }

  // =================
  // PAGE 4: INVESTMENT ANALYSIS
  // =================
  
  if (features.investmentAnalysis) {
    doc.addPage();
    yPosition = margin;
    addFooter();

    addSectionHeader(safeTranslations.sections.investmentPerformance);
    addToTOC('Investment Performance Analysis', 1);

  // Rental Analysis
  addToTOC('Rental Analysis', 2);
  autoTable(doc, {
    startY: yPosition,
    head: [['Rental Analysis', 'Value']],
    body: [
      ['Weekly Rent', fmt.currency(analytics.rentalYield.weeklyRent)],
      ['Annual Rent', fmt.currency(analytics.rentalYield.annualRent)],
      ['Vacancy Cost', fmt.currency(analytics.rentalYield.annualRent - analytics.rentalYield.effectiveRent)],
      ['Effective Annual Rent', fmt.currency(analytics.rentalYield.effectiveRent)],
      ['Gross Rental Yield', fmt.percent(analytics.rentalYield.gross)],
      ['Net Rental Yield', fmt.percent(analytics.rentalYield.net)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // ROI Metrics
  addToTOC('Return on Investment', 2);
  checkPageBreak(50);
  autoTable(doc, {
    startY: yPosition,
    head: [['Return on Investment', 'Value']],
    body: [
      ['Total ROI', fmt.percent(analytics.roi.totalROI)],
      ['Annualized ROI', fmt.percent(analytics.roi.annualizedROI)],
      ['Cash-on-Cash Return', fmt.percent(analytics.roi.cashOnCashReturn)],
      ['Total Return (Dollar)', fmt.currency(analytics.roi.totalReturn)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Capital Growth
  addToTOC('Capital Growth Projection', 2);
  checkPageBreak(50);
  autoTable(doc, {
    startY: yPosition,
    head: [['Capital Growth Projection', 'Value']],
    body: [
      ['Initial Property Value', fmt.currency(analytics.capitalGrowth.initialValue)],
      ['Estimated Value (Year ' + analytics.yearByYear.length + ')', fmt.currency(analytics.capitalGrowth.estimatedValueAtEnd)],
      ['Total Appreciation', fmt.currency(analytics.capitalGrowth.totalAppreciation)],
      ['Percentage Gain', fmt.percent(analytics.capitalGrowth.totalPercentageGain)],
      ['Annual Growth Rate', fmt.percent(analytics.capitalGrowth.annualGrowthRate)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Enhanced Investment Projection Summary
  checkPageBreak(80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Projection Summary', margin, yPosition);
  yPosition += 15;
  
  // Key Metrics Summary Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 3, 3, 'S');
  
  // Projection highlights
  const currentYear = analytics.yearByYear[0];
  const finalYear = analytics.yearByYear[analytics.yearByYear.length - 1];
  const totalAppreciation = finalYear.propertyValue - currentYear.propertyValue;
  const equityGained = finalYear.equity - currentYear.equity;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Property Value Growth: ${fmt.currency(currentYear.propertyValue)} to ${fmt.currency(finalYear.propertyValue)}`, margin + 5, yPosition + 12);
  doc.text(`Total Appreciation: ${fmt.currency(totalAppreciation)} (${fmt.percent(totalAppreciation / currentYear.propertyValue)})`, margin + 5, yPosition + 22);
  doc.text(`Equity Growth: ${fmt.currency(equityGained)} (${fmt.percent(equityGained / currentYear.equity)})`, margin + 5, yPosition + 32);
  doc.text(`Loan Reduction: ${fmt.currency(currentYear.loanBalance - finalYear.loanBalance)}`, margin + 5, yPosition + 42);
  
  yPosition += 70;
  } else {
    // Show upgrade prompt for investment analysis
    addUpgradePrompt(
      'Investment Analysis',
      'Get detailed investment performance analysis including rental yields, ROI metrics, capital growth projections, and comprehensive financial modeling.'
    );
  }

  // =================
  // PAGE 5: CASH FLOW ANALYSIS
  // =================
  
  if (features.investmentAnalysis) {
    doc.addPage();
    yPosition = margin;
    addFooter();

    addSectionHeader(safeTranslations.sections.cashFlow);
    addToTOC('Cash Flow Analysis', 2);

  // Annual Cash Flow
  autoTable(doc, {
    startY: yPosition,
    head: [['Income & Expenses', 'Annual Amount']],
    body: [
      ['Rental Income', fmt.currency(analytics.cashFlow.annual.rentalIncome)],
      ['Vacancy Cost', fmt.currency(-analytics.cashFlow.annual.vacancyCost)],
      ['Effective Income', fmt.currency(analytics.cashFlow.annual.effectiveIncome)],
      ['', ''],
      ['Loan Repayments', fmt.currency(-analytics.cashFlow.annual.loanRepayments)],
      ['Property Management', fmt.currency(-analytics.cashFlow.annual.propertyManagement)],
      ['Maintenance', fmt.currency(-analytics.cashFlow.annual.maintenance)],
      ['Council Rates', fmt.currency(-analytics.cashFlow.annual.councilRates)],
      ['Insurance', fmt.currency(-analytics.cashFlow.annual.insurance)],
      ['Land Tax', fmt.currency(-analytics.cashFlow.annual.landTax)],
      ['Strata Fees', fmt.currency(-analytics.cashFlow.annual.strataFees)],
      ['Other Expenses', fmt.currency(-analytics.cashFlow.annual.otherExpenses)],
      ['Total Expenses', fmt.currency(-analytics.cashFlow.annual.totalExpenses)],
      ['', ''],
      ['Net Cash Flow (Before Tax)', fmt.currency(analytics.cashFlow.annual.netCashFlow)],
      ['Tax Benefit', fmt.currency(analytics.cashFlow.annual.taxBenefit)],
      ['Net Cash Flow (After Tax)', fmt.currency(analytics.cashFlow.annual.afterTaxCashFlow)],
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor },
    bodyStyles: { fontSize: 9 },
    styles: {
      cellPadding: 2,
    },
    didParseCell: function(data) {
      // Highlight total rows
      if (data.row.index === 3 || data.row.index === 13 || data.row.index === 16) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Monthly Summary
  checkPageBreak(30);
  doc.setFillColor(220, 220, 240);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly Cash Flow:', margin + 5, yPosition + 8);
  doc.text(fmt.currency(analytics.cashFlow.monthly.netCashFlow), margin + 5, yPosition + 15);
  doc.text('After-Tax Monthly:', pageWidth / 2 + 10, yPosition + 8);
  doc.text(fmt.currency(analytics.cashFlow.monthly.afterTaxCashFlow), pageWidth / 2 + 10, yPosition + 15);

  // Enhanced Cash Flow Summary
  yPosition += 25;
  checkPageBreak(80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Cash Flow Analysis Summary', margin, yPosition);
  yPosition += 15;
  
  // Cash Flow Summary Box
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 3, 3, 'F');
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 3, 3, 'S');
  
  // Cash flow highlights with progress bars
  const monthlyRent = analytics.cashFlow.annual.rentalIncome / 12;
  const monthlyExpenses = analytics.cashFlow.annual.totalExpenses / 12;
  const netCashFlow = analytics.cashFlow.monthly.afterTaxCashFlow;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Monthly Rental Income: ${fmt.currency(monthlyRent)}`, margin + 5, yPosition + 12);
  doc.text(`Monthly Expenses: ${fmt.currency(monthlyExpenses)}`, margin + 5, yPosition + 22);
  
  // Visual progress bar for cash flow
  const cashFlowStatus = netCashFlow >= 0 ? 'Positive' : 'Negative';
  const progressBar = netCashFlow >= 0 ? '██████████' : '░░░░░░░░░░';
  
  doc.text(`Net Monthly Cash Flow: ${fmt.currency(netCashFlow)} (${cashFlowStatus})`, margin + 5, yPosition + 32);
  doc.text(`Cash Flow Status: ${progressBar} ${cashFlowStatus}`, margin + 5, yPosition + 42);
  
  yPosition += 70;
  } else {
    // Show upgrade prompt for cash flow analysis
    addUpgradePrompt(
      'Cash Flow Analysis',
      'Get detailed cash flow analysis including monthly and annual projections, tax benefits, and comprehensive income vs expense breakdowns.'
    );
  }

  // =================
  // PAGE 6: 10-YEAR PROJECTIONS
  // =================
  
  if (features.projections) {
    doc.addPage();
    yPosition = margin;
    addFooter();

    addSectionHeader(safeTranslations.sections.projections);
    addToTOC('10-Year Projections', 1);

  // Year-by-Year Table (first 10 years)
  const projectionData = analytics.yearByYear.slice(0, 10).map(year => [
    `Year ${year.year}`,
    fmt.currency(year.propertyValue),
    fmt.currency(year.loanBalance),
    fmt.currency(year.equity),
    fmt.currency(year.afterTaxCashFlow),
    fmt.currency(year.cumulativeReturn),
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Year', 'Property Value', 'Loan Balance', 'Equity', 'Cash Flow', 'Cumulative']],
    body: projectionData,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    styles: {
      cellPadding: 1.5,
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Break-Even Analysis
  checkPageBreak(40);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Break-Even Analysis', margin + 5, yPosition + 8);
  yPosition += 12;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (analytics.breakEven.yearsToCumulativeBreakEven) {
    doc.text(`• Cumulative Break-Even: Year ${analytics.breakEven.yearsToCumulativeBreakEven}`, margin + 5, yPosition);
    yPosition += 6;
  }
  if (analytics.breakEven.yearsToPositiveCashFlow) {
    doc.text(`• Positive Cash Flow: Year ${analytics.breakEven.yearsToPositiveCashFlow}`, margin + 5, yPosition);
    yPosition += 6;
  }
  doc.text(`• Total Cash Required: ${fmt.currency(analytics.breakEven.totalCashRequired)}`, margin + 5, yPosition);
  } else {
    // Show upgrade prompt for projections
    addUpgradePrompt(
      '10-Year Projections',
      'Get detailed 10-year projections including property value growth, loan balance reduction, equity building, and break-even analysis.'
    );
  }

  // =================
  // PAGE 7: COMPARISONS & SCENARIOS
  // =================
  
  if (features.comparisons) {
    doc.addPage();
    yPosition = margin;
    addFooter();

    addSectionHeader(safeTranslations.sections.comparison);
    addToTOC('Investment Comparison', 1);

  // Comparison Table
  autoTable(doc, {
    startY: yPosition,
    head: [['Investment Type', 'Annual Rate', `${analytics.yearByYear.length}-Year Return`]],
    body: [
      ['Property Investment', fmt.percent(analytics.comparisons.propertyInvestment.annualizedReturn), fmt.currency(analytics.comparisons.propertyInvestment.totalReturn)],
      ['ASX 200 Stocks', fmt.percent(analytics.comparisons.asxStocks.rate), fmt.currency(analytics.comparisons.asxStocks.totalReturn)],
      ['Term Deposit', fmt.percent(analytics.comparisons.termDeposit.rate), fmt.currency(analytics.comparisons.termDeposit.totalReturn)],
      ['Government Bonds', fmt.percent(analytics.comparisons.governmentBonds.rate), fmt.currency(analytics.comparisons.governmentBonds.totalReturn)],
      ['High-Int. Savings', fmt.percent(analytics.comparisons.highInterestSavings.rate), fmt.currency(analytics.comparisons.highInterestSavings.totalReturn)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    didParseCell: function(data) {
      if (data.row.index === 0) {
        data.cell.styles.fillColor = [230, 240, 255];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Enhanced Investment Comparison Summary
  checkPageBreak(80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Performance Comparison', margin, yPosition);
  yPosition += 15;
  
  // Comparison Summary Box with visual rankings
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 80, 3, 3, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 80, 3, 3, 'S');
  
  // Performance rankings with visual indicators
  const propertyReturn = analytics.comparisons.propertyInvestment.annualizedReturn;
  const asxReturn = analytics.comparisons.asxStocks.rate;
  const termDepositReturn = analytics.comparisons.termDeposit.rate;
  
  // Create visual progress bars for each investment type
  const propertyBar = '█'.repeat(Math.min(10, Math.floor(propertyReturn * 10))) + '░'.repeat(10 - Math.min(10, Math.floor(propertyReturn * 10)));
  const asxBar = '█'.repeat(Math.min(10, Math.floor(asxReturn * 10))) + '░'.repeat(10 - Math.min(10, Math.floor(asxReturn * 10)));
  const termBar = '█'.repeat(Math.min(10, Math.floor(termDepositReturn * 10))) + '░'.repeat(10 - Math.min(10, Math.floor(termDepositReturn * 10)));
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Property Investment: ${fmt.percent(propertyReturn)}`, margin + 5, yPosition + 12);
  doc.text(`Performance: ${propertyBar} ${propertyReturn > asxReturn ? 'BEST' : propertyReturn > termDepositReturn ? 'GOOD' : 'FAIR'}`, margin + 5, yPosition + 22);
  
  doc.text(`ASX 200 Stocks: ${fmt.percent(asxReturn)}`, margin + 5, yPosition + 32);
  doc.text(`Performance: ${asxBar} ${asxReturn > propertyReturn ? 'BEST' : asxReturn > termDepositReturn ? 'GOOD' : 'FAIR'}`, margin + 5, yPosition + 42);
  
  doc.text(`Term Deposit: ${fmt.percent(termDepositReturn)}`, margin + 5, yPosition + 52);
  doc.text(`Performance: ${termBar} ${termDepositReturn > propertyReturn ? 'BEST' : termDepositReturn > asxReturn ? 'GOOD' : 'FAIR'}`, margin + 5, yPosition + 62);
  
  yPosition += 90;

  // Sensitivity Analysis
  checkPageBreak(80);
  addSectionHeader(safeTranslations.sections.sensitivity);
  addToTOC('Sensitivity & Risk Analysis', 1);

  // Vacancy Impact
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Vacancy Rate Impact:', margin, yPosition);
  yPosition += 7;

  autoTable(doc, {
    startY: yPosition,
    head: [['Vacancy Rate', 'Annual Rent', 'Net Cash Flow', 'Impact']],
    body: analytics.sensitivity.vacancyImpact.map(s => [
      fmt.percent(s.rate),
      fmt.currency(s.annualRent),
      fmt.currency(s.netCashFlow),
      s.rate === 5 ? 'Base Case' : fmt.currency(s.impact),
    ]),
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Interest Rate Impact
  checkPageBreak(60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Interest Rate Impact:', margin, yPosition);
  yPosition += 7;

  autoTable(doc, {
    startY: yPosition,
    head: [['Interest Rate', 'Monthly Repayment', 'Annual Cost', 'Impact']],
    body: analytics.sensitivity.interestRateImpact.map(s => [
      fmt.percent(s.rate),
      fmt.currency(s.monthlyRepayment),
      fmt.currency(s.annualCost),
      s.rate === 6.5 ? 'Base Case' : fmt.currency(s.impact),
    ]),
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });
  } else {
    // Show upgrade prompt for comparisons and sensitivity analysis
    addUpgradePrompt(
      'Investment Comparisons & Sensitivity Analysis',
      'Get comprehensive investment comparisons against other asset classes and detailed sensitivity analysis showing how changes in key variables affect your returns.'
    );
  }

  // =================
  // PAGE 8: TAX ANALYSIS & RECOMMENDATIONS
  // =================
  
  if (features.taxAnalysis) {
    doc.addPage();
    yPosition = margin;
    addFooter();

    addSectionHeader(safeTranslations.sections.taxAnalysis);
    addToTOC('Tax Analysis & Planning', 1);

  // Tax Deductions
  const taxDeductions = analytics.taxAnalysis.annualDeductions;
  const deductionRows = [
    ['Loan Interest', fmt.currency(taxDeductions.loanInterest)],
    ['Property Management', fmt.currency(taxDeductions.propertyManagement)],
    ['Maintenance', fmt.currency(taxDeductions.maintenance)],
    ['Land Tax', fmt.currency(taxDeductions.landTax)],
    ['Council Rates', fmt.currency(taxDeductions.councilRates)],
    ['Insurance', fmt.currency(taxDeductions.insurance)],
    ['Strata Fees', fmt.currency(taxDeductions.strataFees)],
    ['Depreciation', fmt.currency(taxDeductions.depreciation)],
    ['Other', fmt.currency(taxDeductions.other)],
    ['TOTAL DEDUCTIONS', fmt.currency(taxDeductions.total)],
  ].filter(row => row[0] === 'TOTAL DEDUCTIONS' || parseFloat(row[1].replace(/[^0-9.-]/g, '')) > 0);

  autoTable(doc, {
    startY: yPosition,
    head: [['Annual Tax Deductions', 'Amount']],
    body: deductionRows,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    footStyles: { fillColor: [200, 240, 200], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Tax Benefit Summary
  checkPageBreak(25);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 18, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Tax Saving (Negative Gearing):', margin + 5, yPosition + 8);
  doc.setFontSize(16);
  doc.text(fmt.currency(analytics.taxAnalysis.annualTaxSaving), pageWidth - margin - 5, yPosition + 12, { align: 'right' });
  yPosition += 25;

  // CGT on Exit
  checkPageBreak(60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Capital Gains Tax on Exit (Estimated):', margin, yPosition);
  yPosition += 7;

  const cgt = analytics.taxAnalysis.cgtOnExit;
  autoTable(doc, {
    startY: yPosition,
    body: [
      ['Sale Price', fmt.currency(cgt.salePrice)],
      ['Cost Base', fmt.currency(cgt.costBase)],
      ['Capital Gain', fmt.currency(cgt.capitalGain)],
      ['CGT Rate (Foreign Resident)', fmt.percent(cgt.cgtRate)],
      ['CGT Amount', fmt.currency(cgt.cgtAmount)],
      ['Withholding Tax', fmt.currency(cgt.withholdingTax)],
      ['Net Proceeds After Tax', fmt.currency(cgt.netProceedsAfterTax)],
    ],
    theme: 'plain',
    styles: { fontSize: 10 },
    didParseCell: function(data) {
      if (data.row.index === 6) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // Final Recommendation
  checkPageBreak(60);
  addSectionHeader(safeTranslations.sections.recommendations);
  addToTOC('Investment Score & Recommendations', 1);

  // Verdict
  const scoreColor = primaryColor; // Use consistent blue for verdict
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analytics.recommendation.verdict.toUpperCase()} - Score: ${analytics.score.overall.toFixed(1)}/10`, pageWidth / 2, yPosition + 10, { align: 'center' });
  yPosition += 20;
  doc.setTextColor(0, 0, 0);

  // Strengths
  if (analytics.recommendation.strengths.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('✓ Strengths:', margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.setFontSize(9);
    analytics.recommendation.strengths.forEach(strength => {
      const lines = doc.splitTextToSize(`• ${strength}`, pageWidth - 2 * margin - 10);
      checkPageBreak(lines.length * 5 + 2);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 5;
    });
    yPosition += 3;
  }

  // Weaknesses
  if (analytics.recommendation.weaknesses.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(redColor[0], redColor[1], redColor[2]);
    doc.text('✗ Weaknesses:', margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.setFontSize(9);
    analytics.recommendation.weaknesses.forEach(weakness => {
      const lines = doc.splitTextToSize(`• ${weakness}`, pageWidth - 2 * margin - 10);
      checkPageBreak(lines.length * 5 + 2);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 5;
    });
    yPosition += 3;
  }

  // Suitable For
  if (analytics.recommendation.suitableFor.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Suitable For:', margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.setFontSize(9);
    analytics.recommendation.suitableFor.forEach(profile => {
      const lines = doc.splitTextToSize(`• ${profile}`, pageWidth - 2 * margin - 10);
      checkPageBreak(lines.length * 5 + 2);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 5;
    });
  } else {
    // Show upgrade prompt for tax analysis and recommendations
    addUpgradePrompt(
      'Tax Analysis & Recommendations',
      'Get comprehensive tax analysis including annual deductions, CGT projections, and personalized investment recommendations with detailed scoring breakdown.'
    );
  }

  // =================
  // GLOSSARY OF TERMS (If enabled for tier)
  // =================
  
  if (features.glossary) {
    doc.addPage();
    yPosition = margin;
    addFooter();
    
    addSectionHeader('Glossary of Terms');
    addToTOC('Glossary of Terms', 1);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Definitions of technical terms and abbreviations used in this report', margin, yPosition);
    yPosition += 10;
    
    // Two-column layout for glossary
    const columnWidth = (pageWidth - 3 * margin) / 2;
    let leftColumnY = yPosition;
    let rightColumnY = yPosition;
    const lineHeight = 4;
    const termSpacing = 8;
    
    GLOSSARY_TERMS_ARRAY.forEach((item, index) => {
      const isLeftColumn = index % 2 === 0;
      const currentY = isLeftColumn ? leftColumnY : rightColumnY;
      const xPos = isLeftColumn ? margin : margin + columnWidth + margin;
      
      // Check if we need a page break
      if (currentY + 25 > pageHeight - 30) {
        doc.addPage();
        addFooter();
        yPosition = margin + 15;
        leftColumnY = yPosition;
        rightColumnY = yPosition;
        // Recalculate for new page
        const newCurrentY = isLeftColumn ? leftColumnY : rightColumnY;
        const newXPos = isLeftColumn ? margin : margin + columnWidth + margin;
        
        // Term heading
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0);
        const termLine = `${item.term} - ${item.fullName}`;
        const termLines = doc.splitTextToSize(termLine, columnWidth - 5);
        doc.text(termLines, newXPos, newCurrentY);
        
        // Definition
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60);
        const defLines = doc.splitTextToSize(item.definition, columnWidth - 5);
        doc.text(defLines, newXPos, newCurrentY + termLines.length * lineHeight + 2);
        
        // Update column positions
        const totalHeight = termLines.length * lineHeight + defLines.length * 3.5 + termSpacing;
        if (isLeftColumn) {
          leftColumnY += totalHeight;
        } else {
          rightColumnY += totalHeight;
        }
        return;
      }
      
      // Term heading
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0);
      const termLine = `${item.term} - ${item.fullName}`;
      const termLines = doc.splitTextToSize(termLine, columnWidth - 5);
      doc.text(termLines, xPos, currentY);
      
      // Definition
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60);
      const defLines = doc.splitTextToSize(item.definition, columnWidth - 5);
      doc.text(defLines, xPos, currentY + termLines.length * lineHeight + 2);
      
      // Update column positions
      const totalHeight = termLines.length * lineHeight + defLines.length * 3.5 + termSpacing;
      if (isLeftColumn) {
        leftColumnY += totalHeight;
      } else {
        rightColumnY += totalHeight;
      }
    });
  }

  // =================
  // FULL LEGAL DISCLAIMER PAGE (If enabled for tier)
  // =================
  
  if (features.disclaimer) {
    doc.addPage();
    yPosition = margin;
    addFooter();
    
    // Red warning banner at top
        doc.setFillColor(200, 200, 200);
        doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT LEGAL DISCLAIMER', pageWidth / 2, 18, { align: 'center' });
    
    yPosition = 45;
    doc.setTextColor(0, 0, 0);
    
    // Disclaimer sections
    const disclaimerSections = [
      {
        title: 'Not Financial Advice',
        text: `This report is provided for informational purposes only and does NOT constitute financial, investment, legal, or tax advice. The calculations and projections are estimates based on the information provided and current regulations as of ${formatDate(new Date(), locale === 'zh' ? 'zh-CN' : 'en-AU')}.`
      },
      {
        title: 'No Guarantee of Accuracy',
        text: 'While we strive for accuracy, we make no warranties or representations regarding the completeness, accuracy, or reliability of the information contained in this report. FIRB regulations, tax laws, and property market conditions are subject to change without notice.'
      },
      {
        title: 'Professional Advice Required',
        text: 'You MUST seek independent professional advice before making any property investment decisions. This includes consulting with: (1) Licensed financial advisors, (2) Qualified tax accountants, (3) Immigration lawyers (for visa matters), (4) Conveyancers or property lawyers, (5) FIRB specialists.'
      },
      {
        title: 'Market Performance Disclaimer',
        text: 'Past performance is not indicative of future results. Property values can go down as well as up. Rental income projections are estimates and may vary significantly based on market conditions, property condition, tenant quality, and vacancy rates.'
      },
      {
        title: 'FIRB Compliance Responsibility',
        text: 'You are solely responsible for ensuring compliance with all FIRB regulations and Australian foreign investment laws. Penalties for non-compliance can be severe, including fines up to $6.66M for individuals or $66.6M for corporations, imprisonment, and forced divestment.'
      },
      {
        title: 'Currency and Interest Rate Risk',
        text: 'Foreign investors face additional risks including currency fluctuation, changes in interest rates, and political/regulatory changes that may affect property ownership rights or taxation.'
      },
      {
        title: 'Limitation of Liability',
        text: 'To the maximum extent permitted by law, we exclude all liability for any loss or damage arising from reliance on this report or any actions taken based on its contents. Your use of this report is entirely at your own risk.'
      },
      {
        title: 'Data Sources & Updates',
        text: `This report uses data current as of ${formatDate(new Date(), locale === 'zh' ? 'zh-CN' : 'en-AU')}. Tax rates, FIRB fees, and regulations are subject to change. Always verify current rates with official government sources before proceeding with any transaction.`
      }
    ];
    
    disclaimerSections.forEach((section) => {
      checkPageBreak(35);
      
      // Section title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, margin, yPosition);
      yPosition += 6;
      
      // Section text
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(section.text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 5;
    });
    
    // Footer box with contact information
        checkPageBreak(30);
        yPosition = pageHeight - 50;
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        const footerText = 'For the most current information, please consult: (1) FIRB website: https://firb.gov.au, (2) ATO Foreign Investment: https://ato.gov.au/foreign-investment, (3) State Revenue Offices for stamp duty rates, (4) Licensed professionals for personalized advice. This calculator is provided by propertycosts.com.au';
        const footerLines = doc.splitTextToSize(footerText, pageWidth - 2 * margin - 10);
        doc.text(footerLines, margin + 5, yPosition + 7);
  }
  }

  // =================
  // GENERATE TABLE OF CONTENTS WITH CORRECT PAGE NUMBERS
  // =================
  if (tableOfContents.length > 0) {
    console.log('📋 Generating Table of Contents with', tableOfContents.length, 'sections');
    
    // Generate the TOC page
    generateTableOfContents();
    
    // Insert the TOC page after the executive summary (page 1)
    // We need to get all pages, insert the TOC, and reorder
    const totalPages = (doc as any).internal.getNumberOfPages();
    console.log('📄 Total pages before TOC insertion:', totalPages);
    
    // The TOC page was just added as the last page, we need to move it to position 2
    if (totalPages > 1) {
      // Get the TOC page content (last page)
      const tocPage = (doc as any).internal.getPage(totalPages);
      
      // Remove the TOC page from the end
      (doc as any).deletePage(totalPages);
      
      // Insert it as page 2
      (doc as any).insertPage(2, tocPage);
      
      console.log('📋 Table of Contents inserted at page 2');
    }
  } else {
    console.log('⚠️ No table of contents entries found');
  }

  // Return PDF as Blob
  return doc.output('blob');
}

