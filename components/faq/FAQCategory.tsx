'use client';

import { useState } from 'react';
import { FileText, UserCheck, DollarSign, AlertTriangle, Home, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import FAQItem from './FAQItem';
import type { FAQCategory as FAQCategoryType } from '@/types/faq';

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
};

export default function FAQCategory({ category, defaultOpen = false, openQuestionId: externalOpenQuestionId }: FAQCategoryProps) {
  const [internalOpenQuestionId, setInternalOpenQuestionId] = useState<string | null>(
    defaultOpen && category.questions.length > 0 ? category.questions[0].id : null
  );
  
  // Use external openQuestionId if provided, otherwise use internal state
  const openQuestionId = externalOpenQuestionId || internalOpenQuestionId;

  const Icon = iconMap[category.icon as keyof typeof iconMap] || HelpCircle;

  const handleQuestionToggle = (questionId: string) => {
    setInternalOpenQuestionId(openQuestionId === questionId ? null : questionId);
  };

  return (
    <section id={category.id} className="scroll-mt-24">
      <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {category.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="divide-y divide-border/40">
          {category.questions.map((question) => (
            <FAQItem
              key={question.id}
              question={question}
              isOpen={openQuestionId === question.id}
              onToggle={handleQuestionToggle}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}

