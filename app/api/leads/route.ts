import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

// Validation schema for lead capture
const leadSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email address", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Create Supabase service role client for public lead capture
    // This bypasses RLS and ensures reliable inserts for public forms
    const supabase = createServiceRoleClient();

    // Insert lead
    const { data, error } = await supabase
      .from("leads")
      .insert({ email: email.toLowerCase().trim() })
      .select()
      .single();

    if (error) {
      // Handle duplicate email error gracefully
      if (error.code === "23505") {
        // Unique constraint violation - email already exists
        return NextResponse.json(
          { message: "Email already registered", success: true },
          { status: 200 }
        );
      }

      // Log the full error for debugging
      console.error("Error inserting lead:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error: "Failed to save email. Please try again.",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email saved successfully", success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in leads API:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// Optional: GET endpoint for admins to view leads (protected)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you'll need to implement this check based on your auth setup)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch leads
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching leads:", error);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    // Get total count
    const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });

    return NextResponse.json({
      data,
      pagination: {
        limit,
        offset,
        total: count || 0,
      },
    });
  } catch (error) {
    console.error("Unexpected error in leads GET API:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
