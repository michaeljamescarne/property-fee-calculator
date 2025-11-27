"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpfulFeedbackProps {
  postSlug: string;
}

export default function HelpfulFeedback({ postSlug }: HelpfulFeedbackProps) {
  const [helpfulVote, setHelpfulVote] = useState<"helpful" | "not-helpful" | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Check if user has already voted (using localStorage)
  useEffect(() => {
    const votedKey = `blog-feedback-${postSlug}`;
    const voted = localStorage.getItem(votedKey);
    if (voted) {
      setHelpfulVote(voted as "helpful" | "not-helpful");
      setHasVoted(true);
    }
  }, [postSlug]);

  const handleVote = (vote: "helpful" | "not-helpful") => {
    if (hasVoted) return;

    setHelpfulVote(vote);
    setHasVoted(true);

    // Save to localStorage to prevent duplicate votes
    const votedKey = `blog-feedback-${postSlug}`;
    localStorage.setItem(votedKey, vote);

    // Show textarea for "not helpful" votes
    if (vote === "not-helpful") {
      setShowTextarea(true);
    }

    // TODO: Send vote to analytics/backend API
    // Example: fetch('/api/blog-feedback', { method: 'POST', body: JSON.stringify({ postSlug, vote, feedbackText }) })
  };

  const handleSubmitFeedback = () => {
    // TODO: Send feedback text to backend
    // Example: fetch('/api/blog-feedback', { method: 'POST', body: JSON.stringify({ postSlug, vote: helpfulVote, feedbackText }) })

    // Show confirmation
    setFeedbackText("");
    setShowTextarea(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <p className="text-base font-medium text-gray-900 mb-4">Was this article helpful?</p>
      <div className="flex items-center gap-3 mb-4">
        <Button
          type="button"
          variant={helpfulVote === "helpful" ? "default" : "outline"}
          onClick={() => handleVote("helpful")}
          disabled={hasVoted}
          className={`flex items-center gap-2 ${
            helpfulVote === "helpful" ? "bg-green-600 hover:bg-green-700 text-white" : ""
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </Button>
        <Button
          type="button"
          variant={helpfulVote === "not-helpful" ? "default" : "outline"}
          onClick={() => handleVote("not-helpful")}
          disabled={hasVoted}
          className={`flex items-center gap-2 ${
            helpfulVote === "not-helpful" ? "bg-red-600 hover:bg-red-700 text-white" : ""
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </Button>
      </div>

      {helpfulVote && (
        <div className="mt-4">
          {helpfulVote === "helpful" ? (
            <p className="text-sm text-green-600 font-medium">
              Thank you for your feedback! We&apos;re glad this article was helpful.
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                We&apos;re sorry this wasn&apos;t helpful. Please let us know how we can improve:
              </p>
              {showTextarea && (
                <div className="space-y-3">
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="What could we improve? (optional)"
                    className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                  />
                  <Button onClick={handleSubmitFeedback} size="sm">
                    Submit Feedback
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
