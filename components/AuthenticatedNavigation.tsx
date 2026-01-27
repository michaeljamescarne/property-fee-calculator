/**
 * Authenticated Navigation Wrapper
 * Client component that conditionally renders Navigation only when user is not authenticated
 */

"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Navigation from "./Navigation";

export default function AuthenticatedNavigation() {
  const { isAuthenticated } = useAuth();

  // Hide navigation when authenticated
  if (isAuthenticated) {
    return null;
  }

  return <Navigation />;
}


