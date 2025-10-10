'use client';

import { TrendingUp, DollarSign, Percent, Wallet } from 'lucide-react';
import MetricCard from './MetricCard';
import type { InvestmentAnalytics } from '@/types/investment';

interface InvestmentSummaryProps {
  analytics: InvestmentAnalytics;
}

export default function InvestmentSummary({ analytics }: InvestmentSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getYieldTrend = (yieldValue: number, benchmark: number): 'good' | 'neutral' | 'warning' | 'poor' => {
    if (yieldValue >= benchmark * 1.2) return 'good';
    if (yieldValue >= benchmark * 0.9) return 'neutral';
    if (yieldValue >= benchmark * 0.7) return 'warning';
    return 'poor';
  };

  const getCashFlowTrend = (cashFlow: number): 'good' | 'neutral' | 'warning' | 'poor' => {
    if (cashFlow >= 0) return 'good';
    if (cashFlow >= -10000) return 'neutral';
    if (cashFlow >= -25000) return 'warning';
    return 'poor';
  };

  const getROITrend = (roi: number): 'good' | 'neutral' | 'warning' | 'poor' => {
    if (roi >= 8) return 'good';
    if (roi >= 6) return 'neutral';
    if (roi >= 4) return 'warning';
    return 'poor';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Investment Performance Summary</h3>
        <p className="text-muted-foreground">
          Key metrics at a glance based on your investment assumptions
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Rental Yield */}
        <MetricCard
          icon={<Percent className="h-5 w-5" />}
          title="Gross Rental Yield"
          value={formatPercent(analytics.rentalYield.gross)}
          subtitle={`${formatCurrency(analytics.rentalYield.annualRent)} annual rent`}
          trend={getYieldTrend(analytics.rentalYield.gross, analytics.rentalYield.benchmark)}
          benchmark={analytics.rentalYield.comparison}
          tooltip="Annual rental income divided by property value"
        />

        {/* Net Rental Yield */}
        <MetricCard
          icon={<Percent className="h-5 w-5" />}
          title="Net Rental Yield"
          value={formatPercent(analytics.rentalYield.net)}
          subtitle="After expenses & vacancy"
          trend={getYieldTrend(analytics.rentalYield.net, analytics.rentalYield.benchmark * 0.6)}
          benchmark={`Net of ${formatCurrency(analytics.cashFlow.annual.totalExpenses)} expenses`}
          tooltip="Net rental income after expenses divided by total investment"
        />

        {/* Annualized ROI */}
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Annualized ROI"
          value={formatPercent(analytics.roi.annualizedROI)}
          subtitle={`${formatCurrency(analytics.roi.totalReturn)} total return`}
          trend={getROITrend(analytics.roi.annualizedROI)}
          benchmark={analytics.roi.annualizedROI > 7.2 ? 'Beats ASX average (7.2%)' : 'Below ASX average (7.2%)'}
          tooltip="Total return divided by years held"
        />

        {/* Monthly Cash Flow */}
        <MetricCard
          icon={<Wallet className="h-5 w-5" />}
          title="Monthly Cash Flow"
          value={formatCurrency(analytics.cashFlow.monthly.afterTaxCashFlow)}
          subtitle={analytics.cashFlow.monthly.afterTaxCashFlow < 0 ? 'Negatively geared' : 'Positively geared'}
          trend={getCashFlowTrend(analytics.cashFlow.annual.afterTaxCashFlow)}
          benchmark={analytics.cashFlow.annual.taxBenefit > 0 ? `Tax benefit: ${formatCurrency(analytics.cashFlow.annual.taxBenefit / 12)}/mo` : undefined}
          tooltip="Monthly rental income minus all expenses and loan repayments"
        />
      </div>

      {/* Additional Highlight Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <p className="text-sm font-medium text-foreground/70 mb-1">Property Value Growth</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(analytics.capitalGrowth.estimatedValueAtEnd)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            After {analytics.yearByYear.length} years (+{formatPercent(analytics.capitalGrowth.totalPercentageGain)})
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-sm font-medium text-foreground/70 mb-1">Your Equity</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(analytics.loanMetrics.equityAtEnd)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Equity gain: {formatCurrency(analytics.loanMetrics.equityGain)}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-foreground/70 mb-1">Tax Savings (Annual)</p>
          <p className="text-2xl font-bold text-amber-700">
            {formatCurrency(analytics.taxAnalysis.annualTaxSaving)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            From negative gearing benefits
          </p>
        </div>
      </div>
    </div>
  );
}

