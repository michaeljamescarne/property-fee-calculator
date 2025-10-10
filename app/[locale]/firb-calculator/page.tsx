/**
 * FIRB Calculator Main Page
 * Progressive disclosure wizard for FIRB calculations
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ProgressIndicator, { Step } from '@/components/firb/ProgressIndicator';
import CitizenshipStep from '@/components/firb/CitizenshipStep';
import PropertyDetailsStep from '@/components/firb/PropertyDetailsStep';
import ReviewStep from '@/components/firb/ReviewStep';
import ResultsPanel from '@/components/firb/ResultsPanel';
import EmailResultsModal from '@/components/firb/EmailResultsModal';
import { CitizenshipStatus, PropertyType, AustralianState, EntityType } from '@/lib/firb/constants';
import { FIRBCalculatorFormData } from '@/lib/validations/firb';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import { generateFIRBPDF } from '@/lib/pdf/generateFIRBPDF';

export default function FIRBCalculatorPage() {
  const t = useTranslations('FIRBCalculator');

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

  // Results state
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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
      setCurrentStep('review');
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep === 'property') {
      setCurrentStep('citizenship');
    } else if (currentStep === 'review') {
      setCurrentStep('property');
    } else if (currentStep === 'results') {
      setCurrentStep('review');
    }
  };

  // Handle edit from review
  const handleEdit = (step: 'citizenship' | 'property') => {
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
  const handleDownloadPDF = () => {
    if (!eligibility || !costs) return;

    try {
      const pdfBlob = generateFIRBPDF(formData, eligibility, costs);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FIRB-Analysis-${new Date().toISOString().split('T')[0]}.pdf`;
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

  return (
    <main className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t('title')}</h1>
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
          {/* Citizenship Step */}
          {currentStep === 'citizenship' && (
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
          {currentStep === 'property' && (
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

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <ReviewStep
                formData={formData}
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
          {currentStep === 'results' && eligibility && costs && (
            <ResultsPanel
              eligibility={eligibility}
              costs={costs}
              onDownloadPDF={handleDownloadPDF}
              onEmailResults={handleEmailResults}
              onEditCalculation={handleEditCalculation}
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
          />
        )}
        </div>
      </div>
    </main>
  );
}

