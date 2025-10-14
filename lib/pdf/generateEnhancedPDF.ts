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

// Extend jsPDF types for autotable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export function generateEnhancedPDF(
  formData: Partial<FIRBCalculatorFormData>,
  eligibility: EligibilityResult,
  costs: CostBreakdown,
  analytics: InvestmentAnalytics,
  locale: string = 'en',
  translations: PDFTranslations
): Blob {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

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

  // Colors - Updated to match new blue color scheme
  const primaryColor: [number, number, number] = [59, 130, 246]; // Soft blue
  const accentColor: [number, number, number] = [96, 165, 250]; // Lighter blue
  const greenColor: [number, number, number] = [16, 185, 129];
  const redColor: [number, number, number] = [239, 68, 68];
  const amberColor: [number, number, number] = [245, 158, 11];

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
    doc.setFontSize(8);
    doc.setTextColor(150);
    const pageText = locale === 'zh' ? `${safeTranslations.page}${pageCount}页` : `${safeTranslations.page} ${pageCount}`;
    doc.text(pageText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`${safeTranslations.generatedOn} ${formatDate(new Date(), locale === 'zh' ? 'zh-CN' : 'en-AU')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Helper: Add section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPosition + 7);
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
  };

  // Locale-aware formatting helpers
  const fmt = {
    currency: (value: number): string => formatCurrency(value, locale === 'zh' ? 'zh-CN' : 'en-AU', 'AUD'),
    percent: (value: number): string => formatPercent(value, locale === 'zh' ? 'zh-CN' : 'en-AU', 1),
    number: (value: number): string => formatNumber(value, locale === 'zh' ? 'zh-CN' : 'en-AU', { maximumFractionDigits: 0 }),
  };

  // =================
  // PAGE 1: EXECUTIVE SUMMARY
  // =================
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(safeTranslations.title, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(safeTranslations.subtitle, pageWidth / 2, 32, { align: 'center' });
  doc.text(`${formatDate(new Date(), locale === 'zh' ? 'zh-CN' : 'en-AU')}`, pageWidth / 2, 42, { align: 'center' });

  yPosition = 65;

  // Investment Score Banner
  doc.setFillColor(...(analytics.score.overall >= 7 ? greenColor : analytics.score.overall >= 5.5 ? primaryColor : amberColor));
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analytics.recommendation.verdict.toUpperCase()} ${safeTranslations.labels.overallVerdict?.toUpperCase() || 'INVESTMENT RATING'}`, pageWidth / 2, yPosition + 10, { align: 'center' });
  doc.setFontSize(36);
  doc.text(`${analytics.score.overall.toFixed(1)}/10`, pageWidth / 2, yPosition + 22, { align: 'center' });
  
  yPosition += 35;
  doc.setTextColor(0, 0, 0);

  // Property Details
  addSectionHeader(safeTranslations.sections.propertyDetails);
  
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

  // Key Investment Metrics
  addSectionHeader(safeTranslations.sections.keyMetrics);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value', 'Benchmark']],
    body: [
      ['Gross Rental Yield', fmt.percent(analytics.rentalYield.gross), analytics.rentalYield.comparison],
      ['Net Rental Yield', fmt.percent(analytics.rentalYield.net), 'After all expenses'],
      ['Annualized ROI', fmt.percent(analytics.roi.annualizedROI), analytics.roi.annualizedROI > 7.2 ? 'Beats ASX (7.2%)' : 'Below ASX (7.2%)'],
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
  doc.text('Investment Recommendation:', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const recommendationLines = doc.splitTextToSize(analytics.recommendation.description, pageWidth - 2 * margin);
  doc.text(recommendationLines, margin, yPosition);
  yPosition += recommendationLines.length * 5 + 5;

  addFooter();

  // =================
  // PAGE 2: COST BREAKDOWN
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  addSectionHeader(safeTranslations.sections.costBreakdown);

  // Total Investment
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Investment Required', margin + 5, yPosition + 8);
  doc.setFontSize(18);
  doc.text(fmt.currency(costs.totalInvestmentCost), pageWidth - margin - 5, yPosition + 14, { align: 'right' });
  yPosition += 25;

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

  // =================
  // PAGE 3: INVESTMENT ANALYSIS
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  addSectionHeader(safeTranslations.sections.investmentPerformance);

  // Rental Analysis
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
    headStyles: { fillColor: accentColor },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Capital Growth
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
    headStyles: { fillColor: greenColor },
    margin: { left: margin, right: margin },
  });

  // =================
  // PAGE 4: CASH FLOW ANALYSIS
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  addSectionHeader(safeTranslations.sections.cashFlow);

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

  // =================
  // PAGE 5: 10-YEAR PROJECTIONS
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  addSectionHeader(safeTranslations.sections.projections);

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
  doc.setFillColor(240, 250, 240);
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

  // =================
  // PAGE 6: COMPARISONS & SCENARIOS
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  addSectionHeader(safeTranslations.sections.comparison);

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

  // Sensitivity Analysis
  checkPageBreak(80);
  addSectionHeader(safeTranslations.sections.sensitivity);

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
    headStyles: { fillColor: amberColor, fontSize: 9 },
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
    headStyles: { fillColor: amberColor, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  // =================
  // PAGE 7: TAX ANALYSIS & RECOMMENDATIONS
  // =================
  
  doc.addPage();
  yPosition = margin;
  addFooter();

  addSectionHeader(safeTranslations.sections.taxAnalysis);

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
    headStyles: { fillColor: greenColor },
    footStyles: { fillColor: [200, 240, 200], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;

  // Tax Benefit Summary
  checkPageBreak(25);
  doc.setFillColor(220, 250, 220);
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
        data.cell.styles.fillColor = [220, 250, 220];
      }
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // Final Recommendation
  checkPageBreak(60);
  addSectionHeader(safeTranslations.sections.recommendations);

  // Verdict
  doc.setFillColor(...(analytics.score.overall >= 7 ? greenColor : analytics.score.overall >= 5.5 ? primaryColor : amberColor));
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
    doc.setTextColor(...greenColor);
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
    doc.setTextColor(...redColor);
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
    doc.setTextColor(...primaryColor);
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
  }

  // Disclaimer (Last Page)
  checkPageBreak(40);
  yPosition = pageHeight - 60;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Important Disclaimer:', margin + 5, yPosition + 6);
  doc.setFont('helvetica', 'normal');
  const disclaimerText = 'This report provides estimates only and should not be considered financial or legal advice. Actual costs and returns may vary. FIRB regulations and market conditions are subject to change. We strongly recommend consulting with qualified professionals including lawyers, accountants, financial advisors, and FIRB specialists before making any property investment decisions. Past performance does not guarantee future results.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 10);
  doc.text(disclaimerLines, margin + 5, yPosition + 12);

  // Return PDF as Blob
  return doc.output('blob');
}

