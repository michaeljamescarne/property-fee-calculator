/**
 * Custom hook for investment analytics translations with formatting support
 */

import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency, formatPercent, formatNumber, formatYears } from '@/lib/utils/format';

export function useInvestmentTranslations() {
  const t = useTranslations('FIRBCalculator.results.investmentAnalytics');
  const locale = useLocale();

  // Helper functions that combine translations with formatting
  const helpers = {
    // Currency formatting with locale
    currency: (amount: number, currency: string = 'AUD') => {
      return formatCurrency(amount, locale === 'zh' ? 'zh-CN' : 'en-AU', currency);
    },

    // Percentage formatting with locale
    percent: (value: number, decimals: number = 1) => {
      return formatPercent(value, locale === 'zh' ? 'zh-CN' : 'en-AU', decimals);
    },

    // Number formatting with locale
    number: (value: number, decimals: number = 0) => {
      return formatNumber(value, locale === 'zh' ? 'zh-CN' : 'en-AU', {
        maximumFractionDigits: decimals,
      });
    },

    // Years formatting with locale
    years: (years: number) => {
      return formatYears(years, locale === 'zh' ? 'zh-CN' : 'en-AU');
    },

    // Get translated investment type names
    investmentType: (type: string) => {
      return t(`comparison.investmentTypes.${type}`);
    },

    // Get translated risk levels
    riskLevel: (level: string) => {
      const key = `comparison.riskLevels.${level}`;
      const translation = t(key);
      const fallbacks: Record<string, string> = {
        'veryLow': 'Very Low',
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'veryHigh': 'Very High'
      };
      return translation === `FIRBCalculator.investmentAnalytics.${key}` ? fallbacks[level] || level : translation;
    },

    // Get translated verdict
    verdict: (score: number) => {
      if (score >= 8) return t('score.verdicts.excellent') === 'FIRBCalculator.investmentAnalytics.score.verdicts.excellent' ? 'Excellent' : t('score.verdicts.excellent');
      if (score >= 6.5) return t('score.verdicts.good') === 'FIRBCalculator.investmentAnalytics.score.verdicts.good' ? 'Good' : t('score.verdicts.good');
      if (score >= 5) return t('score.verdicts.moderate') === 'FIRBCalculator.investmentAnalytics.score.verdicts.moderate' ? 'Moderate' : t('score.verdicts.moderate');
      if (score >= 3.5) return t('score.verdicts.poor') === 'FIRBCalculator.investmentAnalytics.score.verdicts.poor' ? 'Poor' : t('score.verdicts.poor');
      return t('score.verdicts.notRecommended') === 'FIRBCalculator.investmentAnalytics.score.verdicts.notRecommended' ? 'Not Recommended' : t('score.verdicts.notRecommended');
    },

    // Get translated deduction items
    deductionItem: (item: string) => {
      return t(`taxAnalysis.deductionItems.${item}`);
    },

    // Format currency with "per month" or "per year" suffix
    currencyPerMonth: (amount: number) => {
      return `${helpers.currency(amount)} ${t('cashFlow.perMonth')}`;
    },

    currencyPerYear: (amount: number) => {
      return `${helpers.currency(amount)} ${t('inputs.rental.perYear')}`;
    },

    // Format percentage with context
    percentWithContext: (value: number, contextKey: string) => {
      return `${helpers.percent(value)} ${t(contextKey)}`;
    },
  };

  return {
    t,
    locale,
    ...helpers,
  };
}

// Export a simpler version for non-investment translations
export function useFormattedTranslations(namespace: string = 'FIRBCalculator') {
  const t = useTranslations(namespace);
  const locale = useLocale();

  return {
    t,
    locale,
    currency: (amount: number, currency: string = 'AUD') => {
      return formatCurrency(amount, locale === 'zh' ? 'zh-CN' : 'en-AU', currency);
    },
    percent: (value: number, decimals: number = 1) => {
      return formatPercent(value, locale === 'zh' ? 'zh-CN' : 'en-AU', decimals);
    },
    number: (value: number, decimals: number = 0) => {
      return formatNumber(value, locale === 'zh' ? 'zh-CN' : 'en-AU', {
        maximumFractionDigits: decimals,
      });
    },
  };
}

