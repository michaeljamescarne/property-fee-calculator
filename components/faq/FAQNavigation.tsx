'use client';

import { useState, useEffect } from 'react';
import { FileText, UserCheck, DollarSign, AlertTriangle, Home, HelpCircle } from 'lucide-react';
import type { FAQCategory } from '@/types/faq';

interface FAQNavigationProps {
  categories: FAQCategory[];
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

const iconMap = {
  FileText,
  UserCheck,
  DollarSign,
  AlertTriangle,
  Home,
  HelpCircle,
};

export default function FAQNavigation({ categories, activeCategory, onCategoryClick }: FAQNavigationProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
    
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={`bg-white border-y border-border/40 transition-all duration-200 ${
        isSticky ? 'sticky top-0 z-40 shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] || HelpCircle;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleClick(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
                <span className="ml-1 text-xs opacity-70">
                  ({category.questions.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}





