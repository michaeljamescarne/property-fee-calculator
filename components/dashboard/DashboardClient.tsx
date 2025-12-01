/**
 * Dashboard Client Component
 * Handles client-side session refresh after login
 */

"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardClient() {
  const { refreshUser, isAuthenticated } = useAuth();
  const hasRefreshed = useRef(false);

  // Refresh session once on mount (only if not already authenticated)
  useEffect(() => {
    // Only refresh if not authenticated and haven't refreshed yet
    if (!isAuthenticated && !hasRefreshed.current) {
      refreshUser();
      hasRefreshed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated, not refreshUser

  return null; // This component doesn't render anything
}
