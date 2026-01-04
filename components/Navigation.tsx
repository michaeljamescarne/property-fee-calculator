"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginModal from "@/components/auth/LoginModal";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure dropdown menus only render on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const switchLocale = (newLocale: string) => {
    const currentPath = window.location.pathname.split("/").slice(2).join("/");
    window.location.href = `/${newLocale}/${currentPath}`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = `/${locale}`;
  };

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname === path;
  };

  // Detect if we're on a portal page
  const isPortalPage =
    pathname?.includes("/dashboard") ||
    pathname?.includes("/compare") ||
    pathname?.includes("/properties") ||
    pathname?.includes("/actions") ||
    pathname?.includes("/account");

  const navLinks = [
    { href: "", label: t("home") },
    { href: "/calculator", label: t("calculator") },
    { href: "/blog", label: t("blog") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <>
      <nav
        className={cn(
          "border-b border-blue-100/50 backdrop-blur-sm bg-white/95 sticky top-0 z-50 shadow-sm",
          // Make nav relative when authenticated so logo can be absolutely positioned
          isAuthenticated && "lg:relative"
        )}
        suppressHydrationWarning
      >
        <div
          className={cn(
            "container mx-auto px-4 py-5 flex items-center",
            // When authenticated, justify-end to right-align nav items; otherwise justify-between
            isAuthenticated ? "lg:justify-end lg:pr-4" : "justify-between",
            // Add left padding when authenticated to account for sidebar (200px)
            isAuthenticated && "lg:pl-[200px]"
          )}
        >
          <Link
            href={`/${locale}`}
            className={cn(
              "flex items-center gap-2.5 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors",
              // When authenticated, position logo to align with sidebar left edge
              isAuthenticated && "lg:absolute lg:left-0 lg:pl-3"
            )}
          >
            <Image
              src="/logo.svg"
              alt="Property Costs Logo"
              width={32}
              height={32}
              className="flex-shrink-0"
              priority
            />
            <span className="hidden sm:inline">Property Costs</span>
            <span className="sm:hidden">PC</span>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`transition-colors font-medium ${
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Selector */}
            {isMounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded font-medium">
                    <Globe className="h-4 w-4 mr-2" />
                    {locale === "en" ? "English" : "中文"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => switchLocale("en")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale("zh")}>中文</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!isMounted && (
              <Button variant="outline" size="sm" className="rounded font-medium" disabled>
                <Globe className="h-4 w-4 mr-2" />
                {locale === "en" ? "English" : "中文"}
              </Button>
            )}

            {/* Auth Section - Hide on portal pages */}
            {!isPortalPage && (
              <>
                {isAuthenticated && user ? (
                  isMounted ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded font-medium">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          {user.email}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/dashboard`}>
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            {t("dashboard")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("logout")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="outline" size="sm" className="rounded font-medium" disabled>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {user.email}
                    </Button>
                  )
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded font-medium"
                    onClick={() => setShowLoginModal(true)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("login")}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-100/50 bg-white/95">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-md transition-colors font-medium ${
                      isActive(link.href)
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-foreground/70 hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Language Selector */}
              <div className="pt-2 border-t border-border/40">
                {isMounted ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start rounded font-medium"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {locale === "en" ? "English" : "中文"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      <DropdownMenuItem onClick={() => switchLocale("en")}>
                        English
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => switchLocale("zh")}>中文</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded font-medium"
                    disabled
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {locale === "en" ? "English" : "中文"}
                  </Button>
                )}
              </div>

              {/* Auth Section - Hide on portal pages */}
              {!isPortalPage && (
                <div className="pt-2 border-t border-border/40">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-3 py-2 mb-2">
                        <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href={`/${locale}/dashboard`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center py-2 px-3 rounded-md text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {t("dashboard")}
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full py-2 px-3 rounded-md text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("logout")}
                      </button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full rounded font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowLoginModal(true);
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      {t("login")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
