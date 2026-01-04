/**
 * Transactions List Component
 * Display and manage transactions for a property
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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { PropertyTransaction } from "@/types/database";
import TransactionForm from "./TransactionForm";

interface TransactionsListProps {
  propertyId: string;
  locale: string;
}

export default function TransactionsList({ propertyId, locale }: TransactionsListProps) {
  const t = useTranslations("Properties.detail.transactions");
  const [transactions, setTransactions] = useState<PropertyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<PropertyTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/properties/${propertyId}/transactions`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleDelete = async (transactionId: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/transactions/${transactionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await fetchTransactions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete transaction");
    }
  };

  const handleEdit = (transaction: PropertyTransaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
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
              {t("addTransaction")}
            </Button>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? t("editTransaction") : t("addTransaction")}
                </DialogTitle>
                <DialogDescription>
                  {editingTransaction ? t("editDescription") : t("addDescription")}
                </DialogDescription>
              </DialogHeader>
              <TransactionForm
                propertyId={propertyId}
                transaction={editingTransaction}
                onSuccess={handleFormSuccess}
                onCancel={() => handleDialogClose(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
            <Button onClick={handleAdd} className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              {t("addTransaction")}
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.date")}</TableHead>
                  <TableHead>{t("table.category")}</TableHead>
                  <TableHead>{t("table.description")}</TableHead>
                  <TableHead>{t("table.type")}</TableHead>
                  <TableHead className="text-right">{t("table.amount")}</TableHead>
                  <TableHead className="text-center">{t("table.taxDeductible")}</TableHead>
                  <TableHead className="text-center">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transaction_date, locale)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`categories.${transaction.category}`)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "income"
                            ? "default"
                            : transaction.type === "expense"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {t(`types.${transaction.type}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount, locale)}
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.is_tax_deductible ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {t("table.yes")}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">{t("table.no")}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
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

