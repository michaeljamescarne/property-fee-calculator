'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Receipt, TrendingDown, DollarSign } from 'lucide-react';
import type { InvestmentAnalytics } from '@/types/investment';
import { useInvestmentTranslations } from '@/lib/hooks/useInvestmentTranslations';

interface TaxAnalysisProps {
  analytics: InvestmentAnalytics;
}

export default function TaxAnalysis({ analytics }: TaxAnalysisProps) {
  const { t, currency } = useInvestmentTranslations();

  const deductions = analytics.taxAnalysis.annualDeductions;
  const cgt = analytics.taxAnalysis.cgtOnExit;

  // Deduction items (filter out zero values) with translations
  const deductionItems = [
    { name: t('taxAnalysis.deductionItems.loanInterest'), amount: deductions.loanInterest, icon: <Receipt className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.propertyManagement'), amount: deductions.propertyManagement, icon: <DollarSign className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.maintenance'), amount: deductions.maintenance, icon: <DollarSign className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.landTax'), amount: deductions.landTax, icon: <Receipt className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.councilRates'), amount: deductions.councilRates, icon: <Receipt className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.insurance'), amount: deductions.insurance, icon: <Receipt className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.strataFees'), amount: deductions.strataFees, icon: <Receipt className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.depreciation'), amount: deductions.depreciation, icon: <TrendingDown className="h-4 w-4" /> },
    { name: t('taxAnalysis.deductionItems.other'), amount: deductions.other, icon: <DollarSign className="h-4 w-4" /> },
  ].filter(item => item.amount > 0);

  return (
    <Card className="border-none shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {t('taxAnalysis.title')}
        </CardTitle>
        <CardDescription>
          {t('taxAnalysis.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Tax Benefit Summary */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <p className="text-sm font-medium text-green-900 mb-1">{t('taxAnalysis.annualTaxSaving')}</p>
            <p className="text-3xl font-bold text-green-700">
              {currency(analytics.taxAnalysis.annualTaxSaving)}
            </p>
            <p className="text-sm text-green-600 mt-2">
              {currency(analytics.taxAnalysis.monthlyTaxSaving)}/month {t('taxAnalysis.fromNegativeGearing')}
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-medium text-blue-900 mb-1">{t('taxAnalysis.totalDeductions')}</p>
            <p className="text-3xl font-bold text-blue-700">
              {currency(deductions.total)}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {t('taxAnalysis.deductionsDesc')}
            </p>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
            {t('taxAnalysis.breakdownTitle')}
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
                <span className="text-sm font-semibold">{currency(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 border-2 border-blue-300 font-bold mt-2">
              <span className="text-blue-900">{t('taxAnalysis.totalDeductions')}</span>
              <span className="text-blue-700 text-lg">{currency(deductions.total)}</span>
            </div>
          </div>
        </div>

        {/* Negative Gearing Explained */}
        <div className="p-5 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl">
          <h4 className="font-semibold text-foreground mb-3">{t('taxAnalysis.negativeGearing.title')}</h4>
          <div className="space-y-3 text-sm">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground mb-1">{t('taxAnalysis.negativeGearing.rentalIncome')}:</p>
                <p className="font-semibold">{currency(analytics.cashFlow.annual.effectiveIncome)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">{t('taxAnalysis.negativeGearing.deductibleExpenses')}:</p>
                <p className="font-semibold">{currency(deductions.total)}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-border/40">
              <p className="text-muted-foreground mb-1">{t('taxAnalysis.negativeGearing.netRentalLoss')}:</p>
              <p className="font-semibold text-red-600">
                {currency(Math.max(0, deductions.total - analytics.cashFlow.annual.effectiveIncome))}
              </p>
            </div>
            <div className="pt-3 border-t border-border/40">
              <p className="text-muted-foreground mb-1">{t('taxAnalysis.negativeGearing.taxBenefit', { rate: '37' })}:</p>
              <p className="font-semibold text-green-600 text-lg">
                {currency(analytics.taxAnalysis.annualTaxSaving)}
              </p>
            </div>
          </div>
        </div>

        {/* CGT on Exit */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
            {t('taxAnalysis.cgtTitle')}
          </h4>
          <div className="p-5 bg-muted/30 border border-border/40 rounded-xl">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('taxAnalysis.cgtItems.salePrice', { year: analytics.yearByYear.length })}:</span>
                <span className="font-semibold">{currency(cgt.salePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('taxAnalysis.cgtItems.originalPrice')}:</span>
                <span className="font-semibold">{currency(cgt.originalPurchasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('taxAnalysis.cgtItems.purchaseCosts')}:</span>
                <span className="font-semibold">{currency(cgt.purchaseCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('taxAnalysis.cgtItems.sellingCosts')}:</span>
                <span className="font-semibold">{currency(cgt.sellingCosts)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border/40">
                <span className="text-muted-foreground">{t('taxAnalysis.cgtItems.costBase')}:</span>
                <span className="font-semibold">{currency(cgt.costBase)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border/40">
                <span className="font-medium">{t('taxAnalysis.cgtItems.capitalGain')}:</span>
                <span className="font-bold text-lg">{currency(cgt.capitalGain)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('taxAnalysis.cgtItems.cgtRate')}:</span>
                <span className="font-semibold">{cgt.cgtRate}%</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span className="font-medium">{t('taxAnalysis.cgtItems.cgtPayable')}:</span>
                <span className="font-bold text-lg">{currency(cgt.cgtAmount)}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span className="font-medium">{t('taxAnalysis.cgtItems.withholdingTax')}:</span>
                <span className="font-semibold">{currency(cgt.withholdingTax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-border/60">
                <span className="font-bold text-foreground">{t('taxAnalysis.cgtItems.netProceeds')}:</span>
                <span className="font-bold text-green-700 text-xl">
                  {currency(cgt.netProceedsAfterTax)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Planning Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-blue-900">
            {t('taxAnalysis.taxPlanningTip')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

