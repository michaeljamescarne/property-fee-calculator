import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure locale is valid, fallback to 'en'
  const validLocale = locale && ['en', 'zh'].includes(locale) ? locale : 'en';
  
  // Load messages directly
  const messages = await import(`../../messages/${validLocale}.json`);

  return (
    <html lang={validLocale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages.default} locale={validLocale}>
          <Navigation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
