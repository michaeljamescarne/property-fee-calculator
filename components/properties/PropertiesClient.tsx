/**
 * Properties Client Component
 * Client-side properties list with filters and actions
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, GitCompare } from "lucide-react";
import type { Property } from "@/types/database";
import PropertyCard from "./PropertyCard";
import PropertiesEmptyState from "./PropertiesEmptyState";

interface PropertiesClientProps {
  locale: string;
}

export default function PropertiesClient({ locale }: PropertiesClientProps) {
  const t = useTranslations("Properties");
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/properties");
      const data = await response.json();

      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties((prev) => prev.filter((prop) => prop.id !== id));
        setSelectedProperties((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProperties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCompare = () => {
    if (selectedProperties.size >= 2) {
      const ids = Array.from(selectedProperties);
      router.push(`/${locale}/properties/compare?ids=${ids.join(",")}`);
    }
  };

  const handleClearSelection = () => {
    setSelectedProperties(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return <PropertiesEmptyState locale={locale} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        {selectedProperties.size > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedProperties.size} selected
            </span>
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              Clear Selection
            </Button>
            {selectedProperties.size >= 2 && (
              <Button size="sm" onClick={handleCompare}>
                <GitCompare className="mr-2 h-4 w-4" />
                Compare Properties
              </Button>
            )}
            {selectedProperties.size === 1 && (
              <span className="text-sm text-muted-foreground">
                Select at least 2 properties to compare
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitCompare className="h-4 w-4" />
            <span>Click on property cards to select and compare</span>
          </div>
        )}
        <Link href={`/${locale}/properties/new`}>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            {t("addProperty")}
          </Button>
        </Link>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            locale={locale}
            onDelete={handleDelete}
            isSelected={selectedProperties.has(property.id)}
            onToggleSelect={() => handleToggleSelect(property.id)}
            selectionMode={selectedProperties.size > 0}
          />
        ))}
      </div>
    </div>
  );
}
