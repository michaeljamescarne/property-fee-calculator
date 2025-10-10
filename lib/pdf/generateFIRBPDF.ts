/**
 * FIRB PDF Generator
 * Generates professional PDF reports for FIRB calculations
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import { FIRBCalculatorFormData } from '@/lib/validations/firb';

// Extend jsPDF types for autotable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (): string => {
  return new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function generateFIRBPDF(
  formData: Partial<FIRBCalculatorFormData>,
  eligibility: EligibilityResult,
  costs: CostBreakdown
): Blob {
  // Initialize PDF with A4 size
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      addFooter();
      return true;
    }
    return false;
  };

  // Add footer to page
  const addFooter = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated on ${formatDate()}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  };

  // ===== HEADER =====
  doc.setFillColor(79, 70, 229); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRB Investment Analysis', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Property Fee Calculator', pageWidth / 2, 30, { align: 'center' });

  yPosition = 55;

  // ===== ELIGIBILITY VERDICT =====
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Eligibility Summary', margin, yPosition);
  yPosition += 10;

  // Eligibility box
  const eligibilityColor = eligibility.canPurchase
    ? (eligibility.requiresFIRB ? [251, 191, 36] : [34, 197, 94]) // amber or green
    : [239, 68, 68]; // red

  doc.setFillColor(eligibilityColor[0], eligibilityColor[1], eligibilityColor[2]);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const eligibilityText = eligibility.canPurchase
    ? (eligibility.requiresFIRB ? '⚠ Eligible - FIRB Approval Required' : '✓ Eligible to Purchase')
    : '✗ Not Eligible to Purchase';
  doc.text(eligibilityText, pageWidth / 2, yPosition + 13, { align: 'center' });

  yPosition += 30;

  // ===== PROPERTY DETAILS =====
  checkPageBreak(50);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Details', margin, yPosition);
  yPosition += 8;

  const propertyDetails = [
    ['Property Type', formData.propertyType || '-'],
    ['Property Value', formData.propertyValue ? formatCurrency(formData.propertyValue) : '-'],
    ['State/Territory', formData.state || '-'],
    ['First Home Buyer', formData.isFirstHome ? 'Yes' : 'No'],
    ['Entity Type', formData.entityType || '-'],
    ['Deposit', formData.depositPercent ? `${formData.depositPercent}%` : '-']
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: propertyDetails,
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // ===== CITIZENSHIP INFORMATION =====
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Citizenship Information', margin, yPosition);
  yPosition += 8;

  const citizenshipDetails = [
    ['Citizenship Status', formData.citizenshipStatus || '-'],
    ...(formData.visaType ? [['Visa Type', formData.visaType]] : []),
    ...(formData.citizenshipStatus === 'australian'
      ? [['Ordinarily Resident', formData.isOrdinarilyResident !== false ? 'Yes' : 'No']]
      : [])
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: citizenshipDetails,
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // ===== COST BREAKDOWN =====
  checkPageBreak(60);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Cost Summary', margin, yPosition);
  yPosition += 10;

  // Total Investment Cost Box
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Investment Cost', pageWidth / 2, yPosition + 8, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(
    formatCurrency(costs.totalInvestmentCost),
    pageWidth / 2,
    yPosition + 19,
    { align: 'center' }
  );

  yPosition += 35;

  // ===== UPFRONT COSTS TABLE =====
  checkPageBreak(80);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Upfront Costs', margin, yPosition);
  yPosition += 8;

  const upfrontRows = [
    ['Property Purchase Price', formatCurrency(costs.upfrontCosts.propertyPrice)],
    ...(costs.upfrontCosts.firbFee > 0
      ? [['FIRB Application Fee', formatCurrency(costs.upfrontCosts.firbFee)]]
      : []),
    ['Stamp Duty', formatCurrency(costs.upfrontCosts.stampDuty)],
    ...(costs.upfrontCosts.foreignSurcharge > 0
      ? [['Foreign Buyer Surcharge', formatCurrency(costs.upfrontCosts.foreignSurcharge)]]
      : []),
    ['Legal & Conveyancing', formatCurrency(costs.upfrontCosts.legalFees)],
    ['Inspection Fees', formatCurrency(costs.upfrontCosts.inspectionFees)],
    ...(costs.upfrontCosts.loanCosts > 0
      ? [['Loan Establishment Costs', formatCurrency(costs.upfrontCosts.loanCosts)]]
      : [])
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Cost Item', 'Amount']],
    body: upfrontRows,
    foot: [['Total Upfront Costs', formatCurrency(costs.upfrontCosts.total)]],
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [79, 70, 229] },
    footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 50, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // ===== ONGOING COSTS TABLE =====
  checkPageBreak(60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Ongoing Costs', margin, yPosition);
  yPosition += 8;

  const ongoingRows = [
    ...(costs.ongoingCosts.annualLandTax > 0
      ? [['Land Tax', formatCurrency(costs.ongoingCosts.annualLandTax)]]
      : []),
    ['Council Rates', formatCurrency(costs.ongoingCosts.councilRates)],
    ['Insurance', formatCurrency(costs.ongoingCosts.insurance)],
    ['Maintenance (estimated)', formatCurrency(costs.ongoingCosts.maintenance)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Cost Item', 'Annual Amount']],
    body: ongoingRows,
    foot: [['Total Annual Costs', formatCurrency(costs.ongoingCosts.total)]],
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [79, 70, 229] },
    footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 50, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // ===== RESTRICTIONS =====
  if (eligibility.restrictions.length > 0) {
    checkPageBreak(40 + eligibility.restrictions.length * 10);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Important Restrictions', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    eligibility.restrictions.forEach((restriction) => {
      if (checkPageBreak(15)) {
        // Page break occurred, reposition after header
      }
      doc.text(`• ${restriction}`, margin + 5, yPosition, {
        maxWidth: pageWidth - 2 * margin - 10
      });
      yPosition += 10;
    });

    yPosition += 5;
  }

  // ===== DISCLAIMER =====
  checkPageBreak(50);
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 45, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Important Disclaimer', margin + 5, yPosition + 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75);
  const disclaimerText =
    'This calculator provides estimates only and should not be considered financial or legal advice. ' +
    'Actual costs may vary significantly. FIRB regulations are subject to change. We strongly recommend ' +
    'consulting with qualified professionals including lawyers, accountants, and FIRB specialists before ' +
    'making any property investment decisions. The information provided is general in nature and does not ' +
    'take into account your individual circumstances.';

  doc.text(disclaimerText, margin + 5, yPosition + 15, {
    maxWidth: pageWidth - 2 * margin - 10,
    align: 'justify'
  });

  // Add footer to all pages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter();
  }

  // Return PDF as Blob
  return doc.output('blob');
}

