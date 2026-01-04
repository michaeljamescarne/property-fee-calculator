/**
 * Portal Sidebar Component
 * Vertical sidebar navigation for authenticated portal pages
 */

"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Calculator,
  GitCompare,
  Building2,
  Zap,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export default function PortalSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Portal");
  const { isAuthenticated, user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      href: `/${locale}/dashboard`,
      label: t("dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/calculator`,
      label: t("calculate"),
      icon: Calculator,
    },
    {
      href: `/${locale}/compare`,
      label: t("compare"),
      icon: GitCompare,
    },
    {
      href: `/${locale}/properties`,
      label: t("properties"),
      icon: Building2,
      disabled: false,
    },
    {
      href: `/${locale}/actions`,
      label: t("actions"),
      icon: Zap,
      disabled: true,
    },
    {
      href: `/${locale}/account`,
      label: t("account"),
      icon: User,
      disabled: false,
    },
  ];

  const isActive = (href: string): boolean => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = `/${locale}`;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] border-r border-gray-200 bg-white hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-3">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Property Costs" width={32} height={32} />
            <span className="text-base font-semibold text-gray-900">Property Costs</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-400 whitespace-nowrap",
                    "cursor-not-allowed"
                  )}
                  aria-disabled="true"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            }

            // Special handling for Account section - show user email and logout
            if (item.href === `/${locale}/account`) {
              return (
                <div key={item.href} className="space-y-1">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                  {isAuthenticated && user && (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">Logout</span>
                    </button>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
