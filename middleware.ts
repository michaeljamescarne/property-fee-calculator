import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en'
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // - … static files like favicon.ico, robots.txt, etc.
    '/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'
  ]
};

