/**
 * Individual Property Transaction API Route
 * Get, update, or delete a specific transaction
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { getProperty } from "@/lib/properties/storage";
import {
  getPropertyTransaction,
  updatePropertyTransaction,
  deletePropertyTransaction,
} from "@/lib/properties/transactions";
import { propertyTransactionUpdateSchema } from "@/lib/validations/properties";

// GET: Fetch a specific transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
) {
  try {
    const { id: propertyId, transactionId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const transaction = await getPropertyTransaction(transactionId, propertyId);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH: Update a transaction
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
) {
  try {
    const { id: propertyId, transactionId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const body = await request.json();

    // Validate request body
    const validation = propertyTransactionUpdateSchema.safeParse({
      ...body,
      id: transactionId,
      property_id: propertyId,
    });

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

    const transactionData = validation.data;
    const { id: _, ...updates } = transactionData; // Remove id from updates

    const transaction = await updatePropertyTransaction(transactionId, propertyId, updates);

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    if (error instanceof Error && error.message === "Transaction not found") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update transaction",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a transaction (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
) {
  try {
    const { id: propertyId, transactionId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    await deletePropertyTransaction(transactionId, propertyId);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);
    if (error instanceof Error && error.message === "Transaction not found") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete transaction",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
