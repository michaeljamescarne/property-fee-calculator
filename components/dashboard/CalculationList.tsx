/**
 * Calculation List Component
 * Grid display of saved calculations with filters
 */

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Loader2 } from 'lucide-react';
import CalculationCard from './CalculationCard';
import EmptyState from './EmptyState';
import type { SavedCalculation } from '@/types/database';
import type { SortOption } from '@/lib/calculations/storage';

interface CalculationListProps {
  locale: string;
}

export default function CalculationList({ locale }: CalculationListProps) {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchCalculations();
  }, [sortBy, eligibilityFilter, showFavoritesOnly, searchTerm]);

  const fetchCalculations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        eligibility: eligibilityFilter,
        ...(showFavoritesOnly && { favorites: 'true' }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/calculations/list?${params}`);
      const data = await response.json();

      if (data.success) {
        setCalculations(data.calculations);
      }
    } catch (error) {
      console.error('Failed to fetch calculations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/calculations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCalculations(prev => prev.filter(calc => calc.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete calculation:', error);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/calculations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: isFavorite }),
      });

      if (response.ok) {
        setCalculations(prev =>
          prev.map(calc =>
            calc.id === id ? { ...calc, is_favorite: isFavorite } : calc
          )
        );
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  const handleRename = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/calculations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculation_name: name }),
      });

      if (response.ok) {
        setCalculations(prev =>
          prev.map(calc =>
            calc.id === id ? { ...calc, calculation_name: name } : calc
          )
        );
      }
    } catch (error) {
      console.error('Failed to rename calculation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (calculations.length === 0 && !searchTerm && !showFavoritesOnly && eligibilityFilter === 'all') {
    return <EmptyState locale={locale} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="value-desc">Highest Value</SelectItem>
              <SelectItem value="value-asc">Lowest Value</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Calculations</SelectItem>
              <SelectItem value="eligible">Eligible Only</SelectItem>
              <SelectItem value="review-required">Review Required</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            Favorites
          </Button>
        </div>
      </div>

      {/* Results */}
      {calculations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No calculations found matching your filters.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm('');
              setEligibilityFilter('all');
              setShowFavoritesOnly(false);
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {calculations.length} calculation{calculations.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calculation) => (
              <CalculationCard
                key={calculation.id}
                calculation={calculation}
                locale={locale}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onRename={handleRename}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

