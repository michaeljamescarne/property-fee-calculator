'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  icon?: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'good' | 'neutral' | 'warning' | 'poor';
  benchmark?: string;
  tooltip?: string;
  change?: number;
  changeLabel?: string;
}

export default function MetricCard({
  icon,
  title,
  value,
  subtitle,
  trend = 'neutral',
  benchmark,
  tooltip,
  change,
  changeLabel,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change !== undefined) {
      if (change > 0) return <TrendingUp className="h-4 w-4" />;
      if (change < 0) return <TrendingDown className="h-4 w-4" />;
      return <Minus className="h-4 w-4" />;
    }
    return null;
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'good':
        return 'border-green-200 bg-green-50/50';
      case 'warning':
        return 'border-amber-200 bg-amber-50/50';
      case 'poor':
        return 'border-red-200 bg-red-50/50';
      default:
        return 'border-border/40 bg-white';
    }
  };

  const getValueColor = () => {
    switch (trend) {
      case 'good':
        return 'text-green-700';
      case 'warning':
        return 'text-amber-700';
      case 'poor':
        return 'text-red-700';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className={`border ${getTrendColor()} shadow-sm hover:shadow-md transition-shadow rounded-xl min-w-0`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {icon && <div className="text-primary flex-shrink-0">{icon}</div>}
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide break-words leading-tight min-w-0 flex-1">
              {title}
            </h3>
          </div>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className={`text-3xl font-bold ${getValueColor()} mb-1`}>
          {value}
        </div>

        {subtitle && (
          <p className="text-sm text-muted-foreground mb-2 break-words leading-relaxed">{subtitle}</p>
        )}

        {change !== undefined && changeLabel && (
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon()}
            <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-muted-foreground text-xs">{changeLabel}</span>
          </div>
        )}

        {benchmark && (
          <div className="mt-2 pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground break-words leading-relaxed">{benchmark}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

