/**
 * Financial Details Step Component
 * Collects financial information for investment analysis
 */

'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Home, Calculator } from 'lucide-react';
import type { InvestmentInputs } from '@/types/investment';

interface FinancialDetailsStepProps {
  investmentInputs: Partial<InvestmentInputs>;
  onInvestmentInputsChange: (updates: Partial<InvestmentInputs>) => void;
  propertyValue: number;
  depositPercent: number;
}

export default function FinancialDetailsStep({
  investmentInputs,
  onInvestmentInputsChange,
  propertyValue,
  depositPercent
}: FinancialDetailsStepProps) {
  const t = useTranslations('FIRBCalculator.financialDetails');

  // Calculate loan amount
  const depositAmount = propertyValue * (depositPercent / 100);
  const loanAmount = propertyValue - depositAmount;

  // Default values
  const weeklyRent = investmentInputs.estimatedWeeklyRent || Math.round((propertyValue * 0.04) / 52);
  const capitalGrowthRate = investmentInputs.capitalGrowthRate || 6;
  const interestRate = investmentInputs.interestRate || 6.5;
  const councilRates = investmentInputs.annualMaintenanceCost || 0; // This will be updated to use council rates

  return (
    <Card className="border-none shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          {t('title') || 'Financial Details'}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {t('description') || 'Enter financial details for investment analysis'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rental Income */}
        <div className="space-y-4 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">
              {t('rental.title') || 'Rental Income'}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weekly-rent" className="text-sm">
              {t('rental.weeklyRent') || 'Estimated Weekly Rent'}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">$</span>
              <Input
                id="weekly-rent"
                type="number"
                value={weeklyRent}
                onChange={(e) => onInvestmentInputsChange({ 
                  estimatedWeeklyRent: Number(e.target.value) || 0 
                })}
                className="flex-1"
                placeholder="e.g., 500"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                (${(weeklyRent * 52).toLocaleString('en-AU')} per year)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('rental.help') || 'Based on similar properties in the area. You can adjust this later.'}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              {t('rental.vacancyRate') || 'Vacancy Rate'}: {investmentInputs.vacancyRate || 5}%
            </Label>
            <Slider
              value={[investmentInputs.vacancyRate || 5]}
              onValueChange={(value) => onInvestmentInputsChange({ vacancyRate: value[0] })}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {t('rental.vacancyHelp') || 'Typical: 3-5% for good locations, 7-10% for high-risk areas'}
            </p>
          </div>
        </div>

        {/* Capital Growth */}
        <div className="space-y-4 p-4 rounded-lg border-2 border-accent/20 bg-accent/5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <Label className="text-base font-semibold">
              {t('growth.title') || 'Capital Growth Projections'}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">
              {t('growth.rate') || 'Expected Annual Capital Growth'}: {capitalGrowthRate}%
            </Label>
            <Slider
              value={[capitalGrowthRate]}
              onValueChange={(value) => onInvestmentInputsChange({ capitalGrowthRate: value[0] })}
              min={0}
              max={15}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('growth.conservative') || 'Conservative (4%)'}</span>
              <span>{t('growth.moderate') || 'Moderate (6%)'}</span>
              <span>{t('growth.optimistic') || 'Optimistic (8%)'}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('growth.help') || 'Historical average: 6% per year. Adjust based on your expectations.'}
            </p>
          </div>
        </div>

        {/* Loan Details */}
        {loanAmount > 0 && (
          <div className="space-y-4 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-semibold">
                {t('loan.title') || 'Loan Details'}
              </Label>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t('loan.amount') || 'Loan Amount'}
                  </span>
                  <span className="font-semibold">
                    ${loanAmount.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t('loan.deposit') || 'Deposit'}
                  </span>
                  <span className="font-semibold">
                    ${depositAmount.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  {t('loan.interestRate') || 'Interest Rate'}: {interestRate}%
                </Label>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => onInvestmentInputsChange({ interestRate: value[0] })}
                  min={3}
                  max={12}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('loan.interestHelp') || 'Current market rates: 5.5-7.5%'}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  {t('loan.term') || 'Loan Term'}: {investmentInputs.loanTerm || 30} years
                </Label>
                <Slider
                  value={[investmentInputs.loanTerm || 30]}
                  onValueChange={(value) => onInvestmentInputsChange({ loanTerm: value[0] })}
                  min={15}
                  max={30}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border bg-white">
                <Checkbox
                  id="interest-only"
                  checked={investmentInputs.loanType === 'interestOnly'}
                  onCheckedChange={(checked) => onInvestmentInputsChange({ 
                    loanType: checked ? 'interestOnly' : 'principalAndInterest' 
                  })}
                />
                <label
                  htmlFor="interest-only"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t('loan.interestOnly') || 'Interest-only loan (for first 5 years)'}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Council Rates */}
        <div className="space-y-2">
          <Label htmlFor="council-rates" className="text-base font-semibold">
            {t('councilRates') || 'Annual Council Rates (Optional)'}
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">$</span>
            <Input
              id="council-rates"
              type="number"
              value={councilRates}
              onChange={(e) => onInvestmentInputsChange({ 
                annualMaintenanceCost: Number(e.target.value) || 0 
              })}
              className="flex-1"
              placeholder="e.g., 2000"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('councilRatesHelp') || 'Typical: $1,500-$3,000 per year. Leave blank to use estimate.'}
          </p>
        </div>

        {/* Property Management */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-3 rounded-lg border bg-white">
            <Checkbox
              id="self-managed"
              checked={investmentInputs.selfManaged || false}
              onCheckedChange={(checked) => onInvestmentInputsChange({ 
                selfManaged: checked as boolean 
              })}
            />
            <label
              htmlFor="self-managed"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {t('selfManaged') || 'I will self-manage this property (no management fees)'}
            </label>
          </div>
          
          {!investmentInputs.selfManaged && (
            <div className="space-y-2 pl-6">
              <Label className="text-sm">
                {t('managementFee') || 'Property Management Fee'}: {investmentInputs.propertyManagementFee || 8}%
              </Label>
              <Slider
                value={[investmentInputs.propertyManagementFee || 8]}
                onValueChange={(value) => onInvestmentInputsChange({ propertyManagementFee: value[0] })}
                min={5}
                max={12}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {t('managementFeeHelp') || 'Typical: 7-9% of rental income'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

