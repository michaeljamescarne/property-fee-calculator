/**
 * Utility functions for formatting numbers, currency, and percentages
 * with internationalization support
 */

export interface FormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format a number with locale-specific thousands separators and decimals
 */
export function formatNumber(
  value: number,
  locale: string = 'en-AU',
  options?: FormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value);
}

/**
 * Format currency with proper symbol and locale
 */
export function formatCurrency(
  value: number,
  locale: string = 'en-AU',
  currency: string = 'AUD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format currency with cents (for smaller amounts)
 */
export function formatCurrencyWithCents(
  value: number,
  locale: string = 'en-AU',
  currency: string = 'AUD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage with locale-specific formatting
 */
export function formatPercent(
  value: number,
  locale: string = 'en-AU',
  decimals: number = 1
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format a compact number (e.g., 1.5M, 250K)
 */
export function formatCompact(
  value: number,
  locale: string = 'en-AU'
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a date with locale-specific formatting
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-AU',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Convert currency from AUD to another currency
 */
export function convertCurrency(
  audAmount: number,
  exchangeRate: number,
  targetCurrency: string,
  locale: string = 'en-AU'
): string {
  const converted = audAmount * exchangeRate;
  
  // Get locale for target currency
  const currencyLocaleMap: Record<string, string> = {
    USD: 'en-US',
    CNY: 'zh-CN',
    EUR: 'en-GB',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    SGD: 'en-SG',
  };

  const targetLocale = currencyLocaleMap[targetCurrency] || locale;

  return formatCurrency(converted, targetLocale, targetCurrency);
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currency: string, locale: string = 'en-AU'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  })
    .formatToParts(0)
    .find(part => part.type === 'currency')?.value || currency;
}

/**
 * Format large numbers with ordinal suffixes (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(n: number, locale: string = 'en-AU'): string {
  if (locale.startsWith('zh')) {
    return `第${n}`;
  }

  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Format a range of values
 */
export function formatRange(
  min: number,
  max: number,
  formatter: (n: number) => string
): string {
  return `${formatter(min)} - ${formatter(max)}`;
}

/**
 * Format duration in years
 */
export function formatYears(years: number, locale: string = 'en-AU'): string {
  if (locale.startsWith('zh')) {
    return `${years}年`;
  }
  return years === 1 ? '1 year' : `${years} years`;
}

