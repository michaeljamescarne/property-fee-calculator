/**
 * Property Card Component
 * Display property summary in card format
 */

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, MapPin } from "lucide-react";
import type { Property } from "@/types/database";

interface PropertyCardProps {
  property: Property;
  locale: string;
  onDelete: (id: string) => void;
}

export default function PropertyCard({ property, locale, onDelete }: PropertyCardProps) {
  const t = useTranslations("Properties");

  const handleDelete = () => {
    if (
      confirm(t("deleteConfirm", { name: property.property_name || property.property_address }))
    ) {
      onDelete(property.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {property.property_name || property.property_address}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {property.property_address}, {property.property_state}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("currentValue")}</span>
            <span className="font-semibold">
              ${((property.current_value || property.purchase_price) / 1000).toFixed(0)}k
            </span>
          </div>
          {property.is_rental && property.weekly_rent && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("weeklyRent")}</span>
              <span className="font-semibold">${property.weekly_rent.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("status")}</span>
            <span className="text-sm capitalize">{property.status}</span>
          </div>
        </div>
        <Link href={`/${locale}/properties/${property.id}`}>
          <Button className="w-full mt-4" variant="outline">
            {t("viewDetails")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
