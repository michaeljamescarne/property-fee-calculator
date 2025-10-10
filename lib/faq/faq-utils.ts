// FAQ Utility Functions

import type { FAQCategory } from '@/types/faq';
import faqData from './faq-data.json';

export function getFAQData(): FAQCategory[] {
  return (faqData as { categories: FAQCategory[] }).categories;
}

export function getCategoryIcon(iconName: string) {
  // Map icon names to lucide-react icons
  const iconMap: Record<string, string> = {
    FileText: 'FileText',
    UserCheck: 'UserCheck',
    DollarSign: 'DollarSign',
    AlertTriangle: 'AlertTriangle',
    Home: 'Home',
    HelpCircle: 'HelpCircle',
  };

  return iconMap[iconName] || 'HelpCircle';
}

export function getCategoryById(
  categories: FAQCategory[],
  categoryId: string
): FAQCategory | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

export function getQuestionById(
  categories: FAQCategory[],
  questionId: string
) {
  for (const category of categories) {
    const question = category.questions.find((q) => q.id === questionId);
    if (question) {
      return { question, category };
    }
  }
  return null;
}

export function getTotalQuestionsCount(categories: FAQCategory[]): number {
  return categories.reduce((total, cat) => total + cat.questions.length, 0);
}

export function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateFAQUrl(locale: string, questionId?: string): string {
  const base = `/${locale}/faq`;
  return questionId ? `${base}#${questionId}` : base;
}

export function scrollToQuestion(questionId: string) {
  const element = document.getElementById(questionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Optionally highlight the question
    element.classList.add('highlight-question');
    setTimeout(() => {
      element.classList.remove('highlight-question');
    }, 2000);
  }
}

