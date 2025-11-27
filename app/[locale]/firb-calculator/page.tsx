/**
 * FIRB Calculator Main Page
 * Progressive disclosure wizard for FIRB calculations
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ProgressIndicator, { Step } from '@/components/firb/ProgressIndicator';
import CitizenshipStep from '@/components/firb/CitizenshipStep';
import PropertyDetailsStep from '@/components/firb/PropertyDetailsStep';
import FinancialDetailsStep from '@/components/firb/FinancialDetailsStep';
import ReviewStep from '@/components/firb/ReviewStep';
import ResultsPanel from '@/components/firb/ResultsPanel';
import EmailResultsModal from '@/components/firb/EmailResultsModal';
import { CitizenshipStatus, PropertyType, AustralianState, EntityType } from '@/lib/firb/constants';
import { FIRBCalculatorFormData } from '@/lib/validations/firb';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import { generateFIRBPDF } from '@/lib/pdf/generateFIRBPDF';
import { generateEnhancedPDF } from '@/lib/pdf/generateEnhancedPDF';
import type { InvestmentAnalytics, InvestmentInputs } from '@/types/investment';

export default function FIRBCalculatorPage() {
  const t = useTranslations('FIRBCalculator');
  const tPdf = useTranslations('FIRBCalculator.pdf');
  const locale = useLocale();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<Step>('citizenship');
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  // Form data
  const [formData, setFormData] = useState<Partial<FIRBCalculatorFormData>>({
    citizenshipStatus: '' as CitizenshipStatus,
    propertyType: '' as PropertyType,
    propertyValue: 0,
    state: '' as AustralianState,
    isFirstHome: false,
    depositPercent: 20,
    entityType: 'individual' as EntityType,
    isOrdinarilyResident: true,
    expeditedFIRB: false
  });

  // Investment inputs state
  const [investmentInputs, setInvestmentInputs] = useState<Partial<InvestmentInputs>>({});

  // Results state
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Loading state for saved calculations
  const [isLoadingSavedCalculation, setIsLoadingSavedCalculation] = useState(false);

  // Get URL search parameters
  const searchParams = useSearchParams();

  // Load saved calculation if load parameter is present
  useEffect(() => {
    const loadId = searchParams.get('load');
    if (loadId && !isLoadingSavedCalculation && !eligibility && !costs) {
      loadSavedCalculation(loadId);
    }
  }, [searchParams, isLoadingSavedCalculation, eligibility, costs]);

  // Initialize investment inputs when property details are available
  useEffect(() => {
    if (formData.propertyValue && formData.state && formData.propertyType && Object.keys(investmentInputs).length === 0) {
      // Generate default investment inputs (without costs, will be updated after calculation)
      const depositAmount = (formData.propertyValue || 0) * ((formData.depositPercent || 20) / 100);
      const loanAmount = (formData.propertyValue || 0) - depositAmount;
      
      // Estimate weekly rent based on state
      const yieldRates: Record<AustralianState, number> = {
        NSW: 0.032,
        VIC: 0.034,
        QLD: 0.045,
        WA: 0.042,
        SA: 0.041,
        TAS: 0.048,
        ACT: 0.038,
        NT: 0.055,
      };
      const grossYield = yieldRates[formData.state] || 0.04;
      const annualRent = (formData.propertyValue || 0) * grossYield;
      const weeklyRent = Math.round(annualRent / 52);

      setInvestmentInputs({
        estimatedWeeklyRent: weeklyRent,
        vacancyRate: 5,
        rentGrowthRate: 3,
        propertyManagementFee: 8,
        lettingFee: 2,
        selfManaged: false,
        loanAmount,
        interestRate: 6.5,
        loanTerm: 30,
        loanType: 'principalAndInterest',
        interestOnlyPeriod: 0,
        holdPeriod: 10,
        capitalGrowthRate: 6,
        marginalTaxRate: 37,
        currencyExchangeRate: 1,
        homeCurrency: 'AUD',
        sellingCosts: 4,
        cgtWithholdingRate: 12.5,
      });
    }
  }, [formData.propertyValue, formData.state, formData.propertyType, formData.depositPercent]);

  // Function to load saved calculation
  const loadSavedCalculation = async (calculationId: string) => {
    setIsLoadingSavedCalculation(true);
    
    try {
      const response = await fetch(`/api/calculations/${calculationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load calculation');
      }
      
      const data = await response.json();
      
      if (data.success && data.calculation) {
        const calculation = data.calculation;
        const calculationData = calculation.calculation_data;
        
        // Pre-fill form data
        setFormData({
          citizenshipStatus: calculationData.citizenshipStatus,
          visaType: calculationData.visaType,
          isOrdinarilyResident: calculationData.isOrdinarilyResident,
          propertyType: calculationData.propertyType,
          propertyValue: calculationData.propertyValue,
          state: calculationData.propertyState, // Map propertyState to state
          propertyAddress: calculationData.propertyAddress,
          isFirstHome: calculationData.isFirstHome,
          depositPercent: calculationData.depositPercent,
          entityType: calculationData.entityType,
          expeditedFIRB: false // Default value since it's not saved
        });
        
        // Set results
        setEligibility(calculationData.eligibility);
        setCosts(calculationData.costs);
        
        // Mark all steps as completed and jump to results
        setCompletedSteps(['citizenship', 'property', 'financial', 'review']);
        setCurrentStep('results');
      }
    } catch (error) {
      console.error('Error loading saved calculation:', error);
      alert('Failed to load saved calculation. Please try again.');
    } finally {
      setIsLoadingSavedCalculation(false);
    }
  };

  // Prepare PDF translations (memoized for performance)
  const pdfTranslations = useMemo(() => ({
    title: tPdf('title'),
    subtitle: tPdf('subtitle'),
    generatedOn: tPdf('generatedOn'),
    page: tPdf('page'),
    sections: {
      executiveSummary: tPdf('sections.executiveSummary'),
      propertyDetails: tPdf('sections.propertyDetails'),
      keyMetrics: tPdf('sections.keyMetrics'),
      firbRequirements: tPdf('sections.firbRequirements'),
      eligibilityStatus: tPdf('sections.eligibilityStatus'),
      propertyType: tPdf('sections.propertyType'),
      costBreakdown: tPdf('sections.costBreakdown'),
      investmentPerformance: tPdf('sections.investmentPerformance'),
      rentalYield: tPdf('sections.rentalYield'),
      cashFlow: tPdf('sections.cashFlow'),
      projections: tPdf('sections.projections'),
      equityGrowth: tPdf('sections.equityGrowth'),
      breakEven: tPdf('sections.breakEven'),
      comparison: tPdf('sections.comparison'),
      assetComparison: tPdf('sections.assetComparison'),
      sensitivity: tPdf('sections.sensitivity'),
      riskScenarios: tPdf('sections.riskScenarios'),
      taxAnalysis: tPdf('sections.taxAnalysis'),
      deductions: tPdf('sections.deductions'),
      cgtProjection: tPdf('sections.cgtProjection'),
      recommendations: tPdf('sections.recommendations'),
      overallScore: tPdf('sections.overallScore'),
      recommendation: tPdf('sections.recommendation'),
    },
    labels: {
      address: tPdf('labels.address'),
      state: tPdf('labels.state'),
      value: tPdf('labels.value'),
      deposit: tPdf('labels.deposit'),
      citizenshipStatus: tPdf('labels.citizenshipStatus'),
      entityType: tPdf('labels.entityType'),
      eligible: tPdf('labels.eligible'),
      notEligible: tPdf('labels.notEligible'),
      firbRequired: tPdf('labels.firbRequired'),
      noFirbRequired: tPdf('labels.noFirbRequired'),
      firbFee: tPdf('labels.firbFee'),
      stampDuty: tPdf('labels.stampDuty'),
      foreignSurcharge: tPdf('labels.foreignSurcharge'),
      legalFees: tPdf('labels.legalFees'),
      totalUpfront: tPdf('labels.totalUpfront'),
      annualLandTax: tPdf('labels.annualLandTax'),
      grossYield: tPdf('labels.grossYield'),
      netYield: tPdf('labels.netYield'),
      annualizedROI: tPdf('labels.annualizedROI'),
      monthlyCashFlow: tPdf('labels.monthlyCashFlow'),
      annualIncome: tPdf('labels.annualIncome'),
      annualExpenses: tPdf('labels.annualExpenses'),
      afterTaxCashFlow: tPdf('labels.afterTaxCashFlow'),
      taxBenefit: tPdf('labels.taxBenefit'),
      propertyValue: tPdf('labels.propertyValue'),
      equity: tPdf('labels.equity'),
      loanBalance: tPdf('labels.loanBalance'),
      year: tPdf('labels.year'),
      cumulativeReturn: tPdf('labels.cumulativeReturn'),
      breakEvenYear: tPdf('labels.breakEvenYear'),
      cashRequired: tPdf('labels.cashRequired'),
      investmentType: tPdf('labels.investmentType'),
      annualReturn: tPdf('labels.annualReturn'),
      yearReturn: tPdf('labels.yearReturn', { years: 10 }),
      riskLevel: tPdf('labels.riskLevel'),
      vacancyImpact: tPdf('labels.vacancyImpact'),
      interestImpact: tPdf('labels.interestImpact'),
      growthScenarios: tPdf('labels.growthScenarios'),
      conservative: tPdf('labels.conservative'),
      moderate: tPdf('labels.moderate'),
      optimistic: tPdf('labels.optimistic'),
      deductibleExpenses: tPdf('labels.deductibleExpenses'),
      loanInterest: tPdf('labels.loanInterest'),
      propertyManagement: tPdf('labels.propertyManagement'),
      maintenance: tPdf('labels.maintenance'),
      landTax: tPdf('labels.landTax'),
      councilRates: tPdf('labels.councilRates'),
      insurance: tPdf('labels.insurance'),
      strataFees: tPdf('labels.strataFees'),
      depreciation: tPdf('labels.depreciation'),
      other: tPdf('labels.other'),
      totalDeductions: tPdf('labels.totalDeductions'),
      salePrice: tPdf('labels.salePrice'),
      costBase: tPdf('labels.costBase'),
      capitalGain: tPdf('labels.capitalGain'),
      cgtPayable: tPdf('labels.cgtPayable'),
      withholdingTax: tPdf('labels.withholdingTax'),
      netProceeds: tPdf('labels.netProceeds'),
      overallVerdict: tPdf('labels.overallVerdict'),
      scoreBreakdown: tPdf('labels.scoreBreakdown'),
      rentalYieldScore: tPdf('labels.rentalYieldScore'),
      capitalGrowthScore: tPdf('labels.capitalGrowthScore'),
      cashFlowScore: tPdf('labels.cashFlowScore'),
      taxEfficiencyScore: tPdf('labels.taxEfficiencyScore'),
      riskProfileScore: tPdf('labels.riskProfileScore'),
      strengths: tPdf('labels.strengths'),
      weaknesses: tPdf('labels.weaknesses'),
      keyTakeaways: tPdf('labels.keyTakeaways'),
    },
    notes: {
      estimatesOnly: tPdf('notes.estimatesOnly'),
      professionalAdvice: tPdf('notes.professionalAdvice'),
      regulationsChange: tPdf('notes.regulationsChange'),
      assumptionsBased: tPdf('notes.assumptionsBased'),
      pastPerformance: tPdf('notes.pastPerformance'),
    },
  }), [tPdf]);

  // Update form data
  const updateFormData = (updates: Partial<FIRBCalculatorFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Validate current step
  const validateStep = (step: Step): boolean => {
    if (step === 'citizenship') {
      if (!formData.citizenshipStatus) return false;
      if (formData.citizenshipStatus === 'temporary' && !formData.visaType) return false;
      return true;
    }

    if (step === 'property') {
      return !!(
        formData.propertyType &&
        formData.propertyValue &&
        formData.propertyValue > 0 &&
        formData.state
      );
    }

    if (step === 'financial') {
      // Financial step is optional but we should have at least weekly rent
      return !!(investmentInputs.estimatedWeeklyRent && investmentInputs.estimatedWeeklyRent > 0);
    }

    return true;
  };

  // Handle next button
  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    // Move to next step
    if (currentStep === 'citizenship') {
      setCurrentStep('property');
    } else if (currentStep === 'property') {
      setCurrentStep('financial');
    } else if (currentStep === 'financial') {
      setCurrentStep('review');
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep === 'property') {
      setCurrentStep('citizenship');
    } else if (currentStep === 'financial') {
      setCurrentStep('property');
    } else if (currentStep === 'review') {
      setCurrentStep('financial');
    } else if (currentStep === 'results') {
      setCurrentStep('review');
    }
  };

  // Handle edit from review
  const handleEdit = (step: 'citizenship' | 'property' | 'financial') => {
    setCurrentStep(step);
  };

  // Handle calculate
  const handleCalculate = async () => {
    setIsCalculating(true);

    try {
      const response = await fetch('/api/firb-calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data = await response.json();

      setEligibility(data.eligibility);
      setCosts(data.costs);

      // Mark review as completed and move to results
      if (!completedSteps.includes('review')) {
        setCompletedSteps(prev => [...prev, 'review']);
      }
      setCurrentStep('results');

    } catch (error) {
      console.error('Calculation error:', error);
      alert('Failed to calculate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle download PDF
  const handleDownloadPDF = async (analytics?: InvestmentAnalytics) => {
    if (!eligibility || !costs) return;

    try {
      // Use enhanced PDF if analytics are provided, otherwise basic PDF
      const pdfBlob = analytics 
        ? await generateEnhancedPDF(formData, eligibility, costs, analytics, locale, pdfTranslations)
        : generateFIRBPDF(formData, eligibility, costs);
        
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = analytics 
        ? `FIRB-Investment-Analysis-${locale}-${timestamp}.pdf`
        : `FIRB-Analysis-${timestamp}.pdf`;
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Handle email results
  const handleEmailResults = () => {
    setIsEmailModalOpen(true);
  };

  // Handle edit calculation from results
  const handleEditCalculation = () => {
    setCurrentStep('review');
  };

  // Handle start again - reset everything
  const handleStartAgain = () => {
    // Reset all form data
    setFormData({
      citizenshipStatus: undefined,
      visaType: undefined,
      isOrdinarilyResident: undefined,
      propertyType: undefined,
      propertyValue: undefined,
      state: undefined,
      propertyAddress: '',
      isFirstHome: false,
      depositPercent: 20,
      entityType: 'individual',
    });
    
    // Reset steps
    setCurrentStep('citizenship');
    setCompletedSteps([]);
    
    // Clear results
    setEligibility(null);
    setCosts(null);
  };

  return (
    <main className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('title')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Step Content */}
        <div className="mt-8">
          {/* Loading Saved Calculation */}
          {isLoadingSavedCalculation && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-lg text-muted-foreground">Loading saved calculation...</p>
              </div>
            </div>
          )}

          {/* Citizenship Step */}
          {!isLoadingSavedCalculation && currentStep === 'citizenship' && (
            <div className="space-y-6">
              <CitizenshipStep
                citizenshipStatus={formData.citizenshipStatus || ''}
                visaType={formData.visaType}
                isOrdinarilyResident={formData.isOrdinarilyResident}
                onCitizenshipStatusChange={(status) =>
                  updateFormData({ citizenshipStatus: status })
                }
                onVisaTypeChange={(type) => updateFormData({ visaType: type })}
                onOrdinarilyResidentChange={(isResident) =>
                  updateFormData({ isOrdinarilyResident: isResident })
                }
              />

              {/* Navigation */}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!validateStep('citizenship')}
                  className="gap-2"
                >
                  {t('next')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Property Details Step */}
          {!isLoadingSavedCalculation && currentStep === 'property' && (
            <div className="space-y-6">
              <PropertyDetailsStep
                propertyType={formData.propertyType || ''}
                propertyValue={formData.propertyValue || 0}
                state={formData.state || ''}
                propertyAddress={formData.propertyAddress}
                isFirstHome={formData.isFirstHome || false}
                depositPercent={formData.depositPercent || 20}
                entityType={formData.entityType || 'individual'}
                onPropertyTypeChange={(type) => updateFormData({ propertyType: type })}
                onPropertyValueChange={(value) => updateFormData({ propertyValue: value })}
                onStateChange={(state) => updateFormData({ state })}
                onPropertyAddressChange={(address) =>
                  updateFormData({ propertyAddress: address })
                }
                onFirstHomeChange={(isFirstHome) => updateFormData({ isFirstHome })}
                onDepositPercentChange={(percent) =>
                  updateFormData({ depositPercent: percent })
                }
                onEntityTypeChange={(type) => updateFormData({ entityType: type })}
              />

              {/* Navigation */}
              <div className="flex justify-between">
                <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  {t('back')}
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!validateStep('property')}
                  className="gap-2"
                >
                  {t('next')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Financial Details Step */}
          {!isLoadingSavedCalculation && currentStep === 'financial' && formData.propertyValue && formData.state && formData.propertyType && (
            <div className="space-y-6">
              <FinancialDetailsStep
                investmentInputs={investmentInputs}
                onInvestmentInputsChange={(updates) => {
                  setInvestmentInputs(prev => ({ ...prev, ...updates }));
                }}
                propertyValue={formData.propertyValue}
                depositPercent={formData.depositPercent || 20}
              />

              {/* Navigation */}
              <div className="flex justify-between">
                <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  {t('back')}
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!validateStep('financial')}
                  className="gap-2"
                >
                  {t('next')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {!isLoadingSavedCalculation && currentStep === 'review' && (
            <div className="space-y-6">
              <ReviewStep
                formData={formData}
                investmentInputs={investmentInputs}
                onEdit={handleEdit}
                onCalculate={handleCalculate}
                isCalculating={isCalculating}
              />

              {/* Navigation */}
              <div className="flex justify-start">
                <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  {t('back')}
                </Button>
              </div>
            </div>
          )}

          {/* Results Step */}
          {!isLoadingSavedCalculation && currentStep === 'results' && eligibility && costs && formData.propertyValue && formData.propertyType && formData.state && (
            <ResultsPanel
              eligibility={eligibility}
              costs={costs}
              onDownloadPDF={handleDownloadPDF}
              onEmailResults={handleEmailResults}
              onEditCalculation={handleEditCalculation}
              onStartAgain={handleStartAgain}
              propertyValue={formData.propertyValue}
              propertyType={formData.propertyType}
              state={formData.state}
              depositPercent={formData.depositPercent || 20}
              formData={formData as FIRBCalculatorFormData}
            />
          )}
        </div>

        {/* Email Modal */}
        {eligibility && costs && (
          <EmailResultsModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            eligibility={eligibility}
            costs={costs}
            formData={formData as FIRBCalculatorFormData}
            locale={locale}
            pdfTranslations={pdfTranslations}
          />
        )}
        </div>
      </div>
    </main>
  );
}

