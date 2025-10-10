'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t('company.name')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('company.description')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t('quickLinks.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('quickLinks.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/calculator`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('quickLinks.calculator')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#features`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('quickLinks.features')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#how-it-works`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('quickLinks.howItWorks')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t('resources.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://firb.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('resources.firb')}
                </a>
              </li>
              <li>
                <a
                  href="https://www.ato.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('resources.ato')}
                </a>
              </li>
              <li>
                <a
                  href="https://www.homeaffairs.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('resources.homeAffairs')}
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('resources.legislation')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t('contact.title')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:info@propertyfeecalculator.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('contact.email')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <a
                  href="tel:+61123456789"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('contact.phone')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  {t('contact.address')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} {t('company.name')}. {t('company.rights')}
          </p>
          <div className="flex gap-6">
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-primary transition-colors"
            >
              {t('legal.privacy')}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="hover:text-primary transition-colors"
            >
              {t('legal.terms')}
            </Link>
            <Link
              href={`/${locale}/disclaimer`}
              className="hover:text-primary transition-colors"
            >
              {t('legal.disclaimer')}
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            {t('disclaimer.text')}
          </p>
        </div>
      </div>
    </footer>
  );
}

