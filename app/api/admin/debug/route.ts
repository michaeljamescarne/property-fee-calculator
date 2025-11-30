/**
 * Admin Debug API
 * Diagnostic endpoint to check admin access issues
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const session = await getSession();
    const diagnostics: Record<string, unknown> = {
      hasSession: !!session,
      timestamp: new Date().toISOString(),
    };

    if (!session) {
      return NextResponse.json({
        ...diagnostics,
        error: "No session found",
        message: "You are not logged in. Please log in first.",
      });
    }

    diagnostics.sessionUser = {
      id: session.user.id,
      email: session.user.email,
      subscription_status: session.user.subscription_status,
    };

    // Try to get user profile from Supabase
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, email, role, created_at, updated_at")
      .eq("id", session.user.id)
      .single();

    diagnostics.profileQuery = {
      hasProfile: !!profile,
      error: profileError?.message || null,
      profile: profile || null,
    };

    // Check if role column exists (RPC might not exist, so we'll use schema query instead)
    const columnCheck = null; // RPC not available, using schema query below

    // Alternative: Check column via information_schema
    const { data: schemaCheck } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", "user_profiles")
      .eq("column_name", "role")
      .single();

    diagnostics.roleColumn = {
      exists: !!schemaCheck,
      rpcResult: columnCheck,
      schemaCheck: schemaCheck || null,
    };

    // Check all user_profiles columns
    const { data: allColumns } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_schema", "public")
      .eq("table_name", "user_profiles");

    diagnostics.tableSchema = {
      columns: allColumns || [],
    };

    // Check if user is admin
    const isAdmin = profile?.role === "admin";
    diagnostics.isAdmin = isAdmin;
    diagnostics.adminCheck = {
      role: profile?.role || "not set",
      isAdmin,
      message: isAdmin
        ? "You have admin access"
        : `Role is "${profile?.role || "not set"}", expected "admin"`,
    };

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Diagnostic failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
