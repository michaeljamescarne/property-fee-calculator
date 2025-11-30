"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  gaId?: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-BQTTCSVY3H";

  useEffect(() => {
    if (!measurementId) {
      console.warn("Google Analytics Measurement ID not configured");
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag as typeof window.gtag;
    gtag("js", new Date());
    gtag("config", measurementId, {
      page_path: window.location.pathname,
    });
  }, [measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Track a custom event
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-BQTTCSVY3H";
    window.gtag("config", measurementId, {
      page_path: url,
    });
  }
}

/**
 * Track conversion events
 */
export const trackConversion = {
  calculatorCompleted: (propertyValue?: number, state?: string) => {
    trackEvent("calculator_completed", "Calculator", "FIRB Calculator", propertyValue);
    if (state) {
      trackEvent("calculator_completed_state", "Calculator", state);
    }
  },
  pdfDownloaded: (withAnalytics: boolean) => {
    trackEvent("pdf_downloaded", "Downloads", withAnalytics ? "PDF with Analytics" : "PDF Basic");
  },
  emailSent: () => {
    trackEvent("email_sent", "Engagement", "Results Email");
  },
  leadCaptured: (source: string) => {
    trackEvent("lead_captured", "Leads", source);
  },
};
