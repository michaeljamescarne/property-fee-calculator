/**
 * Calculation Card Component
 * Displays a saved calculation summary
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  MoreVertical,
  Star,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import type { SavedCalculation } from '@/types/database';
import { getCalculationSummary } from '@/lib/calculations/storage';

interface CalculationCardProps {
  calculation: SavedCalculation;
  locale: string;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onRename: (id: string, name: string) => void;
}

export default function CalculationCard({
  calculation,
  locale,
  onDelete,
  onToggleFavorite,
  onRename,
}: CalculationCardProps) {
  const summary = getCalculationSummary(calculation);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this calculation?')) {
      setIsDeleting(true);
      await onDelete(calculation.id);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(calculation.id, !summary.isFavorite);
  };

  const handleRename = () => {
    const newName = prompt('Enter a new name for this calculation:', summary.name);
    if (newName && newName.trim()) {
      onRename(calculation.id, newName.trim());
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      newDwelling: 'New Dwelling',
      established: 'Established',
      vacantLand: 'Vacant Land',
      commercial: 'Commercial',
    };
    return labels[type] || type;
  };

  const getEligibilityVariant = (status: string) => {
    return status === 'Eligible' ? 'default' : 'secondary';
  };

  return (
    <Card className={`group hover:shadow-lg transition-all ${isDeleting ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {summary.name}
              </h3>
              {summary.isFavorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{summary.address}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleFavorite}>
                <Star className={`mr-2 h-4 w-4 ${summary.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                {summary.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRename}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Property Value</p>
              <p className="font-semibold truncate">{formatCurrency(summary.value)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="font-semibold text-sm truncate">{getPropertyTypeLabel(summary.propertyType)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge variant={getEligibilityVariant(summary.eligibility)}>
            {summary.eligibility}
          </Badge>
          {summary.isFirstHome && (
            <Badge variant="outline" className="text-xs">
              First Home
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {summary.propertyState}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDate(summary.createdAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/${locale}/firb-calculator?load=${calculation.id}`} className="w-full">
          <Button variant="outline" className="w-full" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}




