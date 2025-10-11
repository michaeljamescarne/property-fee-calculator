'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import type { InvestmentAnalytics } from '@/types/investment';

interface InvestmentComparisonProps {
  analytics: InvestmentAnalytics;
}

export default function InvestmentComparison({ analytics }: InvestmentComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const holdPeriod = analytics.yearByYear.length;

  // Prepare comparison data
  const comparisonData = [
    {
      name: 'Property Investment',
      return: analytics.comparisons.propertyInvestment.totalReturn,
      rate: analytics.comparisons.propertyInvestment.annualizedReturn,
      fill: '#6366F1',
      risk: 'Medium-High',
    },
    {
      name: 'ASX 200 Stocks',
      return: analytics.comparisons.asxStocks.totalReturn,
      rate: analytics.comparisons.asxStocks.annualizedReturn,
      fill: '#8B5CF6',
      risk: 'High',
    },
    {
      name: 'Government Bonds',
      return: analytics.comparisons.governmentBonds.totalReturn,
      rate: analytics.comparisons.governmentBonds.annualizedReturn,
      fill: '#3B82F6',
      risk: 'Low',
    },
    {
      name: 'Term Deposit',
      return: analytics.comparisons.termDeposit.totalReturn,
      rate: analytics.comparisons.termDeposit.annualizedReturn,
      fill: '#06B6D4',
      risk: 'Very Low',
    },
    {
      name: 'High-Int. Savings',
      return: analytics.comparisons.highInterestSavings.totalReturn,
      rate: analytics.comparisons.highInterestSavings.annualizedReturn,
      fill: '#14B8A6',
      risk: 'Very Low',
    },
  ].sort((a, b) => b.return - a.return);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; return: number; rate: number; risk: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{data.name}</p>
          <p className="text-sm text-green-600">
            <span className="font-medium">Total Return:</span> {formatCurrency(data.return)}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Annual Rate:</span> {data.rate.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Risk Level:</span> {data.risk}
          </p>
        </div>
      );
    }
    return null;
  };

  // Find the winner
  const bestInvestment = comparisonData[0];
  const isPropertyBest = bestInvestment.name === 'Property Investment';

  return (
    <Card className="border-none shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Investment Comparison
        </CardTitle>
        <CardDescription>
          Compare property investment returns vs other asset classes over {holdPeriod} years
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Winner Highlight */}
        {isPropertyBest ? (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h4 className="font-bold text-green-900">Property Investment Leads</h4>
            </div>
            <p className="text-sm text-green-700">
              Based on your assumptions, property investment outperforms all other options with a{' '}
              <strong className="text-green-800">{formatCurrency(bestInvestment.return)}</strong> total return
              ({bestInvestment.rate.toFixed(1)}% annualized).
            </p>
          </div>
        ) : (
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 text-amber-600" />
              <h4 className="font-bold text-amber-900">Comparison Results</h4>
            </div>
            <p className="text-sm text-amber-700">
              <strong>{bestInvestment.name}</strong> shows higher returns ({formatCurrency(bestInvestment.return)}) under these assumptions.
              Property investment returns {formatCurrency(analytics.comparisons.propertyInvestment.totalReturn)}.
            </p>
          </div>
        )}

        {/* Comparison Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={comparisonData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis 
              type="number"
              stroke="#6B7280"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="#6B7280"
              width={110}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="return" radius={[0, 8, 8, 0]}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Detailed Comparison Table */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-3 uppercase tracking-wide">
            Detailed Comparison
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr>
                  <th className="text-left p-3 font-semibold">Investment Type</th>
                  <th className="text-right p-3 font-semibold">Annual Rate</th>
                  <th className="text-right p-3 font-semibold">{holdPeriod}-Year Return</th>
                  <th className="text-center p-3 font-semibold">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comparisonData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-muted/30 transition-colors ${
                      item.name === 'Property Investment' ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {item.name}
                      {item.name === 'Property Investment' && (
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                          Your Investment
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">{item.rate.toFixed(1)}%</td>
                    <td className="p-3 text-right font-semibold" style={{ color: item.fill }}>
                      {formatCurrency(item.return)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.risk === 'Very Low' ? 'bg-green-100 text-green-700' :
                        item.risk === 'Low' ? 'bg-blue-100 text-blue-700' :
                        item.risk === 'Medium-High' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumptions Note */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border/40 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Assumptions:</strong> Property at {analytics.capitalGrowth.annualGrowthRate}% growth,
            ASX 200 at 7.2%, bonds/deposits at 4-4.5%. Property includes rental income and tax benefits.
            Past performance doesn&apos;t guarantee future returns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

