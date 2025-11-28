"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ExternalLink, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react";
import Link from "next/link";
import type { FAQQuestion, FAQCategory } from "@/types/faq";
import RelatedQuestions from "./RelatedQuestions";
import { getFAQData } from "@/lib/faq/faq-utils";
import { getRelatedQuestions } from "@/lib/faq/faq-search";
import { findRelatedBlogPosts } from "@/lib/utils/blog-linking";
import type { BlogPost } from "@/lib/blogContentProcessor";

interface FAQItemProps {
  question: FAQQuestion;
  category: FAQCategory;
  isOpen: string | null | undefined;
  onToggle: (questionId: string) => void;
  locale: string;
}

export default function FAQItem({ question, category, isOpen, onToggle, locale }: FAQItemProps) {
  const [helpfulVote, setHelpfulVote] = useState<"helpful" | "not-helpful" | null>(null);
  const isCurrentlyOpen = isOpen === question.id;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(question.id);
  };

  const handleHelpfulVote = (vote: "helpful" | "not-helpful") => {
    setHelpfulVote(vote);
    // TODO: Send vote to analytics/backend
  };

  // Get related questions
  const allCategories = getFAQData();
  const relatedQuestions = getRelatedQuestions(question.id, allCategories);

  // Get related blog posts - fetch from API to avoid fs module issues
  const [relatedBlogPosts, setRelatedBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch blog posts from API route (server-side only)
    fetch(`/api/blog-posts?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts) {
          const related = findRelatedBlogPosts(question.question, data.posts, 2);
          setRelatedBlogPosts(related);
        }
      })
      .catch(() => {
        // Silently fail - blog posts are optional
      });
  }, [question.question, locale]);

  return (
    <div id={question.id} className="scroll-mt-24">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/20 rounded cursor-pointer"
        aria-expanded={isCurrentlyOpen}
        aria-controls={`faq-answer-${question.id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-900 flex-1 pr-4">{question.question}</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
              isCurrentlyOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isCurrentlyOpen && (
        <div
          id={`faq-answer-${question.id}`}
          className="px-6 pb-5 text-gray-600 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="prose prose-sm max-w-none">
            <p className="leading-relaxed whitespace-pre-line">{question.answer}</p>

            {/* Official Sources */}
            {question.officialSources && question.officialSources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Official Sources:</p>
                <ul className="space-y-1">
                  {question.officialSources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {source.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Was this helpful? */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-3">Was this helpful?</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleHelpfulVote("helpful")}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    helpfulVote === "helpful"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                  disabled={helpfulVote !== null}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleHelpfulVote("not-helpful")}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    helpfulVote === "not-helpful"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                  disabled={helpfulVote !== null}
                >
                  <ThumbsDown className="h-4 w-4" />
                  No
                </button>
              </div>
              {helpfulVote && (
                <p className="text-xs text-gray-500 mt-2">
                  {helpfulVote === "helpful"
                    ? "Thank you for your feedback!"
                    : "We're sorry this wasn't helpful. Please contact support if you need further assistance."}
                </p>
              )}
            </div>

            {/* Related Questions */}
            {relatedQuestions.length > 0 && (
              <RelatedQuestions questions={relatedQuestions} locale={locale} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
