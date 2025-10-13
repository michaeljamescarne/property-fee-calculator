'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import LoginModal from '@/components/auth/LoginModal';

export default function Navigation() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const switchLocale = (newLocale: string) => {
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${newLocale}/${currentPath}`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = `/${locale}`;
  };

  return (
    <nav className="border-b border-blue-100/50 backdrop-blur-sm bg-white/95 sticky top-0 z-50 shadow-sm">
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
          <Link href={`/${locale}/faq`} className="text-foreground/70 hover:text-primary transition-colors font-medium">
            {t('faq')}
          </Link>
          
          {/* Language Selector */}
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

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg font-medium">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.calculations_count} calculation{user.calculations_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard`}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="rounded-lg font-medium"
              onClick={() => setShowLoginModal(true)}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </nav>
  );
}
