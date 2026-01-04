/**
 * Value History List Component
 * Display and manage property value history
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { PropertyValueHistory } from "@/types/database";
import ValueHistoryForm from "./ValueHistoryForm";

interface ValueHistoryListProps {
  propertyId: string;
  locale: string;
}

export default function ValueHistoryList({ propertyId, locale }: ValueHistoryListProps) {
  const t = useTranslations("Properties.detail.values");
  const [values, setValues] = useState<PropertyValueHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchValues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/properties/${propertyId}/values`);
      if (!response.ok) {
        throw new Error("Failed to fetch value history");
      }
      const data = await response.json();
      setValues(data.values || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleDelete = async (valueId: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}/values/${valueId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete value history entry");
      }

      await fetchValues();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete value history entry");
    }
  };

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    fetchValues();
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <Button onClick={handleAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t("addValue")}
            </Button>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("addValue")}</DialogTitle>
                <DialogDescription>{t("addDescription")}</DialogDescription>
              </DialogHeader>
              <ValueHistoryForm
                propertyId={propertyId}
                onSuccess={handleFormSuccess}
                onCancel={() => handleDialogClose(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {values.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
            <Button onClick={handleAdd} className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              {t("addValue")}
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.date")}</TableHead>
                  <TableHead>{t("table.value")}</TableHead>
                  <TableHead>{t("table.type")}</TableHead>
                  <TableHead>{t("table.source")}</TableHead>
                  <TableHead>{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {values.map((value) => (
                  <TableRow key={value.id}>
                    <TableCell>{formatDate(value.valuation_date, locale)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(value.value, locale)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`types.${value.valuation_type}`)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {value.valuation_source || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(value.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

