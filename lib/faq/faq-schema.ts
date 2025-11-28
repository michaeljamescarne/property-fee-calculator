// FAQ Schema.org Structured Data Generation

import type { FAQCategory } from "@/types/faq";
import { getLocaleUrl } from "@/lib/utils/schema-base-url";

export function generateFAQPageSchema(categories: FAQCategory[]) {
  const mainEntity = categories.flatMap((category) =>
    category.questions.map((question) => {
      // Extract plain text from answer (remove HTML tags if present)
      const answerText = question.answer
        .replace(/<[^>]*>/g, "")
        .replace(/\n/g, " ")
        .trim();

      return {
        "@type": "Question",
        name: question.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answerText || question.answer,
        },
        // Add category context if available
        ...(category.name && {
          about: {
            "@type": "Thing",
            name: category.name,
          },
        }),
      };
    })
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
    // Add aggregate rating potential (can be enhanced with actual ratings later)
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.8",
    //   reviewCount: "150"
    // }
  };
}

export function generateBreadcrumbSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: getLocaleUrl(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: getLocaleUrl(locale, "faq"),
      },
    ],
  };
}

export function generateWebPageSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Frequently Asked Questions",
    description:
      "Comprehensive answers to FIRB approval, costs, visa requirements, and buying Australian property as a foreign investor.",
    url: getLocaleUrl(locale, "faq"),
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    keywords: [
      "FIRB",
      "foreign property buyer",
      "Australia",
      "stamp duty surcharge",
      "property investment",
      "visa requirements",
      "FIRB fees",
      "land tax surcharge",
    ],
  };
}

export function injectStructuredData(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
