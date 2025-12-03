"use client";

import Script from "next/script";

interface HubSpotTrackingProps {
  hubspotId?: string;
}

export default function HubSpotTracking({ hubspotId }: HubSpotTrackingProps) {
  const id = hubspotId || process.env.NEXT_PUBLIC_HUBSPOT_ID || "442487843";

  if (!id) {
    return null;
  }

  return (
    <Script
      id="hs-script-loader"
      strategy="afterInteractive"
      src={`//js-ap1.hs-scripts.com/${id}.js`}
      async
      defer
    />
  );
}
