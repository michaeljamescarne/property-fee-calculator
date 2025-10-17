/**
 * Enhanced FIRB PDF Generator with Investment Analytics
 * Template-based implementation matching exact design specifications
 * 
 * Previous implementation preserved in git history for reference
 * This version uses template helpers and data mappers for consistency
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

// Helper function to get current Y position from jsPDF
function getCurrentY(doc: jsPDF): number {
  return (doc as unknown as { getCurrentY(): number }).getCurrentY();
}

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
  
  // Generate report sections
  generateCoverPage(doc, reportData);
  generateExecutiveSummary(doc, reportData);
  generateTableOfContents(doc);
  generateFIRBEligibility(doc, reportData);
  generateInvestmentCosts(doc, reportData);
  generatePerformanceMetrics(doc, reportData);
  generateCashFlowAnalysis(doc, reportData);
  generateTaxAnalysis(doc, reportData);
  generateProjection(doc, reportData);
  generateSensitivityAnalysis(doc, reportData);
  generateCGTOnExit(doc, reportData);
  generateInvestmentScore(doc, reportData);
  generateGlossary(doc);
  generateDisclaimer(doc);

  // Return PDF as blob
  return doc.output('blob');
}

function generateCoverPage(doc: jsPDF, data: PDFReportData): void {
  const title = 'Australian Property Investment Analysis Report';
  const generationDate = new Date().toLocaleDateString('en-AU');
  
  addCoverPage(doc, title, data.property.address, data.property.purchasePrice, generationDate);
}

function generateExecutiveSummary(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Executive Summary', 'Investment Overview & Key Metrics');
  
  // Investment overview table
  const overviewRows = [
    ['Property Type', data.property.type],
    ['Purchase Price', formatCurrency(data.property.purchasePrice)],
    ['Total Investment Required', formatCurrency(data.costs.totalInvestment)],
    ['Gross Rental Yield', formatPercentage(data.performance.grossYield)],
    ['Net Rental Yield', formatPercentage(data.performance.netYield)],
    ['Annualized ROI', formatPercentage(data.performance.annualizedROI)],
    ['Monthly Cash Flow', formatCurrency(data.performance.monthlyCashFlow)],
    ['Investment Verdict', data.score.verdict]
  ];
  
  addDataTable(doc, ['Metric', 'Value'], overviewRows, {
    title: 'Investment Overview',
    widths: [80, 60],
    align: ['left', 'right']
  });

  // Strengths and weaknesses
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Strengths:', SPACING.margin, getCurrentY(doc) + 10);
  
  doc.setFont('helvetica', 'normal');
  data.score.strengths.forEach((strength) => {
    doc.text(`• ${strength}`, SPACING.margin + 10, getCurrentY(doc) + 5);
  });

  doc.text('Areas of Concern:', SPACING.margin, getCurrentY(doc) + 10);
  data.score.weaknesses.forEach((weakness) => {
    doc.text(`• ${weakness}`, SPACING.margin + 10, getCurrentY(doc) + 5);
  });

  // FIRB restrictions box
  addAlertBox(doc, 
    'This property requires FIRB approval. Foreign buyers can only purchase new dwellings, vacant land for development, or off-the-plan properties. Established dwellings are prohibited for foreign buyers.',
    'info',
    'FIRB Restrictions'
  );

  // Negative gearing warning
  if (data.performance.monthlyCashFlow < 0) {
    addAlertBox(doc,
      'This investment generates negative cash flow. You will need to fund the shortfall from other sources. Consider the impact on your overall financial position.',
      'warning',
      'Negative Cash Flow Warning'
    );
  }

  addPageBreak(doc);
}

function generateTableOfContents(doc: jsPDF): void {
  const sections = [
    { title: 'Executive Summary', page: 2 },
    { title: 'FIRB Eligibility', page: 4 },
    { title: 'Investment Costs', page: 5 },
    { title: 'Performance Metrics', page: 6 },
    { title: 'Cash Flow Analysis', page: 7 },
    { title: 'Tax Analysis', page: 8 },
    { title: '10-Year Projection', page: 9 },
    { title: 'Sensitivity Analysis', page: 10 },
    { title: 'CGT on Exit', page: 11 },
    { title: 'Investment Score', page: 12 },
    { title: 'Glossary', page: 13 },
    { title: 'Disclaimer', page: 15 }
  ];
  
  addTableOfContents(doc, sections);
}

function generateFIRBEligibility(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'FIRB Eligibility', 'Foreign Investment Review Board Requirements');
  
  // Eligibility table
  const eligibilityRows = [
    ['Citizenship Status', data.eligibility.citizenshipStatus],
    ['Visa Type', data.eligibility.visa],
    ['Property Use', data.eligibility.propertyUse],
    ['Purchasing Entity', data.eligibility.purchasingEntity],
    ['State/Territory', data.eligibility.stateTerritory],
    ['FIRB Status', data.eligibility.status]
  ];
  
  addDataTable(doc, ['Detail', 'Value'], eligibilityRows, {
    title: 'Eligibility Details',
    widths: [80, 60],
    align: ['left', 'left']
  });

  // Restriction notice
  addAlertBox(doc,
    'Foreign buyers are restricted to new dwellings, vacant land for development, and off-the-plan properties. Established dwellings are prohibited.',
    'info',
    'Property Type Restrictions'
  );

  addPageBreak(doc);
}

function generateInvestmentCosts(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Investment Costs', 'Complete Cost Breakdown');
  
  // Total investment card
  addMetricCard(doc, 'Total Investment', formatCurrency(data.costs.totalInvestment), 'Including all costs', COLORS.primary);
  
  // Purchase price
  addMetricCard(doc, 'Purchase Price', formatCurrency(data.costs.purchasePrice), 'Property value');
  
  // Government fees table
  const governmentFeesRows = [
    ['FIRB Application Fee', formatCurrency(data.costs.firbFee)],
    ['Stamp Duty', formatCurrency(data.costs.stampDuty)],
    ['Foreign Buyer Surcharge', formatCurrency(data.costs.foreignBuyerSurcharge)],
    ['Total Government Fees', formatCurrency(data.costs.firbFee + data.costs.stampDuty + data.costs.foreignBuyerSurcharge)]
  ];
  
  addDataTable(doc, ['Fee Type', 'Amount'], governmentFeesRows, {
    title: 'Government Fees',
    widths: [100, 40],
    align: ['left', 'right']
  });

  // Professional fees table
  const professionalFeesRows = [
    ['Legal & Conveyancing', formatCurrency(data.costs.legalFees)],
    ['Building & Pest Inspection', formatCurrency(data.costs.inspectionFees)],
    ['Loan Establishment', formatCurrency(data.costs.loanEstablishment)],
    ['Total Professional Fees', formatCurrency(data.costs.legalFees + data.costs.inspectionFees + data.costs.loanEstablishment)]
  ];
  
  addDataTable(doc, ['Fee Type', 'Amount'], professionalFeesRows, {
    title: 'Professional Fees',
    widths: [100, 40],
    align: ['left', 'right']
  });

  addPageBreak(doc);
}

function generatePerformanceMetrics(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Performance Metrics', 'Rental Yield & Return Analysis');
  
  // Metric cards
  addMetricCard(doc, 'Gross Yield', formatPercentage(data.performance.grossYield), 'Annual rental income / Property value');
  addMetricCard(doc, 'Net Yield', formatPercentage(data.performance.netYield), 'After expenses');
  addMetricCard(doc, 'Annualized ROI', formatPercentage(data.performance.annualizedROI), 'Total return');
  addMetricCard(doc, 'Monthly Cash Flow', formatCurrency(data.performance.monthlyCashFlow), 'After tax');

  // Ongoing costs table
  const ongoingCostsRows = [
    ['Council Rates', formatCurrency(data.ongoingCosts.councilRates)],
    ['Insurance', formatCurrency(data.ongoingCosts.insurance)],
    ['Maintenance', formatCurrency(data.ongoingCosts.maintenance)],
    ['Total Annual Costs', formatCurrency(data.ongoingCosts.total)]
  ];
  
  addDataTable(doc, ['Cost Type', 'Annual Amount'], ongoingCostsRows, {
    title: 'Ongoing Costs',
    widths: [100, 40],
    align: ['left', 'right']
  });

  addPageBreak(doc);
}

function generateCashFlowAnalysis(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Cash Flow Analysis', 'Income vs Expenses Breakdown');
  
  // Summary cards
  addMetricCard(doc, 'Annual Income', formatCurrency(data.performance.annualIncome), 'Gross rental income');
  addMetricCard(doc, 'Effective Income', formatCurrency(data.performance.effectiveIncome), 'After vacancy allowance');
  addMetricCard(doc, 'Total Expenses', formatCurrency(data.performance.totalExpenses), 'All costs');

  // Expense breakdown table
  const expenseRows = [
    ['Loan Interest', formatCurrency(data.performance.totalExpenses * 0.6)], // Estimate
    ['Council Rates', formatCurrency(data.ongoingCosts.councilRates)],
    ['Insurance', formatCurrency(data.ongoingCosts.insurance)],
    ['Maintenance', formatCurrency(data.ongoingCosts.maintenance)],
    ['Property Management', formatCurrency(data.performance.totalExpenses * 0.1)], // Estimate
    ['Other Expenses', formatCurrency(data.performance.totalExpenses * 0.1)] // Estimate
  ];
  
  addDataTable(doc, ['Expense Type', 'Annual Amount'], expenseRows, {
    title: 'Expense Breakdown',
    widths: [100, 40],
    align: ['left', 'right']
  });

  // Tax benefit box
  if (data.taxBenefits.annualSaving > 0) {
    addAlertBox(doc,
      `This investment provides tax benefits of ${formatCurrency(data.taxBenefits.annualSaving)} annually through negative gearing. This reduces your overall tax liability.`,
      'success',
      'Tax Benefits'
    );
  }

  addPageBreak(doc);
}

function generateTaxAnalysis(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Tax Analysis', 'Deductions & Negative Gearing');
  
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
  
  addDataTable(doc, ['Deduction Type', 'Annual Amount'], deductionsRows, {
    title: 'Annual Deductions',
    widths: [100, 40],
    align: ['left', 'right']
  });

  // Negative gearing calculation
  const negativeGearingRows = [
    ['Rental Income', formatCurrency(data.performance.effectiveIncome)],
    ['Total Deductions', formatCurrency(data.taxBenefits.totalDeductions)],
    ['Taxable Loss', formatCurrency(data.taxBenefits.totalDeductions - data.performance.effectiveIncome)],
    ['Tax Saving (37% marginal rate)', formatCurrency(data.taxBenefits.annualSaving)],
    ['Net Cash Flow Impact', formatCurrency(data.performance.afterTaxCashFlow)]
  ];
  
  addDataTable(doc, ['Item', 'Amount'], negativeGearingRows, {
    title: 'Negative Gearing Calculation',
    widths: [100, 40],
    align: ['left', 'right']
  });

  // Tax note
  addAlertBox(doc,
    'Tax benefits depend on your marginal tax rate and overall financial situation. Consult a tax professional for personalized advice.',
    'info',
    'Tax Advice'
  );

  addPageBreak(doc);
}

function generateProjection(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, '10-Year Projection', 'Long-term Investment Outlook');
  
  // Summary cards
  addMetricCard(doc, 'Starting Value', formatCurrency(data.projection.startingValue), 'Current property value');
  addMetricCard(doc, 'Final Value', formatCurrency(data.projection.finalValue), `After ${data.projection.years} years`);
  addMetricCard(doc, 'Growth Rate', formatPercentage(data.projection.growthRate), 'Annual appreciation');
  addMetricCard(doc, 'Total ROI', formatPercentage(data.projection.totalROI), 'Overall return');

  // Year-by-year projection (simplified - showing key years)
  const projectionRows = [
    ['Year 1', formatCurrency(data.projection.startingValue * 1.05), formatCurrency(data.projection.startingValue * 0.2)],
    ['Year 3', formatCurrency(data.projection.startingValue * 1.16), formatCurrency(data.projection.startingValue * 0.25)],
    ['Year 5', formatCurrency(data.projection.startingValue * 1.28), formatCurrency(data.projection.startingValue * 0.3)],
    ['Year 7', formatCurrency(data.projection.startingValue * 1.41), formatCurrency(data.projection.startingValue * 0.35)],
    ['Year 10', formatCurrency(data.projection.finalValue), formatCurrency(data.projection.equity)]
  ];
  
  addDataTable(doc, ['Year', 'Property Value', 'Equity'], projectionRows, {
    title: 'Year-by-Year Projection',
    widths: [30, 60, 50],
    align: ['center', 'right', 'right']
  });

  // Growth warning
  addAlertBox(doc,
    'Property values can fluctuate significantly. Past performance does not guarantee future results. Consider market volatility and economic conditions.',
    'warning',
    'Growth Assumptions'
  );

  addPageBreak(doc);
}

function generateSensitivityAnalysis(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Sensitivity Analysis', 'Impact of Market Changes');
  
  // Vacancy impact table
  const vacancyRows = data.sensitivity.vacancyImpact.map(impact => [
    `${impact.rate}%`,
    formatCurrency(impact.rent),
    formatCurrency(impact.cashFlow),
    formatCurrency(impact.impact)
  ]);
  
  addDataTable(doc, ['Vacancy Rate', 'Annual Rent', 'Cash Flow', 'Impact'], vacancyRows, {
    title: 'Vacancy Rate Impact',
    widths: [30, 40, 40, 30],
    align: ['center', 'right', 'right', 'right']
  });

  // Interest rate impact table
  const interestRows = data.sensitivity.interestImpact.map(impact => [
    `${impact.rate}%`,
    formatCurrency(impact.monthly),
    formatCurrency(impact.annual),
    formatCurrency(impact.impact)
  ]);
  
  addDataTable(doc, ['Interest Rate', 'Monthly Cost', 'Annual Cost', 'Impact'], interestRows, {
    title: 'Interest Rate Impact',
    widths: [30, 40, 40, 30],
    align: ['center', 'right', 'right', 'right']
  });

  // Growth scenarios table
  const growthRows = data.sensitivity.growthScenarios.map(scenario => [
    scenario.scenario,
    formatPercentage(scenario.rate),
    formatCurrency(scenario.finalValue),
    formatCurrency(scenario.totalReturn),
    formatPercentage(scenario.roi)
  ]);
  
  addDataTable(doc, ['Scenario', 'Growth Rate', 'Final Value', 'Total Return', 'ROI'], growthRows, {
    title: 'Growth Scenarios',
    widths: [40, 30, 50, 50, 30],
    align: ['left', 'center', 'right', 'right', 'right']
  });

  // Risk factors
  addAlertBox(doc,
    'Consider these risk factors: interest rate changes, vacancy periods, maintenance costs, market volatility, and economic downturns.',
    'warning',
    'Risk Factors'
  );

  addPageBreak(doc);
}

function generateCGTOnExit(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'CGT on Exit', 'Capital Gains Tax Calculation');
  
  // Sale calculation table
  const saleRows = [
    ['Sale Price', formatCurrency(data.cgt.salePrice)],
    ['Original Purchase Price', formatCurrency(data.cgt.purchasePrice)],
    ['Purchase Costs', formatCurrency(data.cgt.purchaseCosts)],
    ['Selling Costs', formatCurrency(data.cgt.sellingCosts)],
    ['Cost Base', formatCurrency(data.cgt.costBase)],
    ['Capital Gain', formatCurrency(data.cgt.capitalGain)]
  ];
  
  addDataTable(doc, ['Item', 'Amount'], saleRows, {
    title: 'Sale Calculation',
    widths: [100, 40],
    align: ['left', 'right']
  });

  // Tax calculation table
  const taxRows = [
    ['Capital Gain', formatCurrency(data.cgt.capitalGain)],
    ['CGT Rate', formatPercentage(data.cgt.cgtRate)],
    ['CGT Payable', formatCurrency(data.cgt.cgtPayable)],
    ['Withholding Tax', formatCurrency(data.cgt.withholdingTax)],
    ['Net Proceeds', formatCurrency(data.cgt.netProceeds)]
  ];
  
  addDataTable(doc, ['Item', 'Amount'], taxRows, {
    title: 'Tax Calculation',
    widths: [100, 40],
    align: ['left', 'right']
  });

  // Net proceeds card
  addMetricCard(doc, 'Net Proceeds', formatCurrency(data.cgt.netProceeds), 'After all taxes', COLORS.success);

  // Tax planning tip
  addAlertBox(doc,
    'Consider holding the property for more than 12 months to access the 50% CGT discount (for Australian residents). Foreign residents are not eligible for this discount.',
    'warning',
    'Tax Planning Tip'
  );

  addPageBreak(doc);
}

function generateInvestmentScore(doc: jsPDF, data: PDFReportData): void {
  addSectionHeader(doc, 'Investment Score', 'Overall Assessment & Recommendation');
  
  // Overall verdict card
  addMetricCard(doc, 'Overall Score', `${data.score.overall}/100`, data.score.verdict, COLORS.primary);
  
  // Score breakdown table
  const scoreRows = [
    ['Rental Yield', data.score.rentalYield],
    ['Capital Growth', data.score.capitalGrowth],
    ['Cash Flow', data.score.cashFlow],
    ['Tax Efficiency', data.score.taxEfficiency],
    ['Risk Profile', data.score.riskProfile],
    ['Overall Score', data.score.overall]
  ];
  
  addDataTable(doc, ['Category', 'Score'], scoreRows, {
    title: 'Score Breakdown',
    widths: [100, 40],
    align: ['left', 'center']
  });

  // Strengths and weaknesses in two columns
  doc.setFontSize(FONTS.body);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Strengths:', SPACING.margin, getCurrentY(doc) + 10);
  
  doc.setFont('helvetica', 'normal');
  data.score.strengths.forEach((strength) => {
    doc.text(`• ${strength}`, SPACING.margin + 10, getCurrentY(doc) + 5);
  });

  // Move to right column
  const rightColumnX = doc.internal.pageSize.getWidth() / 2 + SPACING.margin;
  doc.setFont('helvetica', 'bold');
  doc.text('Areas of Concern:', rightColumnX, getCurrentY(doc) - (data.score.strengths.length * 8));
  
  doc.setFont('helvetica', 'normal');
  data.score.weaknesses.forEach((weakness) => {
    doc.text(`• ${weakness}`, rightColumnX + 10, getCurrentY(doc) + 5);
  });

  // Suitability box
  addAlertBox(doc,
    `This investment is ${data.score.verdict.toLowerCase()}. Consider your risk tolerance, investment timeline, and overall portfolio diversification before proceeding.`,
    data.score.overall >= 70 ? 'success' : data.score.overall >= 50 ? 'warning' : 'danger',
    'Investment Suitability'
  );

  addPageBreak(doc);
}

function generateGlossary(doc: jsPDF): void {
  addSectionHeader(doc, 'Glossary', 'Key Terms & Definitions');
  
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
    ['Capital Growth', 'Increase in property value over time'],
    ['Cash Flow', 'Net income after all expenses'],
    ['Depreciation', 'Tax deduction for wear and tear on property'],
    ['Land Tax', 'Annual tax on land value'],
    ['Council Rates', 'Local government property tax'],
    ['LMI', 'Lenders Mortgage Insurance - required for high LVR loans'],
    ['Settlement', 'Completion of property purchase transaction'],
    ['Conveyancing', 'Legal process of transferring property ownership'],
    ['Building Inspection', 'Professional assessment of property condition'],
    ['Pest Inspection', 'Assessment for termites and other pests'],
    ['Property Management', 'Professional management of rental property'],
    ['Rental Appraisal', 'Estimated rental income assessment'],
    ['Market Valuation', 'Professional property value assessment'],
    ['Equity', 'Property value minus outstanding loan amount'],
    ['Refinancing', 'Replacing existing loan with new loan terms'],
    ['Interest Only', 'Loan payments covering only interest, not principal'],
    ['Principal & Interest', 'Loan payments covering both principal and interest'],
    ['Fixed Rate', 'Interest rate locked for set period'],
    ['Variable Rate', 'Interest rate that can change with market conditions'],
    ['Offset Account', 'Savings account linked to home loan reducing interest']
  ];
  
  // Split into two columns
  const midPoint = Math.ceil(glossaryTerms.length / 2);
  const leftColumn = glossaryTerms.slice(0, midPoint);
  const rightColumn = glossaryTerms.slice(midPoint);
  
  // Left column
  leftColumn.forEach((term) => {
    doc.setFontSize(FONTS.body);
    doc.setFont('helvetica', 'bold');
    doc.text(term[0], SPACING.margin, getCurrentY(doc) + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.small);
    doc.text(term[1], SPACING.margin + 10, getCurrentY(doc) + 5);
  });
  
  // Right column
  const rightColumnX = doc.internal.pageSize.getWidth() / 2 + SPACING.margin;
  rightColumn.forEach((term) => {
    doc.setFontSize(FONTS.body);
    doc.setFont('helvetica', 'bold');
    doc.text(term[0], rightColumnX, getCurrentY(doc) - (leftColumn.length * 8) + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.small);
    doc.text(term[1], rightColumnX + 10, getCurrentY(doc) + 5);
  });

  addPageBreak(doc);
}

function generateDisclaimer(doc: jsPDF): void {
  addSectionHeader(doc, 'Disclaimer', 'Important Information');
  
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
  doc.text(disclaimerText, SPACING.margin, getCurrentY(doc) + 10, {
    maxWidth: doc.internal.pageSize.getWidth() - (SPACING.margin * 2),
    align: 'justify'
  });

  addFooter(doc);
}