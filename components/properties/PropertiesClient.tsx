/**
 * Properties Client Component
 * Client-side properties list with filters and actions
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import type { Property } from "@/types/database";
import PropertyCard from "./PropertyCard";
import PropertiesEmptyState from "./PropertiesEmptyState";

interface PropertiesClientProps {
  locale: string;
}

export default function PropertiesClient({ locale }: PropertiesClientProps) {
  const t = useTranslations("Properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
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
      {/* Add Property Button */}
      <div className="flex justify-end">
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
          />
        ))}
      </div>
    </div>
  );
}
