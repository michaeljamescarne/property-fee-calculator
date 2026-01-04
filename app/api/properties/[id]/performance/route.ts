/**
 * Property Performance API Route
 * Calculate performance metrics for a property
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { getProperty } from "@/lib/properties/storage";
import { calculatePropertyPerformance } from "@/lib/properties/performance";

// GET: Get performance metrics for a property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: propertyId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const metrics = await calculatePropertyPerformance(property);

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error("Calculate performance error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
