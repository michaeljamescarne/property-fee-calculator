/**
 * Email Results Modal Component
 * Allows users to email their FIRB calculation results
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackConversion } from "@/components/analytics/GoogleAnalytics";
import { trackMetaEvent } from "@/components/analytics/MetaPixel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { PDFTranslations } from "@/lib/pdf/pdfTranslations";

interface EmailResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  formData: FIRBCalculatorFormData;
  locale: string;
  pdfTranslations: PDFTranslations;
}

export default function EmailResultsModal({
  isOpen,
  onClose,
  eligibility,
  costs,
  formData,
  locale,
  pdfTranslations,
}: EmailResultsModalProps) {
  const t = useTranslations("FIRBCalculator.emailModal");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !consent) {
      setErrorMessage(t("errors.required"));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage(t("errors.invalidEmail"));
      return;
    }

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-firb-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          eligibility,
          costs,
          formData,
          locale,
          pdfTranslations,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        // Track successful email send
        trackConversion.emailSent();
        trackMetaEvent.lead({
          content_name: "Email Results Sent",
          content_category: "Email",
        });
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail("");
          setName("");
          setConsent(false);
          setStatus("idle");
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("error");
      setErrorMessage(t("errors.sendFailed"));
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setEmail("");
      setName("");
      setConsent(false);
      setStatus("idle");
      setErrorMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-semibold">{t("success.title")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("success.description")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("emailLabel")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSending}
                  required
                />
              </div>

              {/* Name Input (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("nameLabel")}{" "}
                  <span className="text-sm text-muted-foreground">({t("optional")})</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSending}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  disabled={isSending}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="consent" className="cursor-pointer text-sm">
                    {t("consentLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{t("consentDescription")}</p>
                </div>
              </div>

              {/* Error Message */}
              {(errorMessage || status === "error") && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage || t("errors.general")}</AlertDescription>
                </Alert>
              )}

              {/* Info Message */}
              <Alert>
                <AlertDescription className="text-sm">{t("info")}</AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSending}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSending || !email || !consent}>
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSending ? t("sending") : t("send")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
