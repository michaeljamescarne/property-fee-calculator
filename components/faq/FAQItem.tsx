'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, Calculator } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { FAQQuestion } from '@/types/faq';
import { useLocale } from 'next-intl';

interface FAQItemProps {
  question: FAQQuestion;
  isOpen?: boolean;
  onToggle?: (questionId: string) => void;
}

export default function FAQItem({ question, isOpen: controlledIsOpen, onToggle }: FAQItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const locale = useLocale();
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(question.id);
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div
      id={question.id}
      className="border-b border-border/40 last:border-b-0 scroll-mt-24"
    >
      <button
        onClick={handleToggle}
        className="w-full text-left px-6 py-5 hover:bg-muted/30 transition-colors flex items-start justify-between gap-4 group"
        aria-expanded={isOpen}
        aria-controls={`answer-${question.id}`}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors pr-4">
            {question.question}
          </h3>
          {question.popular && (
            <span className="inline-block mt-2 text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
              Popular
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 mt-1 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={`answer-${question.id}`}
          className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {question.answer}
            </p>
          </div>

          {/* Calculator Scenario Button */}
          {question.calculatorScenario && (
            <div className="mt-6">
              <Button asChild className="rounded-lg">
                <Link href={`/${locale}/firb-calculator`}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Your Fees
                </Link>
              </Button>
            </div>
          )}

          {/* Official Sources */}
          {question.officialSources && question.officialSources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/40">
              <h4 className="text-sm font-semibold text-foreground/70 mb-3">
                Official Sources:
              </h4>
              <div className="space-y-2">
                {question.officialSources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Questions Link */}
          {question.relatedQuestions && question.relatedQuestions.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium">Related questions: </span>
              <span className="text-primary">{question.relatedQuestions.length} more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

