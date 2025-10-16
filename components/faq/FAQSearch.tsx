'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FAQSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function FAQSearch({ onSearch, placeholder = 'Search FAQs...' }: FAQSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 text-base rounded-xl border-2 border-border/50 focus:border-primary/50 transition-colors"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-muted rounded-lg"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
      </div>
      
      {searchTerm && searchTerm.length < 2 && (
        <p className="text-sm text-muted-foreground mt-2 ml-1">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}





