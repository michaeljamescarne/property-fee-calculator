'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import type { InvestmentAnalytics } from '@/types/investment';

interface CashFlowAnalysisProps {
  analytics: InvestmentAnalytics;
}

export default function CashFlowAnalysis({ analytics }: CashFlowAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare chart data
  const cashFlowData = [
    {
      name: 'Income',
      amount: analytics.cashFlow.annual.effectiveIncome,
      fill: '#10B981',
    },
    {
      name: 'Expenses',
      amount: -Math.abs(analytics.cashFlow.annual.totalExpenses),
      fill: '#EF4444',
    },
    {
      name: 'Net Cash Flow',
      amount: analytics.cashFlow.annual.netCashFlow,
      fill: analytics.cashFlow.annual.netCashFlow >= 0 ? '#6366F1' : '#F59E0B',
    },
  ];

  // Expense breakdown data
  const expenseBreakdown = [
    { name: 'Loan Repayments', amount: analytics.cashFlow.annual.loanRepayments },
    { name: 'Property Management', amount: analytics.cashFlow.annual.propertyManagement },
    { name: 'Maintenance', amount: analytics.cashFlow.annual.maintenance },
    { name: 'Land Tax', amount: analytics.cashFlow.annual.landTax },
    { name: 'Council Rates', amount: analytics.cashFlow.annual.councilRates },
    { name: 'Insurance', amount: analytics.cashFlow.annual.insurance },
    { name: 'Strata Fees', amount: analytics.cashFlow.annual.strataFees },
    { name: 'Other', amount: analytics.cashFlow.annual.otherExpenses },
  ].filter(item => item.amount > 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string }; fill: string; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm" style={{ color: payload[0].fill }}>
            {formatCurrency(Math.abs(payload[0].value))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Cash Flow Analysis
        </CardTitle>
        <CardDescription>
          Annual rental income vs expenses and loan repayments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">Annual Income</p>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(analytics.cashFlow.annual.rentalIncome)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Effective: {formatCurrency(analytics.cashFlow.annual.effectiveIncome)} (after vacancy)
            </p>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-900">Annual Expenses</p>
            </div>
            <p className="text-2xl font-bold text-red-700">
              {formatCurrency(analytics.cashFlow.annual.totalExpenses)}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Including loan repayments
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            analytics.cashFlow.annual.afterTaxCashFlow >= 0
              ? 'bg-blue-50 border-blue-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`h-5 w-5 ${
                analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? 'text-blue-600' : 'text-amber-600'
              }`} />
              <p className={`text-sm font-medium ${
                analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? 'text-blue-900' : 'text-amber-900'
              }`}>
                After-Tax Cash Flow
              </p>
            </div>
            <p className={`text-2xl font-bold ${
              analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? 'text-blue-700' : 'text-amber-700'
            }`}>
              {formatCurrency(analytics.cashFlow.annual.afterTaxCashFlow)}
            </p>
            <p className={`text-xs mt-1 ${
              analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? 'text-blue-600' : 'text-amber-600'
            }`}>
              {formatCurrency(analytics.cashFlow.monthly.afterTaxCashFlow)}/month
            </p>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
            Annual Cash Flow Visualization
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {cashFlowData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
            Expense Breakdown
          </h4>
          <div className="space-y-3">
            {expenseBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-4 rounded-lg bg-red-50 border border-red-200 font-bold">
              <span>Total Annual Expenses</span>
              <span className="text-red-700">{formatCurrency(analytics.cashFlow.annual.totalExpenses)}</span>
            </div>
          </div>
        </div>

        {/* Tax Benefit */}
        {analytics.cashFlow.annual.taxBenefit > 0 && (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">Negative Gearing Tax Benefit</p>
                <p className="text-3xl font-bold text-green-700">{formatCurrency(analytics.cashFlow.annual.taxBenefit)}</p>
                <p className="text-sm text-green-600 mt-2">
                  {formatCurrency(analytics.cashFlow.monthly.afterTaxCashFlow + analytics.cashFlow.monthly.netCashFlow)} saved per month in taxes
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600">Deductible Expenses</p>
                <p className="text-lg font-semibold text-green-700">
                  {formatCurrency(analytics.cashFlow.annual.deductibleExpenses)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Summary */}
        <div className="grid md:grid-cols-2 gap-4 p-5 bg-muted/50 rounded-xl border border-border/40">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Cash Flow (Before Tax)</p>
            <p className={`text-2xl font-bold ${
              analytics.cashFlow.monthly.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(analytics.cashFlow.monthly.netCashFlow)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Cash Flow (After Tax)</p>
            <p className={`text-2xl font-bold ${
              analytics.cashFlow.monthly.afterTaxCashFlow >= 0 ? 'text-green-600' : 'text-amber-600'
            }`}>
              {formatCurrency(analytics.cashFlow.monthly.afterTaxCashFlow)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

