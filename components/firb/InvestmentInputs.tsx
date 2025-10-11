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
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {t('inputs.title')}
        </CardTitle>
        <CardDescription>
          {t('inputs.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Accordion type="multiple" defaultValue={['rental', 'financing']} className="w-full">
          {/* Rental Income */}
          <AccordionItem value="rental">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                {t('inputs.rental.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-rent">{t('inputs.rental.weeklyRent')}</Label>
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
                    (${number(inputs.estimatedWeeklyRent * 52)}{t('inputs.rental.perYear')})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('inputs.rental.vacancyRate')}: {inputs.vacancyRate}%</Label>
                <Slider
                  value={[inputs.vacancyRate]}
                  onValueChange={(value) => onChange({ vacancyRate: value[0] })}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.rental.vacancyHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('inputs.rental.rentGrowth')}: {inputs.rentGrowthRate}%</Label>
                <Slider
                  value={[inputs.rentGrowthRate]}
                  onValueChange={(value) => onChange({ rentGrowthRate: value[0] })}
                  min={0}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.rental.rentGrowthHelp')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Property Management */}
          <AccordionItem value="management">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                {t('inputs.management.title')}
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
                  {t('inputs.management.selfManaged')}
                </label>
              </div>

              {!inputs.selfManaged && (
                <>
                  <div className="space-y-2">
                    <Label>{t('inputs.management.managementFee')}: {inputs.propertyManagementFee}%</Label>
                    <Slider
                      value={[inputs.propertyManagementFee]}
                      onValueChange={(value) => onChange({ propertyManagementFee: value[0] })}
                      min={5}
                      max={12}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('inputs.management.managementHelp')}: ${number(((inputs.estimatedWeeklyRent * 52 * inputs.propertyManagementFee) / 100))}{t('inputs.rental.perYear')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('inputs.management.lettingFee')}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={inputs.lettingFee}
                        onChange={(e) => onChange({ lettingFee: Number(e.target.value) })}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">{t('inputs.management.weeksRent')} (${number(inputs.estimatedWeeklyRent * inputs.lettingFee)})</span>
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
                {t('inputs.financing.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount">{t('inputs.financing.loanAmount')}</Label>
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
                <Label>{t('inputs.financing.interestRate')}: {inputs.interestRate.toFixed(2)}% p.a.</Label>
                <Slider
                  value={[inputs.interestRate]}
                  onValueChange={(value) => onChange({ interestRate: value[0] })}
                  min={3}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.financing.interestHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-term">{t('inputs.financing.loanTerm')}</Label>
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
                <Label htmlFor="loan-type">{t('inputs.financing.loanType')}</Label>
                <Select
                  value={inputs.loanType}
                  onValueChange={(value: 'principalAndInterest' | 'interestOnly') => onChange({ loanType: value })}
                >
                  <SelectTrigger id="loan-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principalAndInterest">{t('inputs.financing.principalAndInterest')}</SelectItem>
                    <SelectItem value="interestOnly">{t('inputs.financing.interestOnly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.loanType === 'interestOnly' && (
                <div className="space-y-2">
                  <Label>{t('inputs.financing.interestOnlyPeriod')}: {inputs.interestOnlyPeriod} years</Label>
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
                {t('inputs.assumptions.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t('inputs.assumptions.holdPeriod')}: {inputs.holdPeriod} years</Label>
                <Slider
                  value={[inputs.holdPeriod]}
                  onValueChange={(value) => onChange({ holdPeriod: value[0] })}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.holdPeriodHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('inputs.assumptions.capitalGrowth')}: {inputs.capitalGrowthRate}% p.a.</Label>
                <Slider
                  value={[inputs.capitalGrowthRate]}
                  onValueChange={(value) => onChange({ capitalGrowthRate: value[0] })}
                  min={0}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.capitalGrowthHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('inputs.assumptions.taxRate')}: {inputs.marginalTaxRate}%</Label>
                <Slider
                  value={[inputs.marginalTaxRate]}
                  onValueChange={(value) => onChange({ marginalTaxRate: value[0] })}
                  min={0}
                  max={47}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.taxRateHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('inputs.assumptions.sellingCosts')}: {inputs.sellingCosts}%</Label>
                <Slider
                  value={[inputs.sellingCosts]}
                  onValueChange={(value) => onChange({ sellingCosts: value[0] })}
                  min={2}
                  max={6}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('inputs.assumptions.sellingCostsHelp')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Currency Conversion */}
          <AccordionItem value="currency">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                {t('inputs.currency.title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="home-currency">{t('inputs.currency.homeCurrency')}</Label>
                <Select
                  value={inputs.homeCurrency}
                  onValueChange={(value) => onChange({ homeCurrency: value })}
                >
                  <SelectTrigger id="home-currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">{t('inputs.currency.aud')}</SelectItem>
                    <SelectItem value="USD">{t('inputs.currency.usd')}</SelectItem>
                    <SelectItem value="CNY">{t('inputs.currency.cny')}</SelectItem>
                    <SelectItem value="EUR">{t('inputs.currency.eur')}</SelectItem>
                    <SelectItem value="GBP">{t('inputs.currency.gbp')}</SelectItem>
                    <SelectItem value="JPY">{t('inputs.currency.jpy')}</SelectItem>
                    <SelectItem value="SGD">{t('inputs.currency.sgd')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.homeCurrency !== 'AUD' && (
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate">
                    {t('inputs.currency.exchangeRate', { currency: inputs.homeCurrency })}
                  </Label>
                  <Input
                    id="exchange-rate"
                    type="number"
                    step="0.01"
                    value={inputs.currencyExchangeRate}
                    onChange={(e) => onChange({ currencyExchangeRate: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('inputs.currency.exchangeHelp')}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/40">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> {t('inputs.note')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

