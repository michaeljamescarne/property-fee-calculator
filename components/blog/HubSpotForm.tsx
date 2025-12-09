"use client";

import { useEffect, useRef } from "react";

interface HubSpotFormProps {
  formId: string;
  portalId: string;
  region?: string;
  target?: string;
  className?: string;
}

/**
 * HubSpot Form Component
 * 
 * Embeds a HubSpot form for lead capture on blog posts
 * Works with HubSpot Free Tier
 * 
 * @param formId - HubSpot form ID (get from HubSpot form settings)
 * @param portalId - HubSpot portal ID (your HubSpot account ID, e.g., 442487843)
 * @param region - HubSpot region (default: "na1" for North America, use "ap1" for Asia Pacific)
 * @param target - CSS selector for form container (default: creates its own container)
 */
export default function HubSpotForm({
  formId,
  portalId,
  region = "ap1", // Asia Pacific region (adjust if needed)
  target,
  className = "",
}: HubSpotFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const formLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    if (formLoadedRef.current) return;

    // Check if HubSpot form script is already loaded
    if (window.hbspt) {
      loadForm();
      return;
    }

    // Load HubSpot forms script
    const script = document.createElement("script");
    script.src = `https://js-${region}.hsforms.net/forms/v2.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      loadForm();
    };
    script.onerror = () => {
      console.error("Failed to load HubSpot forms script");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [formId, portalId, region, target]);

  const loadForm = () => {
    if (!window.hbspt || formLoadedRef.current) return;

    const targetElement = target
      ? document.querySelector(target)
      : containerRef.current;

    if (!targetElement) {
      console.error("HubSpot form target not found");
      return;
    }

    try {
      window.hbspt.forms.create({
        portalId: portalId,
        formId: formId,
        target: target ? target : `#hubspot-form-${formId}`,
        region: region,
      });

      formLoadedRef.current = true;
    } catch (error) {
      console.error("Error loading HubSpot form:", error);
    }
  };

  return (
    <div
      id={`hubspot-form-${formId}`}
      ref={containerRef}
      className={className}
    />
  );
}

// Extend Window interface for HubSpot forms
declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          portalId: string;
          formId: string;
          target: string;
          region: string;
        }) => void;
      };
    };
  }
}




