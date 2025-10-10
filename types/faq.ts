// FAQ Type Definitions

export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  popular: boolean;
  views: number;
  relatedQuestions: string[];
  calculatorScenario: {
    entityType?: string;
    propertyType?: string;
    action?: string;
  } | null;
  officialSources: {
    title: string;
    url: string;
  }[];
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  questions: FAQQuestion[];
}

export interface FAQData {
  categories: FAQCategory[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalQuestions: number;
    totalCategories: number;
  };
}

export interface FAQSearchResult {
  question: FAQQuestion;
  category: FAQCategory;
  relevance: number;
}

export interface FAQFilterOptions {
  category?: string;
  popular?: boolean;
  searchTerm?: string;
}

