/**
 * Individual Property API Route
 * Get, update, or delete a specific property
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { getProperty, updateProperty, deleteProperty } from "@/lib/properties/storage";
import { propertyUpdateSchema } from "@/lib/validations/properties";

// GET: Fetch a specific property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const property = await getProperty(id, session.user.id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH: Update a property
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validation = propertyUpdateSchema.safeParse({ ...body, id });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: "Please check all required fields are filled correctly",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const propertyData = validation.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updates } = propertyData; // Remove id from updates

    const property = await updateProperty(id, session.user.id, updates);

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Update property error:", error);
    if (error instanceof Error && error.message === "Property not found") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update property",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a property (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteProperty(id, session.user.id);

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    if (error instanceof Error && error.message === "Property not found") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete property",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
