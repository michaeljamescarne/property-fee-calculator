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
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-xl font-bold">
          Property Fee Calculator
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            {t('home')}
          </Link>
          <Link href={`/${locale}/firb-calculator`} className="hover:text-primary transition-colors">
            {t('calculator')}
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
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
