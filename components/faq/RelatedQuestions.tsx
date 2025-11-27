"use client";

import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { FAQQuestion, FAQCategory } from "@/types/faq";

interface RelatedQuestionsProps {
  questions: { question: FAQQuestion; category: FAQCategory }[];
  locale: string;
}

export default function RelatedQuestions({ questions, locale }: RelatedQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <LinkIcon className="h-4 w-4" />
        Related Questions
      </h4>

      <div className="grid gap-3">
        {questions.slice(0, 3).map(({ question, category }) => (
          <Link key={question.id} href={`/${locale}/faq#${question.id}`} className="group">
            <Card className="border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all rounded">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 mb-1.5 block">{category.name}</span>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {question.question}
                    </p>
                  </div>
                  <LinkIcon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
