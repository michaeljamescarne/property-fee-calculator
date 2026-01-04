import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/hubspot/client";

/**
 * API Route: Track HubSpot Event
 *
 * POST /api/hubspot/track-event
 *
 * Body:
 * {
 *   "eventName": "blog_post_view",
 *   "properties": { "post_slug": "firb-guide" },
 *   "email": "user@example.com" // optional
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, properties, email } = body;

    if (!eventName) {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    const success = await trackEvent(eventName, properties, email);

    if (!success) {
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in track-event route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
