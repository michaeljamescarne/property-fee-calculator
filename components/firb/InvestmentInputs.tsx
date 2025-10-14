'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Home, DollarSign, TrendingUp, Calculator, Globe } from 'lucide-react';
import type { InvestmentInputs } from '@/types/investment';
import { useInvestmentTranslations } from '@/lib/hooks/useInvestmentTranslations';

interface InvestmentInputsProps {
  inputs: InvestmentInputs;
  onChange: (updates: Partial<InvestmentInputs>) => void;
}

export default function InvestmentInputsComponent({ inputs, onChange }: InvestmentInputsProps) {
  const { t, number } = useInvestmentTranslations();

  return (
    <Card className="border-2 border-primary/20 shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {t('inputs.title') === 'FIRBCalculator.investmentAnalytics.inputs.title' 
            ? 'Investment Analysis Parameters' 
            : t('inputs.title')}
        </CardTitle>
        <CardDescription>
          {t('inputs.description') === 'FIRBCalculator.investmentAnalytics.inputs.description'
            ? 'Adjust these values to see how different scenarios affect your investment returns'
            : t('inputs.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Accordion type="multiple" defaultValue={['rental', 'financing']} className="w-full">
          {/* Rental Income */}
          <AccordionItem value="rental">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                {t('inputs.rental.title') === 'FIRBCalculator.investmentAnalytics.inputs.rental.title' 
                  ? 'Rental Income' 
                  : t('inputs.rental.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-rent">
                  {t('inputs.rental.weeklyRent') === 'FIRBCalculator.investmentAnalytics.inputs.rental.weeklyRent' 
                    ? 'Estimated Weekly Rent' 
                    : t('inputs.rental.weeklyRent')}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id="weekly-rent"
                    type="number"
                    value={inputs.estimatedWeeklyRent}
                    onChange={(e) => onChange({ estimatedWeeklyRent: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    (${number(inputs.estimatedWeeklyRent * 52)}{t('inputs.rental.perYear') === 'FIRBCalculator.investmentAnalytics.inputs.rental.perYear' ? ' per year' : t('inputs.rental.perYear')})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('inputs.rental.vacancyRate') === 'FIRBCalculator.investmentAnalytics.inputs.rental.vacancyRate' 
                    ? 'Vacancy Rate' 
                    : t('inputs.rental.vacancyRate')}: {inputs.vacancyRate}%
                </Label>
                <Slider
                  value={[inputs.vacancyRate]}
                  onValueChange={(value) => onChange({ vacancyRate: value[0] })}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.rental.vacancyHelp') === 'FIRBCalculator.investmentAnalytics.inputs.rental.vacancyHelp'
                    ? 'Typical: 3-5% for good locations, 7-10% for high-risk areas'
                    : t('inputs.rental.vacancyHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('inputs.rental.rentGrowth') === 'FIRBCalculator.investmentAnalytics.inputs.rental.rentGrowth' 
                    ? 'Annual Rent Growth' 
                    : t('inputs.rental.rentGrowth')}: {inputs.rentGrowthRate}%
                </Label>
                <Slider
                  value={[inputs.rentGrowthRate]}
                  onValueChange={(value) => onChange({ rentGrowthRate: value[0] })}
                  min={0}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.rental.rentGrowthHelp') === 'FIRBCalculator.investmentAnalytics.inputs.rental.rentGrowthHelp'
                    ? 'Historical average: 2-4% per year'
                    : t('inputs.rental.rentGrowthHelp')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Property Management */}
          <AccordionItem value="management">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                {t('inputs.management.title') === 'FIRBCalculator.investmentAnalytics.inputs.management.title' 
                  ? 'Property Management' 
                  : t('inputs.management.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <Checkbox
                  id="self-managed"
                  checked={inputs.selfManaged}
                  onCheckedChange={(checked) => onChange({ selfManaged: checked as boolean })}
                />
                <label
                  htmlFor="self-managed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('inputs.management.selfManaged') === 'FIRBCalculator.investmentAnalytics.inputs.management.selfManaged' 
                    ? 'I will self-manage this property (no management fees)' 
                    : t('inputs.management.selfManaged')}
                </label>
              </div>

              {!inputs.selfManaged && (
                <>
                  <div className="space-y-2">
                    <Label>
                      {t('inputs.management.managementFee') === 'FIRBCalculator.investmentAnalytics.inputs.management.managementFee' 
                        ? 'Property Management Fee' 
                        : t('inputs.management.managementFee')}: {inputs.propertyManagementFee}%
                    </Label>
                    <Slider
                      value={[inputs.propertyManagementFee]}
                      onValueChange={(value) => onChange({ propertyManagementFee: value[0] })}
                      min={5}
                      max={12}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('inputs.management.managementHelp') === 'FIRBCalculator.investmentAnalytics.inputs.management.managementHelp'
                        ? 'Typical: 7-9% of rental income. Estimated'
                        : t('inputs.management.managementHelp')}: ${number(((inputs.estimatedWeeklyRent * 52 * inputs.propertyManagementFee) / 100))}{t('inputs.rental.perYear') === 'FIRBCalculator.investmentAnalytics.inputs.rental.perYear' ? ' per year' : t('inputs.rental.perYear')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {t('inputs.management.lettingFee') === 'FIRBCalculator.investmentAnalytics.inputs.management.lettingFee' 
                        ? 'Letting Fee (when finding new tenant)' 
                        : t('inputs.management.lettingFee')}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={inputs.lettingFee}
                        onChange={(e) => onChange({ lettingFee: Number(e.target.value) })}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">
                        {t('inputs.management.weeksRent') === 'FIRBCalculator.investmentAnalytics.inputs.management.weeksRent' 
                          ? 'weeks of rent' 
                          : t('inputs.management.weeksRent')} (${number(inputs.estimatedWeeklyRent * inputs.lettingFee)})
                      </span>
                    </div>
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Financing Details */}
          <AccordionItem value="financing">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                {t('inputs.financing.title') === 'FIRBCalculator.investmentAnalytics.inputs.financing.title' 
                  ? 'Financing Details' 
                  : t('inputs.financing.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount">
                  {t('inputs.financing.loanAmount') === 'FIRBCalculator.investmentAnalytics.inputs.financing.loanAmount' 
                    ? 'Loan Amount' 
                    : t('inputs.financing.loanAmount')}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={inputs.loanAmount}
                    onChange={(e) => onChange({ loanAmount: Number(e.target.value) })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('inputs.financing.interestRate') === 'FIRBCalculator.investmentAnalytics.inputs.financing.interestRate' 
                    ? 'Interest Rate' 
                    : t('inputs.financing.interestRate')}: {inputs.interestRate.toFixed(2)}% p.a.
                </Label>
                <Slider
                  value={[inputs.interestRate]}
                  onValueChange={(value) => onChange({ interestRate: value[0] })}
                  min={3}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.financing.interestHelp') === 'FIRBCalculator.investmentAnalytics.inputs.financing.interestHelp'
                    ? 'Current market rates: 5.5-7.5% for investment properties'
                    : t('inputs.financing.interestHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-term">
                  {t('inputs.financing.loanTerm') === 'FIRBCalculator.investmentAnalytics.inputs.financing.loanTerm' 
                    ? 'Loan Term' 
                    : t('inputs.financing.loanTerm')}
                </Label>
                <Select
                  value={inputs.loanTerm.toString()}
                  onValueChange={(value) => onChange({ loanTerm: Number(value) })}
                >
                  <SelectTrigger id="loan-term" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-type">
                  {t('inputs.financing.loanType') === 'FIRBCalculator.investmentAnalytics.inputs.financing.loanType' 
                    ? 'Loan Type' 
                    : t('inputs.financing.loanType')}
                </Label>
                <Select
                  value={inputs.loanType}
                  onValueChange={(value: 'principalAndInterest' | 'interestOnly') => onChange({ loanType: value })}
                >
                  <SelectTrigger id="loan-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principalAndInterest">
                      {t('inputs.financing.principalAndInterest') === 'FIRBCalculator.investmentAnalytics.inputs.financing.principalAndInterest' 
                        ? 'Principal and Interest' 
                        : t('inputs.financing.principalAndInterest')}
                    </SelectItem>
                    <SelectItem value="interestOnly">
                      {t('inputs.financing.interestOnly') === 'FIRBCalculator.investmentAnalytics.inputs.financing.interestOnly' 
                        ? 'Interest Only' 
                        : t('inputs.financing.interestOnly')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.loanType === 'interestOnly' && (
                <div className="space-y-2">
                  <Label>
                    {t('inputs.financing.interestOnlyPeriod') === 'FIRBCalculator.investmentAnalytics.inputs.financing.interestOnlyPeriod' 
                      ? 'Interest Only Period' 
                      : t('inputs.financing.interestOnlyPeriod')}: {inputs.interestOnlyPeriod} years
                  </Label>
                  <Slider
                    value={[inputs.interestOnlyPeriod]}
                    onValueChange={(value) => onChange({ interestOnlyPeriod: value[0] })}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Investment Assumptions */}
          <AccordionItem value="assumptions">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t('inputs.assumptions.title') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.title' 
                  ? 'Investment Assumptions' 
                  : t('inputs.assumptions.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>
                  {t('inputs.assumptions.holdPeriod') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.holdPeriod' 
                    ? 'Investment Hold Period' 
                    : t('inputs.assumptions.holdPeriod')}: {inputs.holdPeriod} years
                </Label>
                <Slider
                  value={[inputs.holdPeriod]}
                  onValueChange={(value) => onChange({ holdPeriod: value[0] })}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.holdPeriodHelp') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.holdPeriodHelp'
                    ? 'How long you plan to hold this investment property'
                    : t('inputs.assumptions.holdPeriodHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('inputs.assumptions.capitalGrowth') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.capitalGrowth' 
                    ? 'Capital Growth Rate' 
                    : t('inputs.assumptions.capitalGrowth')}: {inputs.capitalGrowthRate}% p.a.
                </Label>
                <Slider
                  value={[inputs.capitalGrowthRate]}
                  onValueChange={(value) => onChange({ capitalGrowthRate: value[0] })}
                  min={0}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.capitalGrowthHelp') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.capitalGrowthHelp'
                    ? 'Historical average: 6-8% per year for Australian property'
                    : t('inputs.assumptions.capitalGrowthHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('inputs.assumptions.taxRate') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.taxRate' 
                    ? 'Marginal Tax Rate' 
                    : t('inputs.assumptions.taxRate')}: {inputs.marginalTaxRate}%
                </Label>
                <Slider
                  value={[inputs.marginalTaxRate]}
                  onValueChange={(value) => onChange({ marginalTaxRate: value[0] })}
                  min={0}
                  max={47}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.taxRateHelp') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.taxRateHelp'
                    ? 'Your highest tax bracket rate for investment income'
                    : t('inputs.assumptions.taxRateHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('inputs.assumptions.sellingCosts') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.sellingCosts' 
                    ? 'Selling Costs' 
                    : t('inputs.assumptions.sellingCosts')}: {inputs.sellingCosts}%
                </Label>
                <Slider
                  value={[inputs.sellingCosts]}
                  onValueChange={(value) => onChange({ sellingCosts: value[0] })}
                  min={2}
                  max={6}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.sellingCostsHelp') === 'FIRBCalculator.investmentAnalytics.inputs.assumptions.sellingCostsHelp'
                    ? 'Typical: 3-4% (agent commission, legal fees, marketing)'
                    : t('inputs.assumptions.sellingCostsHelp')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Currency Conversion */}
          <AccordionItem value="currency">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                {t('inputs.currency.title') === 'FIRBCalculator.investmentAnalytics.inputs.currency.title' 
                  ? 'Currency Conversion (Optional)' 
                  : t('inputs.currency.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="home-currency">
                  {t('inputs.currency.homeCurrency') === 'FIRBCalculator.investmentAnalytics.inputs.currency.homeCurrency' 
                    ? 'Home Currency' 
                    : t('inputs.currency.homeCurrency')}
                </Label>
                <Select
                  value={inputs.homeCurrency}
                  onValueChange={(value) => onChange({ homeCurrency: value })}
                >
                  <SelectTrigger id="home-currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">
                      {t('inputs.currency.aud') === 'FIRBCalculator.investmentAnalytics.inputs.currency.aud' 
                        ? 'Australian Dollar (AUD)' 
                        : t('inputs.currency.aud')}
                    </SelectItem>
                    <SelectItem value="USD">
                      {t('inputs.currency.usd') === 'FIRBCalculator.investmentAnalytics.inputs.currency.usd' 
                        ? 'US Dollar (USD)' 
                        : t('inputs.currency.usd')}
                    </SelectItem>
                    <SelectItem value="CNY">
                      {t('inputs.currency.cny') === 'FIRBCalculator.investmentAnalytics.inputs.currency.cny' 
                        ? 'Chinese Yuan (CNY)' 
                        : t('inputs.currency.cny')}
                    </SelectItem>
                    <SelectItem value="EUR">
                      {t('inputs.currency.eur') === 'FIRBCalculator.investmentAnalytics.inputs.currency.eur' 
                        ? 'Euro (EUR)' 
                        : t('inputs.currency.eur')}
                    </SelectItem>
                    <SelectItem value="GBP">
                      {t('inputs.currency.gbp') === 'FIRBCalculator.investmentAnalytics.inputs.currency.gbp' 
                        ? 'British Pound (GBP)' 
                        : t('inputs.currency.gbp')}
                    </SelectItem>
                    <SelectItem value="JPY">
                      {t('inputs.currency.jpy') === 'FIRBCalculator.investmentAnalytics.inputs.currency.jpy' 
                        ? 'Japanese Yen (JPY)' 
                        : t('inputs.currency.jpy')}
                    </SelectItem>
                    <SelectItem value="SGD">
                      {t('inputs.currency.sgd') === 'FIRBCalculator.investmentAnalytics.inputs.currency.sgd' 
                        ? 'Singapore Dollar (SGD)' 
                        : t('inputs.currency.sgd')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.homeCurrency !== 'AUD' && (
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate">
                    {t('inputs.currency.exchangeRate', { currency: inputs.homeCurrency }) === 'FIRBCalculator.investmentAnalytics.inputs.currency.exchangeRate'
                      ? `Exchange Rate (1 AUD = ${inputs.homeCurrency})`
                      : t('inputs.currency.exchangeRate', { currency: inputs.homeCurrency })}
                  </Label>
                  <Input
                    id="exchange-rate"
                    type="number"
                    step="0.01"
                    value={inputs.currencyExchangeRate}
                    onChange={(e) => onChange({ currencyExchangeRate: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('inputs.currency.exchangeHelp') === 'FIRBCalculator.investmentAnalytics.inputs.currency.exchangeHelp'
                      ? 'Enter the current exchange rate to convert all amounts to your home currency'
                      : t('inputs.currency.exchangeHelp')}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/40">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> {t('inputs.note') === 'FIRBCalculator.investmentAnalytics.inputs.note' 
              ? 'These are estimates based on current market conditions and typical investor scenarios. Actual results may vary based on specific circumstances, market changes, and individual tax situations.' 
              : t('inputs.note')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

