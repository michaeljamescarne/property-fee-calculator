'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { FAQQuestion, FAQCategory } from '@/types/faq';

interface PopularQuestionsProps {
  questions: { question: FAQQuestion; category: FAQCategory }[];
  locale: string;
}

export default function PopularQuestions({ questions, locale }: PopularQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-accent/10 p-2.5 rounded-lg">
          <TrendingUp className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Popular Questions
          </h2>
          <p className="text-muted-foreground mt-1">
            Most frequently asked by foreign property buyers
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map(({ question, category }) => (
          <Link
            key={question.id}
            href={`/${locale}/faq#${question.id}`}
            className="group"
          >
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-all bg-white rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                    {category.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {question.question}
                </h3>
                
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {question.answer.slice(0, 120)}...
                </p>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">
                    {question.views.toLocaleString()} views
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}


