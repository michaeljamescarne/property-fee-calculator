"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

interface Category {
  name: string;
  count: number;
}

interface BlogNavigationProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (category: string) => void;
}

export default function BlogNavigation({
  categories,
  activeCategory,
  onCategoryClick,
}: BlogNavigationProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (categoryName: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName === activeCategory ? "" : categoryName);
    }
  };

  return (
    <nav
      className={`bg-white border-y border-gray-200 transition-all duration-200 ${
        isSticky ? "sticky top-0 z-40 shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4">
          {/* All Posts button */}
          <button
            onClick={() => handleClick("")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded whitespace-nowrap transition-all font-medium text-sm ${
              !activeCategory
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>All Posts</span>
          </button>

          {/* Category buttons */}
          {categories.map((category) => {
            const isActive = activeCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() => handleClick(category.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded whitespace-nowrap transition-all font-medium text-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <span>{category.name}</span>
                <span className="ml-1 text-xs opacity-70">({category.count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
