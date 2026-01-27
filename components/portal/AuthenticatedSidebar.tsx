/**
 * Authenticated Sidebar Wrapper
 * Client component that conditionally renders sidebar when user is authenticated
 */

"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import PortalSidebar from "./PortalSidebar";

export default function AuthenticatedSidebar() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <PortalSidebar />;
}


