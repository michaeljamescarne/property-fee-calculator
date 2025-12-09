"use client";

import { useEffect } from "react";

interface HubSpotTrackingProps {
  hubspotId?: string;
}

/**
 * HubSpot Tracking Component
 * 
 * Loads the HubSpot tracking code which includes:
 * - Website analytics tracking
 * - Live chat widget (when configured in HubSpot)
 * - Form tracking
 * - Contact tracking
 * 
 * The chat widget will automatically appear once:
 * 1. This tracking code is installed (✅ already done)
 * 2. A chat channel is configured in HubSpot Inbox settings
 * 
 * @see https://knowledge.hubspot.com/inbox/connect-and-customize-a-chat-channel-in-the-conversations-inbox
 * @see https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code
 */
export default function HubSpotTracking({ hubspotId }: HubSpotTrackingProps) {
  const id = hubspotId || process.env.NEXT_PUBLIC_HUBSPOT_ID || "442487843";

  useEffect(() => {
    if (!id) {
      console.warn("HubSpot tracking ID not found. Chat widget will not appear.");
      return;
    }

    // Check if script already exists to avoid duplicates
    if (document.getElementById("hs-script-loader")) {
      return;
    }

    // Create and append the HubSpot tracking script
    // This matches HubSpot's exact implementation requirements
    // The script automatically includes chat widget support when configured
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    // Use protocol-relative URL as recommended by HubSpot
    script.src = `//js-ap1.hs-scripts.com/${id}.js`;

    // Add error handling
    script.onerror = () => {
      console.error("Failed to load HubSpot tracking script");
    };

    document.body.appendChild(script);

    // Cleanup function (though script will persist)
    return () => {
      const existingScript = document.getElementById("hs-script-loader");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [id]);

  return null;
}
