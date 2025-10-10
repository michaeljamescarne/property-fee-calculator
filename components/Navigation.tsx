'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function Navigation() {
  const t = useTranslations('Nav');
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${newLocale}/${currentPath}`;
  };

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Property Fee Calculator
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link href={`/${locale}`} className="text-foreground/70 hover:text-primary transition-colors font-medium">
            {t('home')}
          </Link>
          <Link href={`/${locale}/firb-calculator`} className="text-foreground/70 hover:text-primary transition-colors font-medium">
            {t('calculator')}
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg font-medium">
                <Globe className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'English' : '中文'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => switchLocale('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('zh')}>
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
