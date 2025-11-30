/**
 * Admin Benchmarks Page
 * CRUD interface for managing all benchmark data (market, cost, and macro)
 */

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/admin";
import BenchmarksAdminClient from "@/components/admin/BenchmarksAdminClient";
import CostBenchmarksAdminClient from "@/components/admin/CostBenchmarksAdminClient";
import MacroBenchmarksAdminClient from "@/components/admin/MacroBenchmarksAdminClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminBenchmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Admin");

  // Require admin access
  await requireAdmin(locale);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          {t("benchmarks.title") || "Benchmark Data Management"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("benchmarks.description") ||
            "Manage all benchmark data: market benchmarks, cost benchmarks, and macro benchmarks"}
        </p>
      </div>

      {/* Tabs for different benchmark types */}
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="market">Market Benchmarks</TabsTrigger>
          <TabsTrigger value="cost">Cost Benchmarks</TabsTrigger>
          <TabsTrigger value="macro">Macro Benchmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="market" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Market Benchmarks</h2>
            <p className="text-muted-foreground">
              Manage rental yield and capital growth benchmarks by state and suburb
            </p>
            <BenchmarksAdminClient locale={locale} />
          </div>
        </TabsContent>
        <TabsContent value="cost" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cost Benchmarks</h2>
            <p className="text-muted-foreground">
              Manage cost benchmarks by state and property type (council rates, insurance,
              maintenance, etc.)
            </p>
            <CostBenchmarksAdminClient locale={locale} />
          </div>
        </TabsContent>
        <TabsContent value="macro" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Macro Benchmarks</h2>
            <p className="text-muted-foreground">
              Manage global benchmarks for investment comparisons, tax rates, and financing rates
            </p>
            <MacroBenchmarksAdminClient locale={locale} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
