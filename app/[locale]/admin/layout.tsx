/**
 * Admin Layout
 * Layout wrapper for admin pages with navigation
 */

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Home, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Require admin access
  await requireAdmin(locale);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </div>
          <Link href={`/${locale}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Admin Content */}
        {children}
      </div>
    </div>
  );
}

