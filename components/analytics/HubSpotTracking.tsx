"use client";

import { useEffect } from "react";

interface HubSpotTrackingProps {
  hubspotId?: string;
}

export default function HubSpotTracking({ hubspotId }: HubSpotTrackingProps) {
  const id = hubspotId || process.env.NEXT_PUBLIC_HUBSPOT_ID || "442487843";

  useEffect(() => {
    if (!id) {
      return;
    }

    // Check if script already exists to avoid duplicates
    if (document.getElementById("hs-script-loader")) {
      return;
    }

    // Create and append the HubSpot tracking script
    // This matches HubSpot's exact implementation requirements
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    script.src = `https://js-ap1.hs-scripts.com/${id}.js`;

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
