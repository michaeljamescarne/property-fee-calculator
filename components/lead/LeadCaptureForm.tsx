/**
 * Lead Capture Form Component
 * Simple email capture form for lead generation
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";

interface LeadCaptureFormProps {
  variant?: "default" | "compact" | "inline";
  onSuccess?: () => void;
}

export default function LeadCaptureForm({ variant = "default", onSuccess }: LeadCaptureFormProps) {
  const t = useTranslations("LeadCapture");

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage(t("errors.invalidEmail"));
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setStatus("idle");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setEmail(""); // Clear form

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Reset success state after 5 seconds (for inline forms)
        if (variant === "inline") {
          setTimeout(() => {
            setStatus("idle");
          }, 5000);
        }
      } else {
        // Include details in development mode for debugging
        const errorMessage = data.error || t("errors.generic");
        const details = data.details ? ` (${data.details})` : "";
        throw new Error(errorMessage + details);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compact variant (for smaller spaces)
  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || status === "success"}
            required
            className="flex-1"
            aria-label={t("emailLabel")}
          />
          <Button type="submit" disabled={isSubmitting || status === "success"} size="default">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              t("submitButton")
            )}
          </Button>
        </div>
        {status === "error" && errorMessage && (
          <Alert variant="destructive" className="py-2">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
          </Alert>
        )}
        {status === "success" && (
          <Alert className="py-2 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              {t("success.message")}
            </AlertDescription>
          </Alert>
        )}
      </form>
    );
  }

  // Inline variant (for content sections)
  if (variant === "inline") {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="lead-email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || status === "success"}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting || status === "success"} size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t("success.button")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t("submitButton")}
                </>
              )}
            </Button>
          </div>
          {status === "error" && errorMessage && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{t("success.message")}</AlertDescription>
            </Alert>
          )}
        </form>
        <p className="text-sm text-gray-600">{t("privacyNote")}</p>
      </div>
    );
  }

  // Default variant (full form with description)
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="lead-email-default"
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting || status === "success"}
          required
          className="w-full"
        />
        <Button
          type="submit"
          disabled={isSubmitting || status === "success"}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("submitting")}
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              {t("success.button")}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-5 w-5" />
              {t("submitButton")}
            </>
          )}
        </Button>
        {status === "error" && errorMessage && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{t("success.message")}</AlertDescription>
          </Alert>
        )}
      </form>
      <p className="text-xs text-gray-500 text-center">{t("privacyNote")}</p>
    </div>
  );
}
