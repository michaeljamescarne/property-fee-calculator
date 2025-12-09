"use client";

import Script from "next/script";
import { useEffect } from "react";

interface MetaPixelProps {
  pixelId?: string;
}

export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const id = pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (!id) {
      console.warn("Meta Pixel ID not configured");
      return;
    }

    // Initialize fbq if not already loaded
    if (typeof window !== "undefined" && !window.fbq) {
      (window as unknown as { fbq: unknown }).fbq = function (...args: unknown[]) {
        ((window as unknown as { _fbq: unknown[] })._fbq =
          (window as unknown as { _fbq: unknown[] })._fbq || []).push(args);
      };
      (window as unknown as { _fbq: unknown[] })._fbq =
        (
          window as unknown as {
            _fbq: unknown[];
          }
        )._fbq || [];
    }
  }, [id]);

  if (!id) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${id}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * Track Meta Pixel events
 */
declare global {
  interface Window {
    fbq: (command: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export const trackMetaEvent = {
  pageView: () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  },
  lead: (params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", params);
    }
  },
  completeRegistration: (params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "CompleteRegistration", params);
    }
  },
  calculatorCompleted: (propertyValue?: number) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: "FIRB Calculator",
        content_category: "Calculator",
        value: propertyValue,
        currency: "AUD",
      });
    }
  },
};



