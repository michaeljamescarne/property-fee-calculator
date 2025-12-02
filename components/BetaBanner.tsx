"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EmailCaptureModal from "./EmailCaptureModal";

const STORAGE_KEY = "betaBannerDismissed";

export default function BetaBanner() {
  const t = useTranslations("BetaBanner");
  const [isDismissed, setIsDismissed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage on mount
    const dismissed = localStorage.getItem(STORAGE_KEY) === "true";
    setIsDismissed(dismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || isDismissed) {
    return null;
  }

  return (
    <>
      <div
        role="banner"
        aria-label={t("ariaLabel")}
        className={cn(
          "w-full bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50",
          "text-amber-900 shadow-sm"
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left side: Beta badge and message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Sparkles className="h-4 w-4 text-amber-600" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {t("badge")}
                </span>
              </div>
              <p className="text-sm font-medium text-amber-900 flex-1 min-w-0">
                <span className="hidden sm:inline">{t("message")}</span>
                <span className="sm:hidden">{t("messageMobile")}</span>
              </p>
            </div>

            {/* Right side: CTA button and close button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleOpenModal}
                size="sm"
                variant="default"
                className={cn(
                  "bg-amber-600 hover:bg-amber-700 text-white",
                  "text-xs sm:text-sm font-medium",
                  "h-7 sm:h-8 px-3 sm:px-4"
                )}
              >
                {t("ctaButton")}
              </Button>
              <button
                onClick={handleDismiss}
                aria-label={t("closeButton")}
                className={cn(
                  "flex-shrink-0 rounded-md p-1",
                  "text-amber-700 hover:text-amber-900 hover:bg-amber-100",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                  "h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center"
                )}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EmailCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
