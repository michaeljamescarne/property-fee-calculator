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

interface InvestmentInputsProps {
  inputs: InvestmentInputs;
  onChange: (updates: Partial<InvestmentInputs>) => void;
}

export default function InvestmentInputsComponent({ inputs, onChange }: InvestmentInputsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border-2 border-primary/20 shadow-md rounded-2xl bg-white">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Investment Analysis Parameters
        </CardTitle>
        <CardDescription>
          Adjust these values to see how different scenarios affect your investment returns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Accordion type="multiple" defaultValue={['rental', 'financing']} className="w-full">
          {/* Rental Income */}
          <AccordionItem value="rental">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Rental Income Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-rent">Estimated Weekly Rent</Label>
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
                    (${Math.round(inputs.estimatedWeeklyRent * 52).toLocaleString()}/year)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vacancy Rate: {inputs.vacancyRate}%</Label>
                <Slider
                  value={[inputs.vacancyRate]}
                  onValueChange={(value) => onChange({ vacancyRate: value[0] })}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Typical: 3-5% for good locations, 7-10% for high-risk areas
                </p>
              </div>

              <div className="space-y-2">
                <Label>Annual Rent Growth: {inputs.rentGrowthRate}%</Label>
                <Slider
                  value={[inputs.rentGrowthRate]}
                  onValueChange={(value) => onChange({ rentGrowthRate: value[0] })}
                  min={0}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Historical average: 2-4% per year
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Property Management */}
          <AccordionItem value="management">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Property Management
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
                  I will self-manage this property (no management fees)
                </label>
              </div>

              {!inputs.selfManaged && (
                <>
                  <div className="space-y-2">
                    <Label>Property Management Fee: {inputs.propertyManagementFee}%</Label>
                    <Slider
                      value={[inputs.propertyManagementFee]}
                      onValueChange={(value) => onChange({ propertyManagementFee: value[0] })}
                      min={5}
                      max={12}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Typical: 7-9% of rental income. Estimated: ${Math.round((inputs.estimatedWeeklyRent * 52 * inputs.propertyManagementFee) / 100).toLocaleString()}/year
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Letting Fee (when finding new tenant)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={inputs.lettingFee}
                        onChange={(e) => onChange({ lettingFee: Number(e.target.value) })}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">weeks of rent (${Math.round(inputs.estimatedWeeklyRent * inputs.lettingFee).toLocaleString()})</span>
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
                Financing Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount">Loan Amount</Label>
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
                <Label>Interest Rate: {inputs.interestRate.toFixed(2)}% p.a.</Label>
                <Slider
                  value={[inputs.interestRate]}
                  onValueChange={(value) => onChange({ interestRate: value[0] })}
                  min={3}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Current market: 6.0-6.8% for investment loans
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-term">Loan Term</Label>
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
                <Label htmlFor="loan-type">Loan Type</Label>
                <Select
                  value={inputs.loanType}
                  onValueChange={(value: 'principalAndInterest' | 'interestOnly') => onChange({ loanType: value })}
                >
                  <SelectTrigger id="loan-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principalAndInterest">Principal & Interest</SelectItem>
                    <SelectItem value="interestOnly">Interest Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.loanType === 'interestOnly' && (
                <div className="space-y-2">
                  <Label>Interest Only Period: {inputs.interestOnlyPeriod} years</Label>
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
                Investment Assumptions
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Hold Period: {inputs.holdPeriod} years</Label>
                <Slider
                  value={[inputs.holdPeriod]}
                  onValueChange={(value) => onChange({ holdPeriod: value[0] })}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  How long do you plan to hold this investment?
                </p>
              </div>

              <div className="space-y-2">
                <Label>Capital Growth Rate: {inputs.capitalGrowthRate}% p.a.</Label>
                <Slider
                  value={[inputs.capitalGrowthRate]}
                  onValueChange={(value) => onChange({ capitalGrowthRate: value[0] })}
                  min={0}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Australian property: 6-7% historical average (long-term)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Your Marginal Tax Rate: {inputs.marginalTaxRate}%</Label>
                <Slider
                  value={[inputs.marginalTaxRate]}
                  onValueChange={(value) => onChange({ marginalTaxRate: value[0] })}
                  min={0}
                  max={47}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Foreign residents typically: 32.5% or 37% or 45%
                </p>
              </div>

              <div className="space-y-2">
                <Label>Selling Costs: {inputs.sellingCosts}%</Label>
                <Slider
                  value={[inputs.sellingCosts]}
                  onValueChange={(value) => onChange({ sellingCosts: value[0] })}
                  min={2}
                  max={6}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Agent (2-3%) + Legal (0.5-1%) + Marketing (0.5-1%)
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Currency Conversion */}
          <AccordionItem value="currency">
            <AccordionTrigger className="text-base font-semibold hover:text-primary">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Currency Conversion (Optional)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="home-currency">Your Home Currency</Label>
                <Select
                  value={inputs.homeCurrency}
                  onValueChange={(value) => onChange({ homeCurrency: value })}
                >
                  <SelectTrigger id="home-currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">AUD (Australian Dollar)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="CNY">CNY (Chinese Yuan)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    <SelectItem value="JPY">JPY (Japanese Yen)</SelectItem>
                    <SelectItem value="SGD">SGD (Singapore Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.homeCurrency !== 'AUD' && (
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate">
                    Exchange Rate (1 AUD = ? {inputs.homeCurrency})
                  </Label>
                  <Input
                    id="exchange-rate"
                    type="number"
                    step="0.01"
                    value={inputs.currencyExchangeRate}
                    onChange={(e) => onChange({ currencyExchangeRate: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Update with current exchange rate from your bank or xe.com
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/40">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> These are estimates based on current market conditions and your assumptions. Actual returns may vary. Calculations update in real-time as you adjust values.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

