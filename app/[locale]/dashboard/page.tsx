/**
 * Dashboard Page
 * User dashboard showing saved calculations
 */

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Calculator, Plus } from 'lucide-react';
import Link from 'next/link';
import CalculationList from '@/components/dashboard/CalculationList';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Check if user is authenticated
  const session = await getSession();
  
  if (!session) {
    redirect(`/${locale}/firb-calculator`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Calculations</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {session.user.email}
          </p>
        </div>
        
        <Link href={`/${locale}/firb-calculator`}>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Calculation
          </Button>
        </Link>
      </div>

      {/* Calculations List */}
      <CalculationList locale={locale} />
    </div>
  );
}

