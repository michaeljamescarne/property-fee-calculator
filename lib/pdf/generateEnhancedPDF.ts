/**
 * Enhanced FIRB PDF Generator with Investment Analytics
 * Fixed version without getCurrentY dependency
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { InvestmentAnalytics } from "@/types/investment";
import type { PDFTranslations } from "./pdfTranslations";
import { ContentTier } from "./contentAccess";
import { mapAnalyticsToPDFData, type PDFReportData } from "./dataMappers";
// Chart generation removed - charts are now generated client-side and passed as parameters
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
  SPACING,
} from "./templateHelpers";

export async function generateEnhancedPDF(
  formData: Partial<FIRBCalculatorFormData>,
  eligibility: EligibilityResult,
  costs: CostBreakdown,
  analytics: InvestmentAnalytics,
  _locale: string = "en",
  _translations: PDFTranslations,
  _contentTier: ContentTier = "premium",
  chartImages?: {
    projectionChart: string | null;
    cashFlowChart: string | null;
    roiComparisonChart: string | null;
  }
): Promise<Blob> {
  console.log("🚀 Generating Enhanced PDF with template design -", new Date().toISOString());

  const doc = new jsPDF("p", "mm", "a4");

  // Map data to template format
  const reportData = mapAnalyticsToPDFData(formData, eligibility, costs, analytics);

  // Use provided chart images or default to null
  // Charts are generated client-side and passed to this function
  const chartImagesToUse = chartImages || {
    projectionChart: null,
    cashFlowChart: null,
    roiComparisonChart: null,
  };

  console.log("📊 Chart images provided to PDF generator:", {
    projection: {
      exists: !!chartImagesToUse.projectionChart,
      length: chartImagesToUse.projectionChart?.length || 0,
      isValid: chartImagesToUse.projectionChart?.startsWith("data:image/") || false,
    },
    cashFlow: {
      exists: !!chartImagesToUse.cashFlowChart,
      length: chartImagesToUse.cashFlowChart?.length || 0,
      isValid: chartImagesToUse.cashFlowChart?.startsWith("data:image/") || false,
    },
    roiComparison: {
      exists: !!chartImagesToUse.roiComparisonChart,
      length: chartImagesToUse.roiComparisonChart?.length || 0,
      isValid: chartImagesToUse.roiComparisonChart?.startsWith("data:image/") || false,
    },
  });

  // Track Y position explicitly
  let currentY: number = SPACING.margin;

  // Generate report sections
  currentY = generateCoverPage(doc, reportData);
  currentY = generateExecutiveSummary(doc, reportData, currentY);
  currentY = generateTableOfContents(doc);
  currentY = generateFIRBEligibility(doc, reportData, currentY);
  currentY = generateInvestmentCosts(doc, reportData, currentY);
  currentY = generatePerformanceMetrics(doc, reportData, currentY);
  currentY = generateCashFlowAnalysis(doc, reportData, currentY, chartImagesToUse.cashFlowChart);
  currentY = generateTaxAnalysisAndCGT(doc, reportData, currentY);
  currentY = generateProjection(doc, reportData, analytics, currentY, chartImagesToUse.projectionChart);
  currentY = generateSensitivityAnalysis(doc, reportData, currentY);
  currentY = generateInvestmentComparison(
    doc,
    reportData,
    currentY,
    chartImagesToUse.roiComparisonChart
  );
  currentY = generateGlossary(doc, currentY);
  generateDisclaimer(doc, currentY);

  // Return PDF as blob
  return doc.output("blob");
}

function generateCoverPage(doc: jsPDF, data: PDFReportData): number {
  const title = "Property Investment Analysis Report";
  const generationDate = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return addCoverPage(
    doc,
    title,
    data.property.address,
    data.property.purchasePrice,
    generationDate
  );
}

function generateExecutiveSummary(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(
    doc,
    "Executive Summary",
    "Investment Overview & Key Metrics",
    startY
  );

  // Investment overview metric cards (2x4 grid)
  const cardStartY = currentY + 20;
  const cardWidth = 80;
  const cardHeight = 40;
  const cardSpacing = 10;
  const leftColumnX = SPACING.margin;
  const rightColumnX = SPACING.margin + cardWidth + cardSpacing;

  // Row 1
  addMetricCard(
    doc,
    "Property Type",
    data.property.type,
    "Property category",
    COLORS.gray[800],
    cardStartY,
    leftColumnX
  );
  addMetricCard(
    doc,
    "Purchase Price",
    formatCurrency(data.property.purchasePrice),
    "Initial property cost",
    COLORS.gray[800],
    cardStartY,
    rightColumnX
  );

  // Row 2
  addMetricCard(
    doc,
    "Total Investment",
    formatCurrency(data.costs.totalInvestment),
    "Including all costs",
    COLORS.gray[800],
    cardStartY + cardHeight + cardSpacing,
    leftColumnX
  );
  addMetricCard(
    doc,
    "Gross Yield",
    formatPercentage(data.performance.grossYield),
    "Annual rental income",
    COLORS.gray[800],
    cardStartY + cardHeight + cardSpacing,
    rightColumnX
  );

  // Row 3
  addMetricCard(
    doc,
    "Net Yield",
    formatPercentage(data.performance.netYield),
    "After expenses",
    COLORS.gray[800],
    cardStartY + 2 * (cardHeight + cardSpacing),
    leftColumnX
  );
  addMetricCard(
    doc,
    "Annualized ROI",
    formatPercentage(data.performance.annualizedROI),
    "Total return",
    COLORS.gray[800],
    cardStartY + 2 * (cardHeight + cardSpacing),
    rightColumnX
  );

  // Row 4
  addMetricCard(
    doc,
    "Monthly Cash Flow",
    formatCurrency(data.performance.monthlyCashFlow),
    "After tax",
    COLORS.gray[800],
    cardStartY + 3 * (cardHeight + cardSpacing),
    leftColumnX
  );
  addMetricCard(
    doc,
    "Investment Verdict",
    data.score.verdict,
    "Overall assessment",
    COLORS.primary,
    cardStartY + 3 * (cardHeight + cardSpacing),
    rightColumnX
  );

  // Row 5 - FIRB Status Box
  const firbStatusColor =
    data.eligibility.status === "Eligible"
      ? COLORS.success
      : data.eligibility.status === "Review Required"
        ? COLORS.warning
        : COLORS.danger;
  const firbBackgroundColor =
    data.eligibility.status === "Eligible"
      ? "#F0FDF4"
      : data.eligibility.status === "Review Required"
        ? "#FFFBEB"
        : "#FEF2F2";
  addMetricCard(
    doc,
    "FIRB Status",
    data.eligibility.status,
    "Foreign investment approval",
    firbStatusColor,
    cardStartY + 4 * (cardHeight + cardSpacing),
    leftColumnX,
    firbBackgroundColor
  );

  // Key Strengths section
  const strengthsY = cardStartY + 5 * (cardHeight + cardSpacing) + 20;
  const strengthsCurrentY = addSectionHeader(doc, "Key Strengths", "", strengthsY);

  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.text("• Good capital growth potential", SPACING.margin, strengthsCurrentY + 10);
  doc.text("• Significant tax benefits", SPACING.margin, strengthsCurrentY + 25);

  // Key Weaknesses section
  const weaknessesY = strengthsCurrentY + 50;
  const weaknessesCurrentY = addSectionHeader(doc, "Key Weaknesses", "", weaknessesY);

  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.text("• Below average rental yield", SPACING.margin, weaknessesCurrentY + 10);
  doc.text("• Negative cash flow", SPACING.margin, weaknessesCurrentY + 25);

  // FIRB restrictions box
  const alertY = weaknessesCurrentY + 50;
  addAlertBox(
    doc,
    "This property requires FIRB approval. Foreign buyers can only purchase new dwellings, vacant land for development, or off-the-plan properties. Established dwellings are prohibited for foreign buyers.",
    "warning",
    "FIRB Restrictions",
    alertY
  );

  return addPageBreak(doc);
}

function generateTableOfContents(doc: jsPDF): number {
  const currentY = addSectionHeader(doc, "Table of Contents", "", SPACING.margin);

  const sections = [
    { title: "Executive Summary", page: 2 },
    { title: "FIRB Eligibility Assessment", page: 4 },
    { title: "Investment Cost Breakdown", page: 5 },
    { title: "Performance Metrics", page: 6 },
    { title: "Cash Flow Analysis", page: 7 },
    { title: "Tax Analysis & Planning", page: 8 },
    { title: "10-Year Projection", page: 9 },
    { title: "Sensitivity Analysis", page: 10 },
    { title: "Investment Comparison", page: 11 },
    { title: "Glossary of Terms", page: 12 },
    { title: "Disclaimer & Important Information", page: 13 },
  ];

  let yPosition = currentY + 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textMargin = SPACING.margin;
  const pageNumberWidth = 15;
  const leaderLineEnd = pageWidth - SPACING.margin - pageNumberWidth;

  doc.setFont("helvetica", "normal");
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
    doc.text(pageNumText, pageWidth - SPACING.margin, yPosition, { align: "right" });

    // Draw dotted leader line using small circles
    doc.setDrawColor(COLORS.gray[400]);
    doc.setLineWidth(0.5);

    // Draw dots along the line
    for (let x = leaderLineStart; x < leaderLineEnd; x += 2) {
      doc.circle(x, yPosition - 0.5, 0.3, "F");
    }

    yPosition += 12; // Space for next entry
  });

  return addPageBreak(doc);
}

function generateFIRBEligibility(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(
    doc,
    "FIRB Eligibility",
    "Foreign Investment Review Board Requirements",
    startY
  );

  // Eligibility table
  const eligibilityRows = [
    ["Citizenship Status", data.eligibility.citizenshipStatus],
    ["Visa Type", data.eligibility.visa],
    ["Property Use", data.eligibility.propertyUse],
    ["Purchasing Entity", data.eligibility.purchasingEntity],
    ["State/Territory", data.eligibility.stateTerritory],
    ["FIRB Status", data.eligibility.status],
  ];

  const tableEndY = addDataTable(doc, ["Detail", "Value"], eligibilityRows, currentY, {
    title: "Eligibility Details",
    widths: [80, 60],
    align: ["left", "left"],
  });

  // Recommendations section
  const recommendationsY = tableEndY + 20;
  doc.setFontSize(FONTS.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.gray[800]);
  doc.text("Recommendations", SPACING.margin, recommendationsY);

  // Sample recommendations (in real implementation, these would come from data.eligibility.recommendations)
  const recommendations = [
    "Ensure all required documentation is prepared before FIRB application",
    "Consider engaging a FIRB specialist for complex cases",
    "Review property type restrictions for your visa category",
    "Verify compliance with state-specific foreign buyer requirements",
  ];

  let currentRecY = recommendationsY + 20;
  recommendations.forEach((recommendation, index) => {
    // Recommendation box with light blue background
    const boxWidth = doc.internal.pageSize.getWidth() - SPACING.margin * 2;
    const boxHeight = 25;

    // Light blue background
    doc.setFillColor(239, 246, 255); // #EFF6FF
    doc.roundedRect(SPACING.margin, currentRecY, boxWidth, boxHeight, 3, 3, "F");

    // Blue border
    doc.setDrawColor(59, 130, 246); // #3B82F6
    doc.setLineWidth(1);
    doc.roundedRect(SPACING.margin, currentRecY, boxWidth, boxHeight, 3, 3, "S");

    // Checkmark icon
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("✓", SPACING.margin + 8, currentRecY + 15);

    // Recommendation text
    doc.setTextColor(COLORS.gray[800]);
    doc.setFontSize(FONTS.body);
    doc.setFont("helvetica", "normal");
    doc.text(recommendation, SPACING.margin + 20, currentRecY + 15);

    currentRecY += boxHeight + 10;
  });

  return addPageBreak(doc);
}

function generateInvestmentCosts(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(doc, "Investment Costs", "Complete Cost Breakdown", startY);

  // Purchase Price section
  const purchasePriceRows = [
    ["Property Purchase Price", formatCurrency(data.property.purchasePrice)],
  ];

  addDataTable(doc, ["Item", "Amount"], purchasePriceRows, currentY, {
    title: "Purchase Price",
    widths: [120, 40],
    align: ["left", "right"],
  });

  // Government Fees & Taxes section
  const governmentFeesRows = [
    ["FIRB Application Fee", formatCurrency(data.costs.firbFee)],
    ["Stamp Duty", formatCurrency(data.costs.stampDuty)],
    ["Foreign Buyer Surcharge", formatCurrency(data.costs.foreignBuyerSurcharge)],
    [
      "**Subtotal - Government Fees**",
      formatCurrency(data.costs.firbFee + data.costs.stampDuty + data.costs.foreignBuyerSurcharge),
    ],
  ];

  const govTableEndY = addDataTable(
    doc,
    ["Fee Type", "Amount"],
    governmentFeesRows,
    currentY + 80,
    {
      title: "Government Fees & Taxes",
      widths: [120, 40],
      align: ["left", "right"],
    }
  );

  // Professional Fees section
  const professionalFeesRows = [
    ["Legal/Conveyancing Fees", formatCurrency(data.costs.legalFees || 2500)],
    ["Building & Pest Inspection", formatCurrency(data.costs.inspectionFees || 800)],
    [
      "**Subtotal - Professional Fees**",
      formatCurrency((data.costs.legalFees || 2500) + (data.costs.inspectionFees || 800)),
    ],
  ];

  const profTableEndY = addDataTable(
    doc,
    ["Fee Type", "Amount"],
    professionalFeesRows,
    govTableEndY + 20,
    {
      title: "Professional Fees",
      widths: [120, 40],
      align: ["left", "right"],
    }
  );

  // Loan Costs section
  const loanCostsRows = [
    ["Loan Establishment Fee", formatCurrency(data.costs.loanEstablishment || 1000)],
  ];

  const loanTableEndY = addDataTable(
    doc,
    ["Fee Type", "Amount"],
    loanCostsRows,
    profTableEndY + 20,
    {
      title: "Loan Costs",
      widths: [120, 40],
      align: ["left", "right"],
    }
  );

  // Annual Ongoing Costs section
  const ongoingCostsRows = [
    ["Council Rates", formatCurrency(data.ongoingCosts.councilRates || 2000)],
    ["Insurance", formatCurrency(data.ongoingCosts.insurance || 1200)],
    ["Maintenance & Repairs", formatCurrency(data.ongoingCosts.maintenance || 3000)],
    ["**Total Annual Ongoing Costs**", formatCurrency(data.ongoingCosts.total || 0)],
  ];

  addDataTable(doc, ["Cost Item", "Annual Amount"], ongoingCostsRows, loanTableEndY + 20, {
    title: "Annual Ongoing Costs",
    widths: [120, 40],
    align: ["left", "right"],
  });

  return addPageBreak(doc);
}

function generatePerformanceMetrics(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(
    doc,
    "Performance Metrics",
    "Rental Yield & Return Analysis",
    startY
  );

  // Comprehensive metrics table
  const metricsRows = [
    [
      "Gross Rental Yield",
      formatPercentage(data.performance.grossYield),
      "Industry average: 3.5-4.5%",
    ],
    ["Net Rental Yield", formatPercentage(data.performance.netYield), "After all expenses"],
    [
      "Annualized ROI",
      formatPercentage(data.performance.annualizedROI),
      "Total return including capital growth",
    ],
    [
      "Monthly Cash Flow",
      formatCurrency(data.performance.monthlyCashFlow),
      data.performance.monthlyCashFlow >= 0 ? "Positive cash flow" : "Negative cash flow",
    ],
  ];

  const tableEndY = addDataTable(doc, ["Metric", "Value", "Description"], metricsRows, currentY, {
    title: "Performance Metrics Summary",
    widths: [60, 40, 80],
    align: ["left", "right", "left"],
  });

  // Input Assumptions section
  const assumptionsY = tableEndY + 20;
  doc.setFontSize(FONTS.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.gray[800]);
  doc.text("Input Assumptions", SPACING.margin, assumptionsY);

  const assumptionsRows = [
    ["Rental Income", formatCurrency(data.performance.annualIncome), "Annual gross rental income"],
    ["Vacancy Rate", "5%", "Expected vacancy allowance"],
    ["Capital Growth Rate", "5%", "Annual property value appreciation"],
    ["Interest Rate", "6.5%", "Current mortgage interest rate"],
    ["Management Fees", "8%", "Property management commission"],
  ];

  addDataTable(doc, ["Assumption", "Value", "Description"], assumptionsRows, assumptionsY + 20, {
    title: "Key Assumptions",
    widths: [60, 40, 80],
    align: ["left", "right", "left"],
  });

  return addPageBreak(doc);
}

function generateCashFlowAnalysis(
  doc: jsPDF,
  data: PDFReportData,
  startY: number,
  chartImageDataUrl?: string | null
): number {
  const currentY = addSectionHeader(
    doc,
    "Cash Flow Analysis",
    "Income vs Expenses Breakdown",
    startY
  );

  // Three summary boxes at top
  const cardStartY = currentY + 20;
  const cardWidth = 50;
  const cardHeight = 35;
  const cardSpacing = 10;

  addMetricCard(
    doc,
    "Annual Income",
    formatCurrency(data.performance.annualIncome),
    "Gross rental income",
    COLORS.success,
    cardStartY,
    SPACING.margin
  );
  addMetricCard(
    doc,
    "Annual Expenses",
    formatCurrency(data.performance.totalExpenses),
    "All costs",
    COLORS.danger,
    cardStartY,
    SPACING.margin + cardWidth + cardSpacing
  );
  addMetricCard(
    doc,
    "After-Tax Cash Flow",
    formatCurrency(data.performance.monthlyCashFlow * 12),
    "Annual net cash flow",
    data.performance.monthlyCashFlow >= 0 ? COLORS.success : COLORS.danger,
    cardStartY,
    SPACING.margin + 2 * (cardWidth + cardSpacing)
  );

  // Add cash flow chart if available
  let expenseBreakdownY = cardStartY + cardHeight + 30;
  if (chartImageDataUrl) {
    try {
      console.log("🔍 Attempting to add cash flow chart:", {
        hasData: !!chartImageDataUrl,
        length: chartImageDataUrl?.length || 0,
        startsWithData: chartImageDataUrl?.startsWith("data:") || false,
        preview: chartImageDataUrl?.substring(0, 100) || "N/A",
      });

      // Validate image data URL format
      if (!chartImageDataUrl.startsWith("data:image/png") && !chartImageDataUrl.startsWith("data:image/jpeg")) {
        console.warn("❌ Invalid chart image format for cash flow chart:", chartImageDataUrl.substring(0, 50));
      } else {
        const pageWidth = doc.internal.pageSize.getWidth();
        const chartWidth = pageWidth - SPACING.margin * 2;
        const chartHeight = 60; // 60mm height for chart

        // Try multiple approaches to add the image
        try {
          // Approach 1: Try with full data URL (standard approach)
          doc.addImage(
            chartImageDataUrl,
            "PNG",
            SPACING.margin,
            expenseBreakdownY,
            chartWidth,
            chartHeight
          );
          console.log("✅ Successfully added cash flow chart to PDF (method: data URL)");
        } catch (error1) {
          console.warn("⚠️ Method 1 (data URL) failed, trying base64 extraction:", error1);
          try {
            // Approach 2: Extract base64 from data URL
            const base64Match = chartImageDataUrl.match(/^data:image\/\w+;base64,(.+)$/);
            if (base64Match && base64Match[1]) {
              const base64Data = base64Match[1];
              doc.addImage(
                base64Data,
                "PNG",
                SPACING.margin,
                expenseBreakdownY,
                chartWidth,
                chartHeight
              );
              console.log("✅ Successfully added cash flow chart to PDF (method: base64)");
            } else {
              throw new Error("Could not extract base64 from data URL");
            }
          } catch (error2) {
            console.error("❌ Both methods failed for cash flow chart:", { error1, error2 });
            throw error2;
          }
        }
        expenseBreakdownY += chartHeight + 20;
      }
    } catch (error) {
      console.error("❌ Failed to add cash flow chart to PDF:", error);
      console.error("   Error details:", error instanceof Error ? error.message : String(error));
      console.error("   Chart data URL length:", chartImageDataUrl?.length || 0);
      console.warn("   Chart will be omitted from PDF");
    }
  } else {
    console.warn("⚠️ Cash flow chart not provided, omitting from PDF");
  }

  // Expense Breakdown table
  const expenseRows = [
    ["Loan Interest", formatCurrency(data.performance.totalExpenses * 0.7)], // Estimate
    ["Property Management", formatCurrency(data.performance.totalExpenses * 0.15)], // Estimate
    ["Maintenance & Repairs", formatCurrency(data.performance.totalExpenses * 0.08)], // Estimate
    ["Council Rates", formatCurrency(data.performance.totalExpenses * 0.04)], // Estimate
    ["Insurance", formatCurrency(data.performance.totalExpenses * 0.03)], // Estimate
    ["**Total Annual Expenses**", formatCurrency(data.performance.totalExpenses)],
  ];

  const expenseTableEndY = addDataTable(
    doc,
    ["Expense Item", "Annual Amount"],
    expenseRows,
    expenseBreakdownY,
    {
      title: "Expense Breakdown",
      widths: [100, 40],
      align: ["left", "right"],
    }
  );

  // Negative Gearing Tax Benefit box
  const taxBenefitY = expenseTableEndY + 20;
  const taxBenefitBoxWidth = doc.internal.pageSize.getWidth() - SPACING.margin * 2;
  const taxBenefitBoxHeight = 30;

  // Green background for tax benefit
  doc.setFillColor(240, 253, 244); // #F0FDF4
  doc.roundedRect(SPACING.margin, taxBenefitY, taxBenefitBoxWidth, taxBenefitBoxHeight, 3, 3, "F");

  // Green border
  doc.setDrawColor(34, 197, 94); // #22C55E
  doc.setLineWidth(1);
  doc.roundedRect(SPACING.margin, taxBenefitY, taxBenefitBoxWidth, taxBenefitBoxHeight, 3, 3, "S");

  // Tax benefit text
  doc.setTextColor(COLORS.gray[800]);
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.text("Negative Gearing Tax Benefit", SPACING.margin + 10, taxBenefitY + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONTS.small);
  doc.text(
    `Annual tax savings: ${formatCurrency(data.taxBenefits.totalDeductions * 0.37)}`,
    SPACING.margin + 10,
    taxBenefitY + 22
  );

  // Monthly Cash Flow figures
  const monthlyCashFlowY = taxBenefitY + taxBenefitBoxHeight + 20;
  doc.setFontSize(FONTS.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.gray[800]);
  doc.text("Monthly Cash Flow", SPACING.margin, monthlyCashFlowY);

  const monthlyRows = [
    [
      "Before Tax",
      formatCurrency(
        data.performance.monthlyCashFlow + (data.taxBenefits.totalDeductions * 0.37) / 12
      ),
    ],
    ["After Tax", formatCurrency(data.performance.monthlyCashFlow)],
  ];

  addDataTable(doc, ["Cash Flow Type", "Monthly Amount"], monthlyRows, monthlyCashFlowY + 20, {
    title: "Monthly Cash Flow Breakdown",
    widths: [80, 40],
    align: ["left", "right"],
  });

  return addPageBreak(doc);
}

function generateTaxAnalysisAndCGT(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(
    doc,
    "Tax Analysis & Planning",
    "Deductions, Negative Gearing & CGT",
    startY
  );

  // Tax Deductions section
  const deductionsRows = [
    ["Loan Interest", formatCurrency(data.taxBenefits.totalDeductions * 0.7)], // Estimate
    ["Council Rates", formatCurrency(data.ongoingCosts.councilRates)],
    ["Insurance", formatCurrency(data.ongoingCosts.insurance)],
    ["Maintenance", formatCurrency(data.ongoingCosts.maintenance)],
    ["Depreciation", formatCurrency(data.taxBenefits.totalDeductions * 0.1)], // Estimate
    ["Other Deductions", formatCurrency(data.taxBenefits.totalDeductions * 0.1)], // Estimate
    ["**Total Deductions**", formatCurrency(data.taxBenefits.totalDeductions)],
  ];

  const deductionsTableEndY = addDataTable(
    doc,
    ["Deduction Type", "Annual Amount"],
    deductionsRows,
    currentY,
    {
      title: "Annual Tax Deductions",
      widths: [100, 40],
      align: ["left", "right"],
    }
  );

  // Negative Gearing Benefits section
  const negativeGearingY = deductionsTableEndY + 20;
  doc.setFontSize(FONTS.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.gray[800]);
  doc.text("Negative Gearing Benefits", SPACING.margin, negativeGearingY);

  const negativeGearingRows = [
    ["Annual Tax Savings (37% bracket)", formatCurrency(data.taxBenefits.totalDeductions * 0.37)],
    ["Monthly Tax Benefit", formatCurrency((data.taxBenefits.totalDeductions * 0.37) / 12)],
    ["Effective Cash Flow Improvement", formatCurrency(data.taxBenefits.totalDeductions * 0.37)],
  ];

  const negativeGearingTableEndY = addDataTable(
    doc,
    ["Benefit Type", "Amount"],
    negativeGearingRows,
    negativeGearingY + 20,
    {
      title: "Tax Benefits Summary",
      widths: [100, 40],
      align: ["left", "right"],
    }
  );

  // CGT on Exit section
  const cgtY = negativeGearingTableEndY + 20;
  doc.setFontSize(FONTS.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.gray[800]);
  doc.text("Capital Gains Tax on Exit", SPACING.margin, cgtY);

  const cgtRows = [
    ["Sale Price (10 years)", formatCurrency(data.cgt.salePrice)],
    ["Original Purchase Price", formatCurrency(data.cgt.purchasePrice)],
    ["Purchase Costs", formatCurrency(data.cgt.purchaseCosts)],
    ["Selling Costs", formatCurrency(data.cgt.sellingCosts)],
    ["Cost Base", formatCurrency(data.cgt.costBase)],
    ["Capital Gain", formatCurrency(data.cgt.capitalGain)],
    ["CGT Payable (50% discount)", formatCurrency(data.cgt.capitalGain * 0.5 * 0.37)],
    [
      "Net Proceeds After CGT",
      formatCurrency(data.cgt.salePrice - data.cgt.capitalGain * 0.5 * 0.37),
    ],
  ];

  addDataTable(doc, ["Item", "Amount"], cgtRows, cgtY + 20, {
    title: "CGT Calculation",
    widths: [100, 40],
    align: ["left", "right"],
  });

  return addPageBreak(doc);
}

function generateProjection(
  doc: jsPDF,
  data: PDFReportData,
  analytics: InvestmentAnalytics,
  startY: number,
  chartImageDataUrl?: string | null
): number {
  const currentY = addSectionHeader(
    doc,
    "10-Year Projection",
    "Long-term Investment Outlook",
    startY
  );

  // Summary boxes at top
  const cardStartY = currentY + 20;
  const cardWidth = 50;
  const cardHeight = 35;
  const cardSpacing = 10;

  addMetricCard(
    doc,
    "Starting Value",
    formatCurrency(data.projection.startingValue),
    "Current property value",
    COLORS.gray[800],
    cardStartY,
    SPACING.margin
  );
  addMetricCard(
    doc,
    "Final Value",
    formatCurrency(data.projection.finalValue),
    `After ${data.projection.years} years`,
    COLORS.success,
    cardStartY,
    SPACING.margin + cardWidth + cardSpacing
  );
  addMetricCard(
    doc,
    "Your Equity",
    formatCurrency(data.projection.finalValue * 0.8),
    "Estimated equity at sale",
    COLORS.primary,
    cardStartY,
    SPACING.margin + 2 * (cardWidth + cardSpacing)
  );
  addMetricCard(
    doc,
    "Total ROI",
    formatPercentage(data.projection.totalROI),
    "Overall return",
    COLORS.success,
    cardStartY,
    SPACING.margin + 3 * (cardWidth + cardSpacing)
  );

  // Add projection chart if available
  let tableY = cardStartY + cardHeight + 30;
  if (chartImageDataUrl) {
    try {
      console.log("🔍 Attempting to add projection chart:", {
        hasData: !!chartImageDataUrl,
        length: chartImageDataUrl?.length || 0,
        startsWithData: chartImageDataUrl?.startsWith("data:") || false,
        preview: chartImageDataUrl?.substring(0, 100) || "N/A",
      });

      // Validate image data URL format
      if (!chartImageDataUrl.startsWith("data:image/png") && !chartImageDataUrl.startsWith("data:image/jpeg")) {
        console.warn("❌ Invalid chart image format for projection chart:", chartImageDataUrl.substring(0, 50));
      } else {
        const pageWidth = doc.internal.pageSize.getWidth();
        const chartWidth = pageWidth - SPACING.margin * 2;
        const chartHeight = 60; // 60mm height for chart

        // Try multiple approaches to add the image
        try {
          // Approach 1: Try with full data URL (standard approach)
          doc.addImage(chartImageDataUrl, "PNG", SPACING.margin, tableY, chartWidth, chartHeight);
          console.log("✅ Successfully added projection chart to PDF (method: data URL)");
        } catch (error1) {
          console.warn("⚠️ Method 1 (data URL) failed, trying base64 extraction:", error1);
          try {
            // Approach 2: Extract base64 from data URL
            const base64Match = chartImageDataUrl.match(/^data:image\/\w+;base64,(.+)$/);
            if (base64Match && base64Match[1]) {
              const base64Data = base64Match[1];
              doc.addImage(base64Data, "PNG", SPACING.margin, tableY, chartWidth, chartHeight);
              console.log("✅ Successfully added projection chart to PDF (method: base64)");
            } else {
              throw new Error("Could not extract base64 from data URL");
            }
          } catch (error2) {
            console.error("❌ Both methods failed for projection chart:", { error1, error2 });
            throw error2;
          }
        }
        tableY += chartHeight + 20;
      }
    } catch (error) {
      console.error("❌ Failed to add projection chart to PDF:", error);
      console.error("   Error details:", error instanceof Error ? error.message : String(error));
      console.error("   Chart data URL length:", chartImageDataUrl?.length || 0);
      console.warn("   Chart will be omitted from PDF");
    }
  } else {
    console.warn("⚠️ Projection chart not provided, omitting from PDF");
  }

  // Year-by-Year Summary table
  doc.setFontSize(FONTS.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.gray[800]);
  doc.text("Year-by-Year Summary", SPACING.margin, tableY);

  // Use actual analytics data instead of recalculating (avoids calculation bugs)
  // The analytics already contain accurate year-by-year projections calculated correctly
  const yearByYearRows: string[][] = [];
  
  // Get first 10 years from analytics (or all if less than 10)
  const projectionYears = analytics.yearByYear.slice(0, 10);
  
  if (projectionYears.length === 0) {
    // Fallback: use simple calculation if no analytics data
    console.warn("⚠️ No year-by-year analytics data available, using simplified calculation");
    const growthRateDecimal = data.projection.growthRate / 100;
    let currentValue = data.projection.startingValue;
    let cumulativeReturn = 0;
    const annualCashFlow = data.performance.monthlyCashFlow * 12;

    for (let year = 1; year <= 10; year++) {
      currentValue = currentValue * (1 + growthRateDecimal);
      const equity = currentValue * 0.8; // Simplified: 80% of value
      cumulativeReturn += annualCashFlow;

      yearByYearRows.push([
        `Year ${year}`,
        formatCurrency(currentValue),
        formatCurrency(equity),
        formatCurrency(annualCashFlow),
        formatCurrency(cumulativeReturn),
      ]);
    }
  } else {
    // Use the accurately calculated analytics data
    projectionYears.forEach((yearData) => {
      yearByYearRows.push([
        yearData.year > 0 ? `Year ${yearData.year}` : `${yearData.year}`,
        formatCurrency(yearData.propertyValue),
        formatCurrency(yearData.equity),
        formatCurrency(yearData.afterTaxCashFlow),
        formatCurrency(yearData.cumulativeReturn),
      ]);
    });
  }

  addDataTable(
    doc,
    ["Year", "Property Value", "Equity", "Cash Flow", "Cumulative Return"],
    yearByYearRows,
    tableY + 20,
    {
      title: "10-Year Projection Details",
      widths: [20, 40, 40, 40, 40],
      align: ["left", "right", "right", "right", "right"],
    }
  );

  return addPageBreak(doc);
}

function generateSensitivityAnalysis(doc: jsPDF, data: PDFReportData, startY: number): number {
  const currentY = addSectionHeader(
    doc,
    "Sensitivity Analysis",
    "Impact of Market Changes",
    startY
  );

  // Vacancy impact table
  const vacancyRows = data.sensitivity.vacancyImpact.map((impact) => [
    `${impact.rate}%`,
    formatCurrency(impact.rent),
    formatCurrency(impact.cashFlow),
    formatCurrency(impact.impact),
  ]);

  addDataTable(doc, ["Vacancy Rate", "Annual Rent", "Cash Flow", "Impact"], vacancyRows, currentY, {
    title: "Vacancy Rate Impact",
    widths: [30, 40, 40, 30],
    align: ["center", "right", "right", "right"],
  });

  return addPageBreak(doc);
}

function generateInvestmentComparison(
  doc: jsPDF,
  data: PDFReportData,
  startY: number,
  chartImageDataUrl?: string | null
): number {
  const currentY = addSectionHeader(
    doc,
    "Investment Comparison",
    "Property vs Other Investment Options",
    startY
  );

  // Add ROI comparison chart if available
  let tableStartY = currentY + 20;
  if (chartImageDataUrl) {
    try {
      console.log("🔍 Attempting to add ROI comparison chart:", {
        hasData: !!chartImageDataUrl,
        length: chartImageDataUrl?.length || 0,
        startsWithData: chartImageDataUrl?.startsWith("data:") || false,
        preview: chartImageDataUrl?.substring(0, 100) || "N/A",
      });

      // Validate image data URL format
      if (!chartImageDataUrl.startsWith("data:image/png") && !chartImageDataUrl.startsWith("data:image/jpeg")) {
        console.warn("❌ Invalid chart image format for ROI comparison chart:", chartImageDataUrl.substring(0, 50));
      } else {
        const pageWidth = doc.internal.pageSize.getWidth();
        const chartWidth = pageWidth - SPACING.margin * 2;
        const chartHeight = 60; // 60mm height for chart

        // Try multiple approaches to add the image
        try {
          // Approach 1: Try with full data URL (standard approach)
          doc.addImage(chartImageDataUrl, "PNG", SPACING.margin, tableStartY, chartWidth, chartHeight);
          console.log("✅ Successfully added ROI comparison chart to PDF (method: data URL)");
        } catch (error1) {
          console.warn("⚠️ Method 1 (data URL) failed, trying base64 extraction:", error1);
          try {
            // Approach 2: Extract base64 from data URL
            const base64Match = chartImageDataUrl.match(/^data:image\/\w+;base64,(.+)$/);
            if (base64Match && base64Match[1]) {
              const base64Data = base64Match[1];
              doc.addImage(base64Data, "PNG", SPACING.margin, tableStartY, chartWidth, chartHeight);
              console.log("✅ Successfully added ROI comparison chart to PDF (method: base64)");
            } else {
              throw new Error("Could not extract base64 from data URL");
            }
          } catch (error2) {
            console.error("❌ Both methods failed for ROI comparison chart:", { error1, error2 });
            throw error2;
          }
        }
        tableStartY += chartHeight + 20;
      }
    } catch (error) {
      console.error("❌ Failed to add ROI comparison chart to PDF:", error);
      console.error("   Error details:", error instanceof Error ? error.message : String(error));
      console.error("   Chart data URL length:", chartImageDataUrl?.length || 0);
      console.warn("   Chart will be omitted from PDF");
    }
  } else {
    console.warn("⚠️ ROI comparison chart not provided, omitting from PDF");
  }

  // Investment comparison table
  const comparisonRows = [
    ["Property Investment", "8.5%", "125%", "█ █ █ █ █ █ █ █ ░ ░"],
    ["ASX 200 Stocks", "7.2%", "100%", "█ █ █ █ █ █ █ ░ ░ ░"],
    ["Term Deposit", "4.5%", "55%", "█ █ █ █ ░ ░ ░ ░ ░ ░"],
    ["Government Bonds", "3.8%", "45%", "█ █ █ ░ ░ ░ ░ ░ ░ ░"],
    ["High-Interest Savings", "3.2%", "38%", "█ █ ░ ░ ░ ░ ░ ░ ░ ░"],
  ];

  addDataTable(
    doc,
    ["Investment Type", "Annual Rate", "10-Year Return", "Visual Comparison"],
    comparisonRows,
    tableStartY,
    {
      title: "Investment Performance Comparison",
      widths: [60, 30, 30, 60],
      align: ["left", "right", "right", "left"],
    }
  );

  // Disclaimer box - need to get final Y position from table
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableEndY = tableStartY + 80; // Approximate table height
  const disclaimerY = tableEndY + 20;
  const disclaimerBoxWidth = doc.internal.pageSize.getWidth() - SPACING.margin * 2;
  const disclaimerBoxHeight = 40;

  // Light gray background
  doc.setFillColor(249, 250, 251); // #F9FAFB
  doc.roundedRect(SPACING.margin, disclaimerY, disclaimerBoxWidth, disclaimerBoxHeight, 3, 3, "F");

  // Gray border
  doc.setDrawColor(209, 213, 219); // #D1D5DB
  doc.setLineWidth(1);
  doc.roundedRect(SPACING.margin, disclaimerY, disclaimerBoxWidth, disclaimerBoxHeight, 3, 3, "S");

  // Disclaimer text
  doc.setTextColor(COLORS.gray[600]);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Disclaimer: Comparison assumes historical averages and does not account for individual risk tolerance,",
    SPACING.margin + 10,
    disclaimerY + 12
  );
  doc.text(
    "tax implications, or market volatility. Past performance does not guarantee future results.",
    SPACING.margin + 10,
    disclaimerY + 22
  );

  return addPageBreak(doc);
}

function generateGlossary(doc: jsPDF, startY: number): number {
  const currentY = addSectionHeader(doc, "Glossary", "Key Terms & Definitions", startY);

  const glossaryTerms = [
    [
      "FIRB",
      "Foreign Investment Review Board",
      "Australian government body regulating foreign property investment",
    ],
    [
      "ATO",
      "Australian Taxation Office",
      "Government agency responsible for tax collection and administration",
    ],
    ["ROI", "Return on Investment", "Percentage return on invested capital over time"],
    ["LVR", "Loan-to-Value Ratio", "Loan amount as percentage of property value"],
    ["CGT", "Capital Gains Tax", "Tax on profit from property sale"],
    ["GST", "Goods and Services Tax", "10% tax on most goods and services in Australia"],
    ["Stamp Duty", "Transfer Duty", "State government tax on property purchases"],
    [
      "Foreign Purchaser Surcharge",
      "Foreign Buyer Surcharge",
      "Additional stamp duty for non-resident buyers",
    ],
    ["Land Tax", "Annual Land Tax", "Annual tax on land ownership in some states"],
    [
      "Absentee Owner Surcharge",
      "Absentee Surcharge",
      "Additional land tax for non-resident owners",
    ],
    ["Vacancy Fee", "Foreign Owner Vacancy Fee", "Annual fee for foreign owners of vacant land"],
    [
      "Negative Gearing",
      "Negative Gearing",
      "When rental income is less than expenses, creating tax deductions",
    ],
    ["Depreciation", "Property Depreciation", "Tax deduction for wear and tear on property"],
    ["Gross Rental Yield", "Gross Yield", "Annual rental income divided by property value"],
    [
      "Net Rental Yield",
      "Net Yield",
      "Annual rental income minus expenses, divided by property value",
    ],
    ["Cash-on-Cash Return", "Cash Return", "Annual cash flow divided by initial cash investment"],
    ["Strata Fees", "Strata Levies", "Monthly fees for apartment/unit maintenance and management"],
    ["Council Rates", "Council Rates", "Annual local government property tax"],
    ["Settlement", "Property Settlement", "Legal process of transferring property ownership"],
    ["Conveyancing", "Conveyancing", "Legal process of property transfer"],
    ["New Dwelling", "New Dwelling", "Recently built property eligible for foreign purchase"],
    [
      "Established Dwelling",
      "Established Dwelling",
      "Existing property restricted for foreign buyers",
    ],
    ["Vacant Land", "Vacant Land", "Empty land requiring development approval"],
    ["Temporary Resident", "Temporary Resident", "Non-citizen with temporary visa status"],
    [
      "Ordinarily Resident",
      "Ordinarily Resident",
      "Person living in Australia with permanent residency",
    ],
    ["Equity", "Property Equity", "Difference between property value and outstanding loan"],
    ["Capital Growth", "Capital Growth", "Increase in property value over time"],
    ["Cash Flow", "Cash Flow", "Net income after all expenses"],
  ];

  // Two-column layout for glossary
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftColumnX = SPACING.margin;
  const rightColumnX = pageWidth / 2 + SPACING.margin;
  const lineHeight = 12;
  const currentTermY = currentY + 20;

  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);

  const midPoint = Math.ceil(glossaryTerms.length / 2);

  for (let i = 0; i < glossaryTerms.length; i++) {
    const term = glossaryTerms[i];
    const isLeftColumn = i < midPoint;
    const x = isLeftColumn ? leftColumnX : rightColumnX;
    const y = isLeftColumn
      ? currentTermY + i * lineHeight
      : currentTermY + (i - midPoint) * lineHeight;

    // Term in bold
    doc.setFont("helvetica", "bold");
    doc.text(term[0], x, y);

    // Full name in italics
    doc.setFont("helvetica", "italic");
    doc.setFontSize(FONTS.small);
    doc.text(` (${term[1]})`, x + doc.getTextWidth(term[0]) + 2, y);

    // Definition on next line
    doc.setFont("helvetica", "normal");
    doc.text(term[2], x, y + 6);
  }

  return addPageBreak(doc);
}

function generateDisclaimer(doc: jsPDF, startY: number): void {
  addSectionHeader(doc, "IMPORTANT LEGAL DISCLAIMER", "Comprehensive Legal Information", startY);

  let currentY = startY + 40;

  // Not Financial Advice section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Not Financial Advice", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "This report is provided for informational purposes only and does NOT constitute financial, investment, legal, or tax advice. The calculations and projections are estimates based on the information provided and current regulations.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Professional Advice Required section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Professional Advice Required", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "Before making any investment decisions, you must consult with qualified professionals including financial advisors, accountants, lawyers, and FIRB specialists. This report cannot replace personalized professional advice.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Information Accuracy section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Information Accuracy", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "All calculations are estimates based on current market conditions, interest rates, and tax laws. Actual costs, returns, and outcomes may vary significantly from these projections.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Regulation Changes section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Regulation Changes", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "FIRB regulations, tax laws, and property investment rules are subject to change. Always verify current regulations and requirements before proceeding with any investment.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Past Performance section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Past Performance", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "Past performance does not guarantee future results. Property values can go down as well as up, and rental income is not guaranteed.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Currency and Interest Rate Risk section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Currency and Interest Rate Risk", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "Foreign investors face currency exchange rate risks. Interest rate changes can significantly impact loan costs and property affordability.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Limitation of Liability section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Limitation of Liability", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "The creators of this report accept no liability for any losses, damages, or consequences arising from the use of this information or any investment decisions made based on this report.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );
  currentY += 25;

  // Data Sources & Updates section
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger);
  doc.text("Data Sources & Updates", SPACING.margin, currentY);
  currentY += 15;

  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.gray[800]);
  doc.text(
    "This report uses publicly available data and estimates. For the most current information, please consult: (1) FIRB website: https://firb.gov.au, (2) ATO Foreign Investment: https://ato.gov.au/foreign-investment, (3) State Revenue Offices for stamp duty rates, (4) Licensed professionals for personalized advice.",
    SPACING.margin,
    currentY,
    {
      maxWidth: doc.internal.pageSize.getWidth() - SPACING.margin * 2,
      align: "justify",
    }
  );

  addFooter(doc);
}
