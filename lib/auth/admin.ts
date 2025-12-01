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

  const supabase = await createClient();

  // Get user profile with role
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, email, role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    return null;
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

  // Get user profile with role
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, email, role")
    .eq("id", session.user.id)
    .single();

  // If no profile or error, redirect
  if (error || !profile) {
    console.error("Admin check failed - no profile:", {
      error: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
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
