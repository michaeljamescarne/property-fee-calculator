/**
 * Results Panel Component
 * Displays eligibility verdict and cost breakdown
 */

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Download, Mail, Edit, Info, RotateCcw, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import { PropertyType, AustralianState } from '@/lib/firb/constants';
import { generateDefaultInputs, calculateInvestmentAnalytics } from '@/lib/firb/investment-analytics';
import type { InvestmentInputs, InvestmentAnalytics } from '@/types/investment';
import type { FIRBCalculatorFormData } from '@/lib/validations/firb';
import type { CalculationData } from '@/types/database';
import InvestmentInputsComponent from './InvestmentInputs';
import InvestmentSummary from './InvestmentSummary';
import CashFlowAnalysis from './CashFlowAnalysis';
import ProjectionChart from './ProjectionChart';
import InvestmentComparison from './InvestmentComparison';
import SensitivityAnalysis from './SensitivityAnalysis';
import TaxAnalysis from './TaxAnalysis';
import InvestmentScore from './InvestmentScore';
import OptimalUseCaseSection from './OptimalUseCaseSection';
import SaveCalculationButton from './SaveCalculationButton';
import LoginModal from '@/components/auth/LoginModal';
import EligibilityResultCard from './EligibilityResultCard';
import PrintableReport from './PrintableReport';
import BenchmarkComparison from './BenchmarkComparison';
import { calculateOptimalUseCase, getDefaultOccupancyRate } from '@/lib/firb/optimal-use-case';
import type { ShortStayRegulation } from '@/lib/firb/optimal-use-case';
import type { BenchmarkData } from '@/app/api/benchmarks/route';

interface ResultsPanelProps {
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  onDownloadPDF: (analytics?: InvestmentAnalytics) => void;
  onEmailResults: () => void;
  onEditCalculation: () => void;
  onStartAgain: () => void;
  propertyValue: number;
  propertyType: PropertyType;
  state: AustralianState;
  depositPercent: number;
  formData: FIRBCalculatorFormData;
}

