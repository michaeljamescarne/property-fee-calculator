'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import LoginModal from '@/components/auth/LoginModal';

export default function Navigation() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
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

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname === path;
  };

  const navLinks = [
    { href: '', label: t('home') },
    { href: '/firb-calculator', label: t('calculator') },
    { href: '/blog', label: t('blog') },
    { href: '/faq', label: t('faq') },
  ];

  return (
    <>
      <nav className="border-b border-blue-100/50 backdrop-blur-sm bg-white/95 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <Link href={`/${locale}`} className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            Property Costs
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`transition-colors font-medium ${
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded font-medium">
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
                  <Button variant="outline" size="sm" className="rounded font-medium">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/dashboard`}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="rounded font-medium"
                onClick={() => setShowLoginModal(true)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t('login')}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
