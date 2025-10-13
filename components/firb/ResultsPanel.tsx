/**
 * Results Panel Component
 * Displays eligibility verdict and cost breakdown
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CustomAlert } from '@/components/ui/custom-alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Download, Mail, Edit, CheckCircle, AlertTriangle, XCircle, Info, RotateCcw, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
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
import SaveCalculationButton from './SaveCalculationButton';
import LoginModal from '@/components/auth/LoginModal';

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
  const tAnalytics = useTranslations('FIRBCalculator.investmentAnalytics');
  
  // Auth state
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Investment Analytics State
  const [showInvestmentAnalysis, setShowInvestmentAnalysis] = useState(false);
  const [investmentInputs, setInvestmentInputs] = useState<InvestmentInputs>(() =>
    generateDefaultInputs(propertyValue, state, propertyType, depositPercent, costs)
  );
  
  // Calculate investment analytics
  const investmentAnalytics = useMemo(() => 
    calculateInvestmentAnalytics(investmentInputs, propertyValue, state, propertyType, costs),
    [investmentInputs, propertyValue, state, propertyType, costs]
  );
  
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

  const getEligibilityIcon = () => {
    if (!eligibility.canPurchase) return <XCircle className="h-6 w-6" />;
    if (eligibility.requiresFIRB) return <AlertTriangle className="h-6 w-6" />;
    return <CheckCircle className="h-6 w-6" />;
  };

  // Prepare calculation data for saving
  const calculationData: CalculationData = {
    citizenshipStatus: formData.citizenshipStatus!,
    visaType: formData.visaType,
    isOrdinarilyResident: formData.isOrdinarilyResident,
    propertyType: formData.propertyType!,
    propertyValue: formData.propertyValue!,
    state: formData.state!,
    propertyAddress: formData.propertyAddress,
    isFirstHome: formData.isFirstHome!,
    depositPercent: formData.depositPercent!,
    entityType: formData.entityType!,
    eligibility: eligibility,
    costs: costs,
  };


  return (
    <div className="space-y-6">
      {/* Eligibility Verdict */}
      <CustomAlert 
        variant={!eligibility.canPurchase ? 'destructive' : eligibility.requiresFIRB ? 'warning' : 'success'}
        icon={getEligibilityIcon()}
        title={eligibility.canPurchase ? t('eligible.title') : t('notEligible.title')}
      >
        {eligibility.canPurchase && eligibility.requiresFIRB && (
          <p className="font-medium">{t('eligible.firbRequired')}</p>
        )}
        {eligibility.canPurchase && !eligibility.requiresFIRB && (
          <p className="font-medium">{t('eligible.noFirbRequired')}</p>
        )}
        {!eligibility.canPurchase && (
          <p className="font-medium">{t('notEligible.description')}</p>
        )}
      </CustomAlert>

      {/* FIRB Processing Timeline */}
      {eligibility.requiresFIRB && eligibility.processingTimeline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      FIRB processing times vary depending on application complexity and current workload. 
                      Expedited processing is available for urgent cases at double the standard fee.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {t('processingTime.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground">{t('processingTime.standard')}</p>
                <p className="text-2xl font-bold mt-1">{eligibility.processingTimeline.standard}</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground">{t('processingTime.expedited')}</p>
                <p className="text-2xl font-bold mt-1">{eligibility.processingTimeline.expedited}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('processingTime.expeditedNote')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restrictions & Recommendations */}
      {eligibility.restrictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('restrictions.title')}</CardTitle>
            <CardDescription>{t('restrictions.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {eligibility.restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{restriction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {eligibility.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('recommendations.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {eligibility.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('costs.title')}</CardTitle>
          <CardDescription>{t('costs.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Total Investment Cost */}
          <div className="p-6 mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <p className="text-sm opacity-90">{t('costs.totalInvestment')}</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(costs.totalInvestmentCost)}</p>
            <p className="text-sm opacity-75 mt-2">
              {t('costs.propertyPrice')}: {formatCurrency(costs.upfrontCosts.propertyPrice)}
            </p>
            <p className="text-sm opacity-75">
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
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.amount)}</p>
                        </div>
                      </div>
                    ))}
                    {section.items.length > 1 && (
                      <div className="flex justify-between items-center pt-3 border-t font-semibold">
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
          <div className="mt-6 p-4 rounded-lg bg-muted">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{t('costs.annualOngoing')}</p>
                <p className="text-sm text-muted-foreground">{t('costs.annualOngoingNote')}</p>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(costs.ongoingCosts.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Analytics Toggle */}
      <Card 
        className="border-2 border-primary/30 shadow-lg rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 cursor-pointer hover:shadow-xl transition-all"
        onClick={() => setShowInvestmentAnalysis(!showInvestmentAnalysis)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-primary" />
                {tAnalytics('toggle.title') === 'FIRBCalculator.investmentAnalytics.toggle.title' 
                  ? 'Investment Analysis & Projections' 
                  : tAnalytics('toggle.title')}
              </CardTitle>
              <CardDescription className="mt-2">
                {tAnalytics('toggle.description') === 'FIRBCalculator.investmentAnalytics.toggle.description'
                  ? 'See rental yields, ROI, 10-year projections, cash flow analysis, and compare against other investments'
                  : tAnalytics('toggle.description')}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="gap-2 font-semibold"
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
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          onClick={() => onDownloadPDF(showInvestmentAnalysis ? investmentAnalytics : undefined)}
          variant="default"
          size="lg"
          className="gap-2"
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
          className="gap-2"
        >
          <Mail className="h-5 w-5" />
          {t('actions.emailResults')}
        </Button>
        <Button
          onClick={onEditCalculation}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Edit className="h-5 w-5" />
          {t('actions.editCalculation')}
        </Button>
        <Button
          onClick={onStartAgain}
          variant="outline"
          size="lg"
          className="gap-2"
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
    </div>
  );
}

