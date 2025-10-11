'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Receipt, TrendingDown, DollarSign } from 'lucide-react';
import type { InvestmentAnalytics } from '@/types/investment';

interface TaxAnalysisProps {
  analytics: InvestmentAnalytics;
}

export default function TaxAnalysis({ analytics }: TaxAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const deductions = analytics.taxAnalysis.annualDeductions;
  const cgt = analytics.taxAnalysis.cgtOnExit;

  // Deduction items (filter out zero values)
  const deductionItems = [
    { name: 'Loan Interest', amount: deductions.loanInterest, icon: <Receipt className="h-4 w-4" /> },
    { name: 'Property Management', amount: deductions.propertyManagement, icon: <DollarSign className="h-4 w-4" /> },
    { name: 'Maintenance & Repairs', amount: deductions.maintenance, icon: <DollarSign className="h-4 w-4" /> },
    { name: 'Land Tax', amount: deductions.landTax, icon: <Receipt className="h-4 w-4" /> },
    { name: 'Council Rates', amount: deductions.councilRates, icon: <Receipt className="h-4 w-4" /> },
    { name: 'Insurance', amount: deductions.insurance, icon: <Receipt className="h-4 w-4" /> },
    { name: 'Strata Fees', amount: deductions.strataFees, icon: <Receipt className="h-4 w-4" /> },
    { name: 'Depreciation', amount: deductions.depreciation, icon: <TrendingDown className="h-4 w-4" /> },
    { name: 'Other', amount: deductions.other, icon: <DollarSign className="h-4 w-4" /> },
  ].filter(item => item.amount > 0);

  return (
    <Card className="border-none shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Tax Analysis
        </CardTitle>
        <CardDescription>
          Tax deductions, negative gearing benefits, and CGT on exit
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Tax Benefit Summary */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <p className="text-sm font-medium text-green-900 mb-1">Annual Tax Saving</p>
            <p className="text-3xl font-bold text-green-700">
              {formatCurrency(analytics.taxAnalysis.annualTaxSaving)}
            </p>
            <p className="text-sm text-green-600 mt-2">
              {formatCurrency(analytics.taxAnalysis.monthlyTaxSaving)}/month from negative gearing
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-medium text-blue-900 mb-1">Total Deductions</p>
            <p className="text-3xl font-bold text-blue-700">
              {formatCurrency(deductions.total)}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Annual deductible expenses against rental income
            </p>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
            Annual Tax Deductions Breakdown
          </h4>
          <div className="space-y-2">
            {deductionItems.map((item, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/20"
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary">{item.icon}</div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 border-2 border-blue-300 font-bold mt-2">
              <span className="text-blue-900">Total Deductions</span>
              <span className="text-blue-700 text-lg">{formatCurrency(deductions.total)}</span>
            </div>
          </div>
        </div>

        {/* Negative Gearing Explained */}
        <div className="p-5 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl">
          <h4 className="font-semibold text-foreground mb-3">How Negative Gearing Works</h4>
          <div className="space-y-3 text-sm">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground mb-1">Rental Income:</p>
                <p className="font-semibold">{formatCurrency(analytics.cashFlow.annual.effectiveIncome)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Deductible Expenses:</p>
                <p className="font-semibold">{formatCurrency(deductions.total)}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-border/40">
              <p className="text-muted-foreground mb-1">Net Rental Loss:</p>
              <p className="font-semibold text-red-600">
                {formatCurrency(Math.max(0, deductions.total - analytics.cashFlow.annual.effectiveIncome))}
              </p>
            </div>
            <div className="pt-3 border-t border-border/40">
              <p className="text-muted-foreground mb-1">Tax Benefit (at 37% marginal rate):</p>
              <p className="font-semibold text-green-600 text-lg">
                {formatCurrency(analytics.taxAnalysis.annualTaxSaving)}
              </p>
            </div>
          </div>
        </div>

        {/* CGT on Exit */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
            Capital Gains Tax on Exit (Estimated)
          </h4>
          <div className="p-5 bg-muted/30 border border-border/40 rounded-xl">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale Price (Year {analytics.yearByYear.length}):</span>
                <span className="font-semibold">{formatCurrency(cgt.salePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Original Purchase Price:</span>
                <span className="font-semibold">{formatCurrency(cgt.originalPurchasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Costs (FIRB, stamp duty, etc.):</span>
                <span className="font-semibold">{formatCurrency(cgt.purchaseCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selling Costs (agent, legal):</span>
                <span className="font-semibold">{formatCurrency(cgt.sellingCosts)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border/40">
                <span className="text-muted-foreground">Cost Base:</span>
                <span className="font-semibold">{formatCurrency(cgt.costBase)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border/40">
                <span className="font-medium">Capital Gain:</span>
                <span className="font-bold text-lg">{formatCurrency(cgt.capitalGain)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGT Rate (foreign resident - no discount):</span>
                <span className="font-semibold">{cgt.cgtRate}%</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span className="font-medium">CGT Payable:</span>
                <span className="font-bold text-lg">{formatCurrency(cgt.cgtAmount)}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span className="font-medium">Withholding Tax:</span>
                <span className="font-semibold">{formatCurrency(cgt.withholdingTax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-border/60">
                <span className="font-bold text-foreground">Net Proceeds After Tax:</span>
                <span className="font-bold text-green-700 text-xl">
                  {formatCurrency(cgt.netProceedsAfterTax)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Planning Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-blue-900">
            <strong className="font-semibold">Tax Planning Tip:</strong> Foreign residents don&apos;t receive the 50% CGT discount.
            Consider obtaining permanent residency before selling to significantly reduce CGT liability.
            Consult a tax professional for personalized advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

