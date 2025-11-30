/**
 * Dashboard Client Component
 * Handles client-side session refresh after login
 */

"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardClient() {
  const { refreshUser, isAuthenticated } = useAuth();

  // Refresh session on mount and when auth state changes
  useEffect(() => {
    // Refresh immediately and after a delay to ensure cookie is available
    refreshUser();

    const timer = setTimeout(() => {
      refreshUser();
    }, 500);

    return () => clearTimeout(timer);
  }, [refreshUser]);

  // Log auth state for debugging
  useEffect(() => {
    console.log("DashboardClient - Auth state:", { isAuthenticated });
  }, [isAuthenticated]);

  return null; // This component doesn't render anything
}
