/**
 * Properties API Route
 * List and create properties
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { getProperties, createProperty } from "@/lib/properties/storage";
import { propertyCreateSchema } from "@/lib/validations/properties";

// GET: List all user properties
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as "active" | "sold" | "archived" | null;
    const search = searchParams.get("search") || undefined;

    const properties = await getProperties(session.user.id, {
      status: status || undefined,
      search,
    });

    return NextResponse.json({
      success: true,
      properties,
      count: properties.length,
    });
  } catch (error) {
    console.error("List properties error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: Create a new property
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validation = propertyCreateSchema.safeParse(body);

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

    // Create property with user_id - convert undefined to null for optional fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const propertyInsert: any = {
      ...propertyData,
      property_name: propertyData.property_name ?? null,
      notes: propertyData.notes ?? null,
      bedrooms: propertyData.bedrooms ?? null,
      property_classification: propertyData.property_classification ?? null,
      deposit_amount: propertyData.deposit_amount ?? null,
      loan_amount: propertyData.loan_amount ?? null,
      current_value: propertyData.current_value ?? null,
      current_loan_balance: propertyData.current_loan_balance ?? null,
      interest_rate: propertyData.interest_rate ?? null,
      loan_term_years: propertyData.loan_term_years ?? null,
      loan_type: propertyData.loan_type ?? null,
      weekly_rent: propertyData.weekly_rent ?? null,
      property_management_fee_percent: propertyData.property_management_fee_percent ?? null,
      sold_date: propertyData.sold_date ?? null,
      sale_price: propertyData.sale_price ?? null,
      sale_costs: propertyData.sale_costs ?? null,
      source_calculation_id: propertyData.source_calculation_id ?? null,
      user_id: session.user.id,
    };

    const property = await createProperty(propertyInsert);

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create property",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
