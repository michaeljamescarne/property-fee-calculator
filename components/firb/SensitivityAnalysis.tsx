'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, AlertTriangle } from 'lucide-react';
import type { InvestmentAnalytics } from '@/types/investment';
import { useInvestmentTranslations } from '@/lib/hooks/useInvestmentTranslations';

interface SensitivityAnalysisProps {
  analytics: InvestmentAnalytics;
}

export default function SensitivityAnalysis({ analytics }: SensitivityAnalysisProps) {
  const { t, currency } = useInvestmentTranslations();

  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${currency(value)}`;
  };

  return (
    <Card className="border-none shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {t('sensitivity.title') || 'Sensitivity Analysis'}
        </CardTitle>
        <CardDescription>
          {t('sensitivity.description') || 'How changes in key variables affect your investment returns'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Warning Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-1">{t('sensitivity.warning')}</p>
            <p className="text-amber-700">
              {t('sensitivity.warningDesc')}
            </p>
          </div>
        </div>

        {/* Vacancy Rate Scenarios */}
        <div>
          <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            {t('sensitivity.vacancyImpact')}
            <span className="text-xs font-normal text-muted-foreground">({t('sensitivity.vacancyDesc')})</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr>
                  <th className="text-left p-3 font-semibold">{t('sensitivity.vacancyRate')}</th>
                  <th className="text-right p-3 font-semibold">{t('sensitivity.annualRent')}</th>
                  <th className="text-right p-3 font-semibold">{t('cashFlow.netCashFlow')}</th>
                  <th className="text-right p-3 font-semibold">{t('sensitivity.impact')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {analytics.sensitivity.vacancyImpact.map((scenario, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-muted/30 transition-colors ${
                      scenario.rate === 5 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="p-3">
                      <span className="font-medium">{scenario.rate}%</span>
                      {scenario.rate === 5 && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                          {t('sensitivity.baseCase')}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">{currency(scenario.annualRent)}</td>
                    <td className={`p-3 text-right font-medium ${
                      scenario.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currency(scenario.netCashFlow)}
                    </td>
                    <td className={`p-3 text-right font-medium ${
                      scenario.impact >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scenario.rate === 5 ? '-' : formatChange(scenario.impact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            {t('sensitivity.vacancyNote', { amount: Math.abs(analytics.sensitivity.vacancyImpact[2].impact - analytics.sensitivity.vacancyImpact[1].impact).toFixed(0) })}
          </p>
        </div>

        {/* Interest Rate Scenarios */}
        <div>
          <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            {t('sensitivity.interestImpact')}
            <span className="text-xs font-normal text-muted-foreground">({t('sensitivity.interestDesc')})</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr>
                  <th className="text-left p-3 font-semibold">{t('sensitivity.interestRate')}</th>
                  <th className="text-right p-3 font-semibold">{t('sensitivity.monthlyRepayment')}</th>
                  <th className="text-right p-3 font-semibold">{t('sensitivity.annualCost')}</th>
                  <th className="text-right p-3 font-semibold">{t('sensitivity.cashFlowImpact')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {analytics.sensitivity.interestRateImpact.map((scenario, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-muted/30 transition-colors ${
                      scenario.rate === 6.5 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="p-3">
                      <span className="font-medium">{scenario.rate.toFixed(1)}%</span>
                      {scenario.rate === 6.5 && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                          {t('sensitivity.baseCase')}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">{currency(scenario.monthlyRepayment)}</td>
                    <td className="p-3 text-right">{currency(scenario.annualCost)}</td>
                    <td className={`p-3 text-right font-medium ${
                      scenario.impact >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scenario.rate === 6.5 ? '-' : formatChange(scenario.impact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            {t('sensitivity.interestNote', { amount: Math.abs((analytics.sensitivity.interestRateImpact[2].impact - analytics.sensitivity.interestRateImpact[1].impact) / 12).toFixed(0) })}
          </p>
        </div>

        {/* Capital Growth Scenarios */}
        <div>
          <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            {t('sensitivity.growthScenarios')}
            <span className="text-xs font-normal text-muted-foreground">({t('sensitivity.growthDesc')})</span>
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            {analytics.sensitivity.growthScenarios.map((scenario, index) => (
              <div 
                key={index}
                className={`p-5 rounded-xl border ${
                  scenario.label === 'Moderate' 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-muted/30 border-border/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-foreground">
                    {scenario.label === 'Conservative' ? t('sensitivity.conservative') :
                     scenario.label === 'Moderate' ? t('sensitivity.moderate') :
                     scenario.label === 'Optimistic' ? t('sensitivity.optimistic') :
                     scenario.label}
                  </h5>
                  {scenario.label === 'Moderate' && (
                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                      {t('sensitivity.base')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{t('sensitivity.growthRate')}: {scenario.rate}% p.a.</p>
                <p className="text-sm text-muted-foreground mb-1">{t('sensitivity.finalValue')}:</p>
                <p className="text-xl font-bold text-primary mb-3">
                  {currency(scenario.valueAtEnd)}
                </p>
                <div className="pt-3 border-t border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">{t('sensitivity.totalReturn')}:</p>
                  <p className="text-lg font-semibold text-foreground">
                    {currency(scenario.totalReturn)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scenario.annualizedROI.toFixed(1)}% annualized ROI
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Summary */}
        <div className="p-5 bg-gradient-to-r from-muted/50 to-muted/30 border border-border/40 rounded-xl">
          <h4 className="font-semibold text-foreground mb-3">{t('sensitivity.riskFactors')}</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-2">{t('sensitivity.mostSensitive')}</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('sensitivity.sensitivityItems.capitalGrowth')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('sensitivity.sensitivityItems.interestRate')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('sensitivity.sensitivityItems.vacancy')}</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">{t('sensitivity.riskMitigation')}</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{t('sensitivity.sensitivityItems.highDemand')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{t('sensitivity.sensitivityItems.fixRate')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{t('sensitivity.sensitivityItems.cashReserves')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

