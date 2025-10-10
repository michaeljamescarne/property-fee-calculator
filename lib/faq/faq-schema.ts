// FAQ Schema.org Structured Data Generation

import type { FAQCategory } from '@/types/faq';

export function generateFAQPageSchema(categories: FAQCategory[]) {
  const mainEntity = categories.flatMap((category) =>
    category.questions.map((question) => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
      },
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

export function generateBreadcrumbSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://aupropertyinvestmentmc.vercel.app/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: `https://aupropertyinvestmentmc.vercel.app/${locale}/faq`,
      },
    ],
  };
}

export function generateWebPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Frequently Asked Questions',
    description:
      'Comprehensive answers to FIRB approval, costs, visa requirements, and buying Australian property as a foreign investor.',
    url: `https://aupropertyinvestmentmc.vercel.app/${locale}/faq`,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-AU',
    keywords: [
      'FIRB',
      'foreign property buyer',
      'Australia',
      'stamp duty surcharge',
      'property investment',
      'visa requirements',
      'FIRB fees',
      'land tax surcharge',
    ],
  };
}

export function injectStructuredData(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}

