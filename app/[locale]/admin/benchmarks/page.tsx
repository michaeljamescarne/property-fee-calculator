/**
 * Admin Benchmarks Page
 * CRUD interface for managing benchmark data
 */

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/admin";
import BenchmarksAdminClient from "@/components/admin/BenchmarksAdminClient";

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
            "Manage rental yield and capital growth benchmarks by state and suburb"}
        </p>
      </div>

      {/* Benchmarks Admin Client Component */}
      <BenchmarksAdminClient locale={locale} />
    </div>
  );
}
