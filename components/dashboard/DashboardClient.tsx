/**
 * Dashboard Client Component
 * Handles client-side session refresh after login
 */

"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardClient() {
  const { refreshUser } = useAuth();

  // Refresh session on mount to ensure client state is synced
  useEffect(() => {
    // Small delay to ensure cookie is available
    const timer = setTimeout(() => {
      refreshUser();
    }, 100);

    return () => clearTimeout(timer);
  }, [refreshUser]);

  return null; // This component doesn't render anything
}
