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
  
  // Load messages directly
  const messages = await import(`../../messages/${locale}.json`);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages.default}>
          <Navigation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
