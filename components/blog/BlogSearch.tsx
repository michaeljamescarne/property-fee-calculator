"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function BlogSearch({
  onSearch,
  placeholder = "Search blog posts...",
}: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 text-base rounded border-2 border-gray-200 focus:border-blue-600 transition-colors"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        )}
      </div>

      {searchTerm && searchTerm.length < 2 && (
        <p className="text-sm text-gray-500 mt-2 ml-1">Type at least 2 characters to search</p>
      )}
    </div>
  );
}
