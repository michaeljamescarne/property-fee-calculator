/**
 * Property Transactions API Route
 * List and create transactions for a property
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { getProperty } from "@/lib/properties/storage";
import { getPropertyTransactions, createPropertyTransaction } from "@/lib/properties/transactions";
import { propertyTransactionCreateSchema } from "@/lib/validations/properties";

// GET: List transactions for a property
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

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const type = searchParams.get("type") as "income" | "expense" | "capital" | undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const transactions = await getPropertyTransactions(propertyId, {
      category,
      type,
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error("List transactions error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: Create a new transaction
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await request.json();

    // Validate request body
    const validation = propertyTransactionCreateSchema.safeParse({
      ...body,
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

    const transaction = await createPropertyTransaction(transactionData);

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create transaction",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
