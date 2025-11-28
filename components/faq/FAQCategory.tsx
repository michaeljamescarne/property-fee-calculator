"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  FileText,
  UserCheck,
  DollarSign,
  AlertTriangle,
  Home,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import FAQItem from "./FAQItem";
import type { FAQCategory as FAQCategoryType } from "@/types/faq";

interface FAQCategoryProps {
  category: FAQCategoryType;
  defaultOpen?: boolean;
  openQuestionId?: string;
}

const iconMap = {
  FileText,
  UserCheck,
  DollarSign,
  AlertTriangle,
  Home,
  HelpCircle,
  BookOpen,
};

export default function FAQCategory({
  category,
  defaultOpen = false,
  openQuestionId: externalOpenQuestionId,
}: FAQCategoryProps) {
  const locale = useLocale();
  const [internalOpenQuestionId, setInternalOpenQuestionId] = useState<string | null>(
    defaultOpen && category.questions.length > 0 ? category.questions[0].id : null
  );

  // Sync external openQuestionId to internal state when it changes
  useEffect(() => {
    if (externalOpenQuestionId && category.questions.some((q) => q.id === externalOpenQuestionId)) {
      setInternalOpenQuestionId(externalOpenQuestionId);
    }
  }, [externalOpenQuestionId, category.questions]);

  // Use internal state for toggling (allows user interaction to override external state)
  const openQuestionId = internalOpenQuestionId;

  const Icon = iconMap[category.icon as keyof typeof iconMap] || HelpCircle;

  const handleQuestionToggle = (questionId: string) => {
    // If clicking the currently open question, close it
    if (openQuestionId === questionId) {
      setInternalOpenQuestionId(null);
    } else {
      // Otherwise, open the clicked question
      setInternalOpenQuestionId(questionId);
    }
  };

  return (
    <section id={category.id} className="scroll-mt-24">
      <Card className="border border-gray-200 shadow-sm rounded overflow-hidden bg-white p-0">
        {/* Category Header */}
        <div className="bg-blue-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {category.questions.length}{" "}
                {category.questions.length === 1 ? "question" : "questions"}
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="divide-y divide-gray-200">
          {category.questions.map((question) => (
            <FAQItem
              key={question.id}
              question={question}
              category={category}
              isOpen={openQuestionId}
              onToggle={handleQuestionToggle}
              locale={locale}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
