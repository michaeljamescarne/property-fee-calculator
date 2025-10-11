'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { InvestmentAnalytics } from '@/types/investment';

interface ProjectionChartProps {
  analytics: InvestmentAnalytics;
}

export default function ProjectionChart({ analytics }: ProjectionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for chart
  const chartData = analytics.yearByYear.map((year) => ({
    year: `Year ${year.year}`,
    'Property Value': year.propertyValue,
    'Loan Balance': year.loanBalance,
    'Your Equity': year.equity,
    'Cumulative Return': year.cumulativeReturn,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { year: string }; name: string; value: number; color: string }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.year}</p>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {analytics.yearByYear.length}-Year Projection
        </CardTitle>
        <CardDescription>
          Property value, loan balance, and equity growth over time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="year" 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="Property Value" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="Loan Balance" 
              stroke="#EF4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#EF4444', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="Your Equity" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Key Milestones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-600 font-medium mb-1">Starting Value</p>
            <p className="text-xl font-bold text-purple-700">
              {formatCurrency(analytics.capitalGrowth.initialValue)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-600 font-medium mb-1">Final Value</p>
            <p className="text-xl font-bold text-purple-700">
              {formatCurrency(analytics.capitalGrowth.estimatedValueAtEnd)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              +{analytics.capitalGrowth.totalPercentageGain.toFixed(1)}%
            </p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 font-medium mb-1">Your Equity</p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(analytics.loanMetrics.equityAtEnd)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              from {formatCurrency(analytics.loanMetrics.equityAtStart)}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">Total ROI</p>
            <p className="text-xl font-bold text-blue-700">
              {analytics.roi.totalROI.toFixed(1)}%
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {analytics.roi.annualizedROI.toFixed(1)}% p.a.
            </p>
          </div>
        </div>

        {/* Break-Even Information */}
        {analytics.breakEven.yearsToCumulativeBreakEven && (
          <div className="p-5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
            <h4 className="font-semibold text-foreground mb-3">Break-Even Analysis</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Cumulative Break-Even</p>
                <p className="text-2xl font-bold text-primary">
                  Year {analytics.breakEven.yearsToCumulativeBreakEven}
                </p>
              </div>
              {analytics.breakEven.yearsToPositiveCashFlow && (
                <div>
                  <p className="text-muted-foreground mb-1">Positive Cash Flow</p>
                  <p className="text-2xl font-bold text-accent">
                    Year {analytics.breakEven.yearsToPositiveCashFlow}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Cash Required</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(analytics.breakEven.totalCashRequired)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Year-by-Year Table (Compact View) */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-3 uppercase tracking-wide">
            Year-by-Year Summary
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr>
                  <th className="text-left p-3 font-semibold">Year</th>
                  <th className="text-right p-3 font-semibold">Property Value</th>
                  <th className="text-right p-3 font-semibold">Equity</th>
                  <th className="text-right p-3 font-semibold">Cash Flow</th>
                  <th className="text-right p-3 font-semibold">Cumulative Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {analytics.yearByYear.map((year) => (
                  <tr key={year.year} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{year.year}</td>
                    <td className="p-3 text-right">{formatCurrency(year.propertyValue)}</td>
                    <td className="p-3 text-right text-green-600 font-medium">
                      {formatCurrency(year.equity)}
                    </td>
                    <td className={`p-3 text-right font-medium ${
                      year.afterTaxCashFlow >= 0 ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {formatCurrency(year.afterTaxCashFlow)}
                    </td>
                    <td className={`p-3 text-right font-semibold ${
                      year.cumulativeReturn >= 0 ? 'text-green-700' : 'text-red-600'
                    }`}>
                      {formatCurrency(year.cumulativeReturn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

