/**
 * Main Content Wrapper
 * Conditionally applies padding when sidebar is visible
 */

"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isAuthenticated } = useAuth();

  return (
    <main
      id="main-content"
      className={cn(
        "flex-1",
        // Add padding when authenticated to account for sidebar (160px width)
        isAuthenticated && "lg:pl-[160px]"
      )}
    >
      {children}
    </main>
  );
}

