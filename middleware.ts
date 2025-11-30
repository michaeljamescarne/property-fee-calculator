import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "zh"],
  defaultLocale: "en",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 301 redirects for old /firb-calculator URLs to new /calculator URLs
  if (pathname === "/en/firb-calculator" || pathname.startsWith("/en/firb-calculator/")) {
    const newPath = pathname.replace("/firb-calculator", "/calculator");
    return NextResponse.redirect(new URL(newPath, request.url), { status: 301 });
  }

  if (pathname === "/zh/firb-calculator" || pathname.startsWith("/zh/firb-calculator/")) {
    const newPath = pathname.replace("/firb-calculator", "/calculator");
    return NextResponse.redirect(new URL(newPath, request.url), { status: 301 });
  }

  // Handle root-level old URLs (without locale prefix)
  if (pathname === "/firb-calculator" || pathname.startsWith("/firb-calculator/")) {
    const newPath = pathname.replace("/firb-calculator", "/en/calculator");
    return NextResponse.redirect(new URL(newPath, request.url), { status: 301 });
  }

  // Continue with next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