export default function ResultsPanel({
  eligibility,
  costs,
  onDownloadPDF,
  onEmailResults,
  onEditCalculation,
  onStartAgain,
  propertyValue,
  propertyType,
  state,
  depositPercent,
  formData
}: ResultsPanelProps) {
  const t = useTranslations('FIRBCalculator.results');
  const tAnalytics = useTranslations('FIRBCalculator.results.investmentAnalytics');
  
  // Auth state
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Print ref for browser-based PDF generation
  const printRef = useRef<HTMLDivElement>(null);
  
  // Setup print handler
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FIRB-Investment-Analysis-${new Date().toISOString().split('T')[0]}`,
  });
  
  // Investment Analytics State
  const [showInvestmentAnalysis, setShowInvestmentAnalysis] = useState(false);
  const [investmentInputs, setInvestmentInputs] = useState<InvestmentInputs>(() =>
    generateDefaultInputs(propertyValue, state, propertyType, depositPercent, costs)
  );
  
  // Short-stay regulations state
  const [shortStayRegulations, setShortStayRegulations] = useState<ShortStayRegulation | null>(null);
  const [isLoadingRegulations, setIsLoadingRegulations] = useState(false);
  
  // Benchmark data state
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);
  
  // Calculate investment analytics
  const investmentAnalytics = useMemo(() => 
    calculateInvestmentAnalytics(investmentInputs, propertyValue, state, propertyType, costs),
    [investmentInputs, propertyValue, state, propertyType, costs]
  );
  
  // Calculate optimal use case
  const optimalUseCase = useMemo(() => {
    if (!investmentInputs.estimatedWeeklyRent) return null;
    return calculateOptimalUseCase(
      investmentInputs,
      propertyValue,
      state,
      propertyType,
      costs,
      shortStayRegulations
    );
  }, [investmentInputs, propertyValue, state, propertyType, costs, shortStayRegulations]);
  
  // Fetch short-stay regulations on mount
  useEffect(() => {
    const fetchRegulations = async () => {
      setIsLoadingRegulations(true);
      try {
        const params = new URLSearchParams({
          state: state,
        });
        
        // Add address details if available
        if (formData.propertyAddress) {
          // Try to extract postcode from address
          const postcodeMatch = formData.propertyAddress.match(/\b\d{4}\b/);
          if (postcodeMatch) {
            params.append('postcode', postcodeMatch[0]);
          }
        }
        
        const response = await fetch(`/api/short-stay-regulations?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.regulation) {
            setShortStayRegulations(data.regulation);
          }
        }
      } catch (error) {
        console.error('Failed to fetch short-stay regulations:', error);
      } finally {
        setIsLoadingRegulations(false);
      }
    };
    
    fetchRegulations();
  }, [state, formData.propertyAddress]);
  
  // Handle investment input changes
  const handleInvestmentInputChange = (updates: Partial<InvestmentInputs>) => {
    setInvestmentInputs(prev => ({ ...prev, ...updates }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare calculation data for saving
  const calculationData: CalculationData = {
    citizenshipStatus: formData.citizenshipStatus!,
    visaType: formData.visaType,
    isOrdinarilyResident: formData.isOrdinarilyResident,
    propertyType: formData.propertyType!,
    propertyValue: formData.propertyValue!,
    propertyState: formData.state!,
    propertyAddress: formData.propertyAddress,
    isFirstHome: formData.isFirstHome!,
    depositPercent: formData.depositPercent!,
    entityType: formData.entityType!,
    eligibility: eligibility,
    costs: costs,
  };


  return (
    <div className="space-y-6">
      {/* Enhanced FIRB Eligibility Results */}
      <EligibilityResultCard 
        eligibility={eligibility}
        formData={formData}
      />

      {/* Cost Breakdown */}
      <Card className="border border-gray-200 shadow-sm rounded bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">{t('costs.title')}</CardTitle>
          <CardDescription className="text-gray-600">{t('costs.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Total Investment Cost */}
          <div className="p-6 mb-6 rounded bg-blue-600 text-white">
            <p className="text-sm text-white/90">{t('costs.totalInvestment')}</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(costs.totalInvestmentCost)}</p>
            <p className="text-sm text-white/75 mt-2">
              {t('costs.propertyPrice')}: {formatCurrency(costs.upfrontCosts.propertyPrice)}
            </p>
            <p className="text-sm text-white/75">
              {t('costs.upfrontCosts')}: {formatCurrency(costs.upfrontCosts.total)}
            </p>
          </div>

          {/* Detailed Breakdown */}
          <Accordion type="multiple" className="w-full">
            {costs.breakdown.map((section, index) => (
              <AccordionItem key={index} value={`section-${index}`}>
                <AccordionTrigger className="text-base font-semibold">
                  {section.category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
                        </div>
                      </div>
                    ))}
                    {section.items.length > 1 && (
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-semibold text-gray-900">
                        <span>{t('costs.subtotal')}</span>
                        <span>
                          {formatCurrency(
                            section.items.reduce((sum, item) => sum + item.amount, 0)
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Ongoing Costs Summary */}
          <div className="mt-6 p-4 rounded bg-gray-50 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{t('costs.annualOngoing')}</p>
                <p className="text-sm text-gray-600">{t('costs.annualOngoingNote')}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(costs.ongoingCosts.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Analytics Toggle */}
      <Card 
        className="border-2 border-blue-200 shadow-md rounded bg-blue-50 cursor-pointer hover:shadow-lg hover:border-blue-600 transition-all"
        onClick={() => setShowInvestmentAnalysis(!showInvestmentAnalysis)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                {tAnalytics('toggle.title') === 'FIRBCalculator.investmentAnalytics.toggle.title' 
                  ? 'Investment Analysis & Projections' 
                  : tAnalytics('toggle.title')}
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                {tAnalytics('toggle.description') === 'FIRBCalculator.investmentAnalytics.toggle.description'
                  ? 'See rental yields, ROI, 10-year projections, cash flow analysis, and compare against other investments'
                  : tAnalytics('toggle.description')}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="gap-2 font-semibold rounded"
              onClick={(e) => {
                e.stopPropagation();
                setShowInvestmentAnalysis(!showInvestmentAnalysis);
              }}
            >
              {showInvestmentAnalysis ? (
                <>
                  {tAnalytics('toggle.hide') === 'FIRBCalculator.investmentAnalytics.toggle.hide' 
                    ? 'Hide Analysis' 
                    : tAnalytics('toggle.hide')} <ChevronUp className="h-5 w-5" />
                </>
              ) : (
                <>
                  {tAnalytics('toggle.show') === 'FIRBCalculator.investmentAnalytics.toggle.show'
                    ? 'Show Investment Analysis'
                    : tAnalytics('toggle.show')} <ChevronDown className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Investment Analytics Content */}
      {showInvestmentAnalysis && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
          {/* Investment Inputs */}
          <InvestmentInputsComponent 
            inputs={investmentInputs}
            onChange={handleInvestmentInputChange}
          />

          {/* Investment Summary */}
          <InvestmentSummary analytics={investmentAnalytics} />

          {/* Benchmark Comparison */}
          <BenchmarkComparison
            benchmarkData={benchmarkData}
            investmentInputs={investmentInputs}
            investmentAnalytics={investmentAnalytics}
            propertyValue={propertyValue}
            state={state}
          />

          {/* Cash Flow Analysis */}
          <CashFlowAnalysis analytics={investmentAnalytics} />

          {/* 10-Year Projection */}
          <ProjectionChart analytics={investmentAnalytics} />

          {/* Investment Comparison */}
          <InvestmentComparison analytics={investmentAnalytics} />

          {/* Sensitivity Analysis */}
          <SensitivityAnalysis analytics={investmentAnalytics} />

          {/* Tax Analysis */}
          <TaxAnalysis analytics={investmentAnalytics} />

          {/* Investment Score & Recommendation */}
          <InvestmentScore analytics={investmentAnalytics} />

          {/* Optimal Use Case Analysis */}
          {optimalUseCase && (
            <OptimalUseCaseSection 
              comparison={optimalUseCase}
              propertyValue={propertyValue}
            />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          onClick={handlePrint}
          variant="default"
          size="lg"
          className="gap-2 rounded"
        >
          <Download className="h-5 w-5" />
          {t('actions.downloadPDF')}
          {showInvestmentAnalysis && <span className="text-xs ml-1">(with analytics)</span>}
        </Button>
        
        {/* Save Calculation Button */}
        <SaveCalculationButton
          calculationData={calculationData}
          onLoginClick={() => setShowLoginModal(true)}
          className="sm:flex-shrink-0"
        />
        
        <Button
          onClick={onEmailResults}
          variant="outline"
          size="lg"
          className="gap-2 rounded"
        >
          <Mail className="h-5 w-5" />
          {t('actions.emailResults')}
        </Button>
        <Button
          onClick={onEditCalculation}
          variant="outline"
          size="lg"
          className="gap-2 rounded"
        >
          <Edit className="h-5 w-5" />
          {t('actions.editCalculation')}
        </Button>
        <Button
          onClick={onStartAgain}
          variant="outline"
          size="lg"
          className="gap-2 rounded"
        >
          <RotateCcw className="h-5 w-5" />
          {t('actions.startAgain')}
        </Button>
      </div>

      {/* Disclaimer */}
      <CustomAlert 
        variant="default"
        icon={<Info className="h-4 w-4" />}
        title={t('disclaimer.title')}
      >
        <p className="text-sm">
          {t('disclaimer.content')}
        </p>
      </CustomAlert>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Hidden Printable Report for Browser-Based PDF Generation */}
      <div ref={printRef}>
        <PrintableReport
          eligibility={eligibility}
          costs={costs}
          formData={formData}
          analytics={showInvestmentAnalysis ? investmentAnalytics : undefined}
        />
      </div>
    </div>
  );
}

