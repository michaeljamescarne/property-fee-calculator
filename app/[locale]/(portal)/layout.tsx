/**
 * Portal Layout
 * Wrapper layout for all portal pages (dashboard, compare, properties, actions, account)
 * Conditionally renders PortalSidebar when user is authenticated
 */

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import PortalSidebar from "@/components/portal/PortalSidebar";

interface PortalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PortalLayout({
  children,
  params,
}: PortalLayoutProps) {
  const { locale } = await params;

  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/calculator`);
  }

  return (
    <>
      {/* Portal layout no longer needs its own sidebar wrapper - sidebar is in main layout */}
      {children}
    </>
  );
}

