/**
 * Dashboard Layout
 * Layout wrapper for dashboard pages
 */

// Removed unused Separator import

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
