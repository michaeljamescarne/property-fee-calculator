/**
 * Enhanced FIRB PDF Generator with Investment Analytics
 * Fixed version without getCurrentY dependency
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import { FIRBCalculatorFormData } from '@/lib/validations/firb';
import type { InvestmentAnalytics } from '@/types/investment';
import type { PDFTranslations } from './pdfTranslations';
import { ContentTier } from './contentAccess';
import { mapAnalyticsToPDFData, type PDFReportData } from './dataMappers';
import {
  addCoverPage,
  addTableOfContents,
  addSectionHeader,
  addDataTable,
  addMetricCard,
  addAlertBox,
  addFooter,
  addPageBreak,
  formatCurrency,
  formatPercentage,
  COLORS,
  FONTS,
  SPACING
} from './templateHelpers';

export async function generateEnhancedPDF(
  formData: Partial<FIRBCalculatorFormData>,
  eligibility: EligibilityResult,
  costs: CostBreakdown,
  analytics: InvestmentAnalytics,
  _locale: string = 'en',
  _translations: PDFTranslations,
  _contentTier: ContentTier = 'premium'
): Promise<Blob> {
  console.log('🚀 Generating Enhanced PDF with template design -', new Date().toISOString());
  
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Map data to template format
  const reportData = mapAnalyticsToPDFData(formData, eligibility, costs, analytics);
  
  // Track Y position explicitly
  let currentY: number = SPACING.margin;
  
  // Generate report sections
  currentY = generateCoverPage(doc, reportData);
  currentY = generateExecutiveSummary(doc, reportData, currentY);
  currentY = generateTableOfContents(doc);
  currentY = generateFIRBEligibility(doc, reportData, currentY);
  currentY = generateInvestmentCosts(doc, reportData, currentY);
  currentY = generatePerformanceMetrics(doc, reportData, currentY);
  currentY = generateCashFlowAnalysis(doc, reportData, currentY);
  currentY = generateTaxAnalysis(doc, reportData, currentY);
  currentY = generateProjection(doc, reportData, currentY);
  currentY = generateSensitivityAnalysis(doc, reportData, currentY);
  currentY = generateCGTOnExit(doc, reportData, currentY);
  currentY = generateInvestmentScore(doc, reportData, currentY);
  currentY = generateGlossary(doc, currentY);
  generateDisclaimer(doc, currentY);

  // Return PDF as blob
  return doc.output('blob');
}

function generateCoverPage(doc: jsPDF, data: PDFReportData): number {
  const title = 'Property Investment Analysis Report';
  const generationDate = new Date().toLocaleDateString('en-AU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  return addCoverPage(doc, title, data.property.address, data.property.purchasePrice, generationDate);
}

function generateExecutiveSummary(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Executive Summary', 'Investment Overview & Key Metrics', startY);
  
  // Investment overview metric cards (2x4 grid)
  const cardStartY = currentY + 20;
  const cardWidth = 80;
  const cardHeight = 40;
  const cardSpacing = 10;
  const leftColumnX = SPACING.margin;
  const rightColumnX = SPACING.margin + cardWidth + cardSpacing;
  
  // Row 1
  addMetricCard(doc, 'Property Type', data.property.type, 'Property category', COLORS.gray[800], cardStartY, leftColumnX);
  addMetricCard(doc, 'Purchase Price', formatCurrency(data.property.purchasePrice), 'Initial property cost', COLORS.gray[800], cardStartY, rightColumnX);
  
  // Row 2
  addMetricCard(doc, 'Total Investment', formatCurrency(data.costs.totalInvestment), 'Including all costs', COLORS.gray[800], cardStartY + cardHeight + cardSpacing, leftColumnX);
  addMetricCard(doc, 'Gross Yield', formatPercentage(data.performance.grossYield), 'Annual rental income', COLORS.gray[800], cardStartY + cardHeight + cardSpacing, rightColumnX);
  
  // Row 3
  addMetricCard(doc, 'Net Yield', formatPercentage(data.performance.netYield), 'After expenses', COLORS.gray[800], cardStartY + 2 * (cardHeight + cardSpacing), leftColumnX);
  addMetricCard(doc, 'Annualized ROI', formatPercentage(data.performance.annualizedROI), 'Total return', COLORS.gray[800], cardStartY + 2 * (cardHeight + cardSpacing), rightColumnX);
  
  // Row 4
  addMetricCard(doc, 'Monthly Cash Flow', formatCurrency(data.performance.monthlyCashFlow), 'After tax', COLORS.gray[800], cardStartY + 3 * (cardHeight + cardSpacing), leftColumnX);
  addMetricCard(doc, 'Investment Verdict', data.score.verdict, 'Overall assessment', COLORS.primary, cardStartY + 3 * (cardHeight + cardSpacing), rightColumnX);

  // Key Strengths section
  const strengthsY = cardStartY + 4 * (cardHeight + cardSpacing) + 20;
  const strengthsCurrentY = addSectionHeader(doc, 'Key Strengths', '', strengthsY);
  
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'normal');
  doc.text('• Good capital growth potential', SPACING.margin, strengthsCurrentY + 10);
  doc.text('• Significant tax benefits', SPACING.margin, strengthsCurrentY + 25);

  // Key Weaknesses section
  const weaknessesY = strengthsCurrentY + 50;
  const weaknessesCurrentY = addSectionHeader(doc, 'Key Weaknesses', '', weaknessesY);
  
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'normal');
  doc.text('• Below average rental yield', SPACING.margin, weaknessesCurrentY + 10);
  doc.text('• Negative cash flow', SPACING.margin, weaknessesCurrentY + 25);

  // FIRB restrictions box
  const alertY = weaknessesCurrentY + 50;
  addAlertBox(doc, 
    'This property requires FIRB approval. Foreign buyers can only purchase new dwellings, vacant land for development, or off-the-plan properties. Established dwellings are prohibited for foreign buyers.',
    'warning',
    'FIRB Restrictions',
    alertY
  );

  return addPageBreak(doc);
}

function generateTableOfContents(doc: jsPDF): number {
  const currentY = addSectionHeader(doc, 'Table of Contents', 'Report Sections & Page Numbers', SPACING.margin);
  
  const sections = [
    { title: 'Executive Summary', page: 2 },
    { title: 'FIRB Eligibility Assessment', page: 4 },
    { title: 'Investment Cost Breakdown', page: 5 },
    { title: 'Performance Metrics', page: 6 },
    { title: 'Cash Flow Analysis', page: 7 },
    { title: 'Tax Analysis', page: 8 },
    { title: '10-Year Projection', page: 9 },
    { title: 'Sensitivity Analysis', page: 10 },
    { title: 'Capital Gains Tax (CGT) on Exit', page: 11 },
    { title: 'Investment Score Breakdown', page: 12 },
    { title: 'Glossary of Terms', page: 13 },
    { title: 'Disclaimer & Important Information', page: 15 }
  ];
  
  let yPosition = currentY + 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textMargin = SPACING.margin;
  const pageNumberWidth = 15;
  const leaderLineEnd = pageWidth - SPACING.margin - pageNumberWidth;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body);
  doc.setTextColor(COLORS.gray[800]);

  sections.forEach((section, index) => {
    if (yPosition > doc.internal.pageSize.getHeight() - SPACING.margin - 30) {
      doc.addPage();
      addFooter(doc);
      yPosition = SPACING.margin + 20;
    }

    const entryText = `${index + 1}. ${section.title}`;
    const pageNumText = `${section.page}`;

    // Calculate text width to determine leader line start
    const textWidth = doc.getTextWidth(entryText);
    const leaderLineStart = textMargin + textWidth + 2; // 2mm space after text

    // Draw the entry text
    doc.text(entryText, textMargin, yPosition);
    
    // Draw the page number (right-aligned)
    doc.text(pageNumText, pageWidth - SPACING.margin, yPosition, { align: 'right' });

    // Draw dotted leader line using small circles
    doc.setDrawColor(COLORS.gray[400]);
    doc.setLineWidth(0.5);
    
    // Draw dots along the line
    for (let x = leaderLineStart; x < leaderLineEnd; x += 2) {
      doc.circle(x, yPosition - 0.5, 0.3, 'F');
    }

    yPosition += 12; // Space for next entry
  });

  return addPageBreak(doc);
}

function generateFIRBEligibility(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'FIRB Eligibility', 'Foreign Investment Review Board Requirements', startY);
  
  // Eligibility table
  const eligibilityRows = [
    ['Citizenship Status', data.eligibility.citizenshipStatus],
    ['Visa Type', data.eligibility.visa],
    ['Property Use', data.eligibility.propertyUse],
    ['Purchasing Entity', data.eligibility.purchasingEntity],
    ['State/Territory', data.eligibility.stateTerritory],
    ['FIRB Status', data.eligibility.status]
  ];
  
  addDataTable(doc, ['Detail', 'Value'], eligibilityRows, currentY, {
    title: 'Eligibility Details',
    widths: [80, 60],
    align: ['left', 'left']
  });

  return addPageBreak(doc);
}

function generateInvestmentCosts(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Investment Costs', 'Complete Cost Breakdown', startY);
  
  // Total investment card
  addMetricCard(doc, 'Total Investment', formatCurrency(data.costs.totalInvestment), 'Including all costs', COLORS.primary, currentY);
  
  // Government fees table
  const governmentFeesRows = [
    ['FIRB Application Fee', formatCurrency(data.costs.firbFee)],
    ['Stamp Duty', formatCurrency(data.costs.stampDuty)],
    ['Foreign Buyer Surcharge', formatCurrency(data.costs.foreignBuyerSurcharge)],
    ['Total Government Fees', formatCurrency(data.costs.firbFee + data.costs.stampDuty + data.costs.foreignBuyerSurcharge)]
  ];
  
  addDataTable(doc, ['Fee Type', 'Amount'], governmentFeesRows, currentY + 50, {
    title: 'Government Fees',
    widths: [100, 40],
    align: ['left', 'right']
  });

  return addPageBreak(doc);
}

function generatePerformanceMetrics(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Performance Metrics', 'Rental Yield & Return Analysis', startY);
  
  // Metric cards
  addMetricCard(doc, 'Gross Yield', formatPercentage(data.performance.grossYield), 'Annual rental income / Property value', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Net Yield', formatPercentage(data.performance.netYield), 'After expenses', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Annualized ROI', formatPercentage(data.performance.annualizedROI), 'Total return', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Monthly Cash Flow', formatCurrency(data.performance.monthlyCashFlow), 'After tax', COLORS.gray[800], currentY);

  return addPageBreak(doc);
}

function generateCashFlowAnalysis(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Cash Flow Analysis', 'Income vs Expenses Breakdown', startY);
  
  // Summary cards
  addMetricCard(doc, 'Annual Income', formatCurrency(data.performance.annualIncome), 'Gross rental income', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Effective Income', formatCurrency(data.performance.effectiveIncome), 'After vacancy allowance', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Total Expenses', formatCurrency(data.performance.totalExpenses), 'All costs', COLORS.gray[800], currentY);

  return addPageBreak(doc);
}

function generateTaxAnalysis(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Tax Analysis', 'Deductions & Negative Gearing', startY);
  
  // Annual deductions table
  const deductionsRows = [
    ['Loan Interest', formatCurrency(data.taxBenefits.totalDeductions * 0.7)], // Estimate
    ['Council Rates', formatCurrency(data.ongoingCosts.councilRates)],
    ['Insurance', formatCurrency(data.ongoingCosts.insurance)],
    ['Maintenance', formatCurrency(data.ongoingCosts.maintenance)],
    ['Depreciation', formatCurrency(data.taxBenefits.totalDeductions * 0.1)], // Estimate
    ['Other Deductions', formatCurrency(data.taxBenefits.totalDeductions * 0.1)], // Estimate
    ['Total Deductions', formatCurrency(data.taxBenefits.totalDeductions)]
  ];
  
  addDataTable(doc, ['Deduction Type', 'Annual Amount'], deductionsRows, currentY, {
    title: 'Annual Deductions',
    widths: [100, 40],
    align: ['left', 'right']
  });

  return addPageBreak(doc);
}

function generateProjection(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, '10-Year Projection', 'Long-term Investment Outlook', startY);
  
  // Summary cards
  addMetricCard(doc, 'Starting Value', formatCurrency(data.projection.startingValue), 'Current property value', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Final Value', formatCurrency(data.projection.finalValue), `After ${data.projection.years} years`, COLORS.gray[800], currentY);
  addMetricCard(doc, 'Growth Rate', formatPercentage(data.projection.growthRate), 'Annual appreciation', COLORS.gray[800], currentY);
  addMetricCard(doc, 'Total ROI', formatPercentage(data.projection.totalROI), 'Overall return', COLORS.gray[800], currentY);

  return addPageBreak(doc);
}

function generateSensitivityAnalysis(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Sensitivity Analysis', 'Impact of Market Changes', startY);
  
  // Vacancy impact table
  const vacancyRows = data.sensitivity.vacancyImpact.map(impact => [
    `${impact.rate}%`,
    formatCurrency(impact.rent),
    formatCurrency(impact.cashFlow),
    formatCurrency(impact.impact)
  ]);
  
  addDataTable(doc, ['Vacancy Rate', 'Annual Rent', 'Cash Flow', 'Impact'], vacancyRows, currentY, {
    title: 'Vacancy Rate Impact',
    widths: [30, 40, 40, 30],
    align: ['center', 'right', 'right', 'right']
  });

  return addPageBreak(doc);
}

function generateCGTOnExit(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'CGT on Exit', 'Capital Gains Tax Calculation', startY);
  
  // Sale calculation table
  const saleRows = [
    ['Sale Price', formatCurrency(data.cgt.salePrice)],
    ['Original Purchase Price', formatCurrency(data.cgt.purchasePrice)],
    ['Purchase Costs', formatCurrency(data.cgt.purchaseCosts)],
    ['Selling Costs', formatCurrency(data.cgt.sellingCosts)],
    ['Cost Base', formatCurrency(data.cgt.costBase)],
    ['Capital Gain', formatCurrency(data.cgt.capitalGain)]
  ];
  
  addDataTable(doc, ['Item', 'Amount'], saleRows, currentY, {
    title: 'Sale Calculation',
    widths: [100, 40],
    align: ['left', 'right']
  });

  return addPageBreak(doc);
}

function generateInvestmentScore(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, 'Investment Score', 'Overall Assessment & Recommendation', startY);
  
  // Overall verdict card
  addMetricCard(doc, 'Overall Score', `${data.score.overall}/100`, data.score.verdict, COLORS.primary, currentY);
  
  // Score breakdown table
  const scoreRows = [
    ['Rental Yield', data.score.rentalYield],
    ['Capital Growth', data.score.capitalGrowth],
    ['Cash Flow', data.score.cashFlow],
    ['Tax Efficiency', data.score.taxEfficiency],
    ['Risk Profile', data.score.riskProfile],
    ['Overall Score', data.score.overall]
  ];
  
  addDataTable(doc, ['Category', 'Score'], scoreRows, currentY + 50, {
    title: 'Score Breakdown',
    widths: [100, 40],
    align: ['left', 'center']
  });

  return addPageBreak(doc);
}

function generateGlossary(doc: jsPDF, startY: number): number {
  const currentY = addSectionHeader(doc, 'Glossary', 'Key Terms & Definitions', startY);
  
  const glossaryTerms = [
    ['FIRB', 'Foreign Investment Review Board - Australian government body regulating foreign property investment'],
    ['Stamp Duty', 'State government tax on property purchases'],
    ['Foreign Buyer Surcharge', 'Additional stamp duty for non-resident buyers'],
    ['Gross Yield', 'Annual rental income divided by property value'],
    ['Net Yield', 'Annual rental income minus expenses, divided by property value'],
    ['Negative Gearing', 'When rental income is less than expenses, creating tax deductions'],
    ['Capital Gains Tax', 'Tax on profit from property sale'],
    ['Loan-to-Value Ratio', 'Loan amount as percentage of property value'],
    ['Vacancy Rate', 'Percentage of time property is unoccupied'],
    ['Capital Growth', 'Increase in property value over time']
  ];
  
  // Simple glossary display
  glossaryTerms.forEach((term, index) => {
    doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'bold');
    doc.text(term[0], SPACING.margin, currentY + (index * 15));
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.small);
    doc.text(term[1], SPACING.margin + 10, currentY + (index * 15) + 5);
  });

  return addPageBreak(doc);
}

function generateDisclaimer(doc: jsPDF, startY: number): void {
  addSectionHeader(doc, 'Disclaimer', 'Important Information', startY);
  
  const disclaimerText = `
This report is for informational purposes only and does not constitute financial, investment, or tax advice. 

Property investment involves significant risks including but not limited to:
• Market volatility and economic downturns
• Interest rate changes affecting loan costs
• Vacancy periods reducing rental income
• Unexpected maintenance and repair costs
• Changes in government policy and taxation
• Currency fluctuations for foreign investors

All calculations are estimates based on current market conditions and assumptions. Actual results may vary significantly. 

Before making any investment decisions, you should:
• Consult with qualified financial advisors
• Obtain professional property valuations
• Review all legal and tax implications
• Consider your personal financial situation
• Understand all costs and risks involved

The information in this report is current as of the generation date but may become outdated. Always verify current regulations, rates, and market conditions.

Foreign investment in Australian property is subject to FIRB regulations which may change. Ensure compliance with all applicable laws and regulations.

This report does not guarantee investment performance or returns. Past performance is not indicative of future results.
  `.trim();
  
  doc.setFontSize(FONTS.small);
        doc.setFont('helvetica', 'normal');
  doc.text(disclaimerText, SPACING.margin, startY + 40, {
    maxWidth: doc.internal.pageSize.getWidth() - (SPACING.margin * 2),
    align: 'justify'
  });

  addFooter(doc);
}