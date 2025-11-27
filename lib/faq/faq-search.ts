// FAQ Search and Filter Logic

import type { FAQQuestion, FAQCategory, FAQSearchResult, FAQFilterOptions } from "@/types/faq";

export function searchFAQs(categories: FAQCategory[], searchTerm: string): FAQSearchResult[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();
  const results: FAQSearchResult[] = [];

  categories.forEach((category) => {
    category.questions.forEach((question) => {
      let relevance = 0;

      // Check question text (highest weight)
      if (question.question.toLowerCase().includes(term)) {
        relevance += 10;
      }

      // Check answer text (medium weight)
      if (question.answer.toLowerCase().includes(term)) {
        relevance += 5;
      }

      // Check keywords (medium weight)
      question.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(term)) {
          relevance += 3;
        }
      });

      // Check category name (low weight)
      if (category.name.toLowerCase().includes(term)) {
        relevance += 2;
      }

      if (relevance > 0) {
        results.push({
          question,
          category,
          relevance,
        });
      }
    });
  });

  // Sort by relevance (highest first)
  return results.sort((a, b) => b.relevance - a.relevance);
}

export function filterFAQs(categories: FAQCategory[], options: FAQFilterOptions): FAQCategory[] {
  let filtered = [...categories];

  // Filter by category
  if (options.category) {
    filtered = filtered.filter((cat) => cat.id === options.category);
  }

  // Filter by popular
  if (options.popular) {
    filtered = filtered
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter((q) => q.popular),
      }))
      .filter((cat) => cat.questions.length > 0);
  }

  // Search term filtering
  if (options.searchTerm && options.searchTerm.trim().length >= 2) {
    const searchResults = searchFAQs(filtered, options.searchTerm);
    const questionIds = new Set(searchResults.map((r) => r.question.id));

    filtered = filtered
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter((q) => questionIds.has(q.id)),
      }))
      .filter((cat) => cat.questions.length > 0);
  }

  return filtered;
}

export function getPopularQuestions(
  categories: FAQCategory[],
  limit: number = 6
): { question: FAQQuestion; category: FAQCategory }[] {
  const all: { question: FAQQuestion; category: FAQCategory }[] = [];

  categories.forEach((category) => {
    category.questions.forEach((question) => {
      if (question.popular) {
        all.push({ question, category });
      }
    });
  });

  // Sort by views
  return all.sort((a, b) => b.question.views - a.question.views).slice(0, limit);
}

export function getRelatedQuestions(
  currentQuestionId: string,
  categories: FAQCategory[]
): { question: FAQQuestion; category: FAQCategory }[] {
  // Find the current question
  let currentQuestion: FAQQuestion | null = null;

  for (const category of categories) {
    const found = category.questions.find((q) => q.id === currentQuestionId);
    if (found) {
      currentQuestion = found;
      break;
    }
  }

  if (!currentQuestion || !currentQuestion.relatedQuestions.length) {
    return [];
  }

  // Get the related questions
  const related: { question: FAQQuestion; category: FAQCategory }[] = [];

  currentQuestion.relatedQuestions.forEach((relatedId) => {
    for (const category of categories) {
      const found = category.questions.find((q) => q.id === relatedId);
      if (found) {
        related.push({ question: found, category });
        break;
      }
    }
  });

  return related;
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}
