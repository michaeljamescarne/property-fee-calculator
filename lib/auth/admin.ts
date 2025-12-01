/**
 * Admin Utilities
 * Functions to check admin role and protect admin routes
 */

import { getSession } from "./session";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "user";
}

/**
 * Check if current user is an admin
 * Returns admin user info or null
 */
export async function isAdmin(): Promise<AdminUser | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  // Use service role client to bypass RLS (RLS uses auth.uid() which doesn't work with custom JWT)
  const supabase = createServiceRoleClient();

  // Try to get user profile by ID first
  const { data: profileById, error: idError } = await supabase
    .from("user_profiles")
    .select("id, email, role")
    .eq("id", session.user.id)
    .single();

  // If profile not found by ID, try by email (handles case where user ID changed)
  let profile = profileById;
  if (idError || !profile) {
    const { data: profileByEmail, error: emailError } = await supabase
      .from("user_profiles")
      .select("id, email, role")
      .eq("email", session.user.email)
      .single();

    if (emailError || !profileByEmail) {
      return null;
    }

    profile = profileByEmail;
  }

  const profileData = profile as { id: string; email: string; role: string } | null;
  if (!profileData || profileData.role !== "admin") {
    return null;
  }

  return {
    id: profileData.id,
    email: profileData.email,
    role: profileData.role as "admin" | "user",
  };
}

/**
 * Require admin access - redirects if not admin
 * Use in server components and API routes
 */
export async function requireAdmin(locale: string = "en"): Promise<AdminUser> {
  const session = await getSession();

  console.log("requireAdmin - Session check:", {
    hasSession: !!session,
    userId: session?.user?.id,
  });

  // First check if user is logged in
  if (!session) {
    console.log("requireAdmin - No session, redirecting to calculator");
    redirect(`/${locale}/calculator?login=true`);
  }

  // Use service role client to bypass RLS (RLS uses auth.uid() which doesn't work with custom JWT)
  const supabase = createServiceRoleClient();

  // Try to get user profile by ID first (try with role, fallback without if column doesn't exist)
  let { data: profileById, error: idError } = await supabase
    .from("user_profiles")
    .select("id, email, role")
    .eq("id", session.user.id)
    .single();

  // If error is "column doesn't exist", try without role column
  if (idError?.code === "42703" && idError?.message?.includes("role")) {
    console.log("Admin check - Role column doesn't exist, trying without role column");
    const { data: profileWithoutRole, error: idErrorNoRole } = await supabase
      .from("user_profiles")
      .select("id, email")
      .eq("id", session.user.id)
      .single();

    if (!idErrorNoRole && profileWithoutRole) {
      profileById = {
        id: profileWithoutRole.id,
        email: profileWithoutRole.email,
        role: null,
      } as typeof profileById;
      idError = null;
    }
  }

  // If profile not found by ID, try by email (handles case where user ID changed)
  let profile = profileById;
  if (idError || !profile) {
    console.log("Admin check - Profile not found by ID, trying email lookup:", {
      userId: session.user.id,
      userEmail: session.user.email,
    });

    let { data: profileByEmail, error: emailError } = await supabase
      .from("user_profiles")
      .select("id, email, role")
      .eq("email", session.user.email)
      .single();

    // If error is "column doesn't exist", try without role column
    if (emailError?.code === "42703" && emailError?.message?.includes("role")) {
      console.log(
        "Admin check - Role column doesn't exist in email lookup, trying without role column"
      );
      const { data: profileWithoutRole, error: emailErrorNoRole } = await supabase
        .from("user_profiles")
        .select("id, email")
        .eq("email", session.user.email)
        .single();

      if (!emailErrorNoRole && profileWithoutRole) {
        profileByEmail = { ...profileWithoutRole, role: null } as typeof profileByEmail;
        emailError = null;
      }
    }

    if (emailError || !profileByEmail) {
      console.error("Admin check failed - no profile found by ID or email:", {
        idError: idError?.message,
        idCode: idError?.code,
        emailError: emailError?.message,
        emailCode: emailError?.code,
        userId: session.user.id,
        userEmail: session.user.email,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      });
      redirect(`/${locale}/dashboard`);
    }

    profile = profileByEmail;
  }

  // At this point, profile should not be null (we've checked above)
  if (!profile) {
    console.error("Admin check failed - profile is null after lookup:", {
      userId: session.user.id,
      userEmail: session.user.email,
    });
    redirect(`/${locale}/dashboard`);
  }

  const profileData = profile as { id: string; email: string; role: string | null };

  console.log("requireAdmin - Profile data:", {
    email: profileData.email,
    role: profileData.role,
    isAdmin: profileData.role === "admin",
  });

  // Check if role column exists and is set
  if (!profileData.role) {
    console.error("Admin check failed - role column is null or missing:", {
      userId: session.user.id,
      userEmail: session.user.email,
      profileData,
    });
    redirect(`/${locale}/dashboard`);
  }

  // Check if admin
  if (profileData.role !== "admin") {
    console.log("Admin check failed - user is not admin:", {
      userId: session.user.id,
      userEmail: session.user.email,
      role: profileData.role,
      expectedRole: "admin",
    });
    redirect(`/${locale}/dashboard`);
  }

  console.log("requireAdmin - Admin access granted for:", profileData.email);
  return {
    id: profileData.id,
    email: profileData.email,
    role: profileData.role as "admin" | "user",
  };
}
