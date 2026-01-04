/**
 * Property Transactions Helpers
 * Functions for transaction CRUD operations
 */

import type {
  PropertyTransaction,
  PropertyTransactionInsert,
  PropertyTransactionUpdate,
} from "@/types/database";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Get all transactions for a property
 */
export async function getPropertyTransactions(
  propertyId: string,
  filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
    type?: "income" | "expense" | "capital";
  }
): Promise<PropertyTransaction[]> {
  const supabase = createServiceRoleClient();

  let query = supabase
    .from("property_transactions")
    .select("*")
    .eq("property_id", propertyId)
    .is("deleted_at", null)
    .order("transaction_date", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.startDate) {
    query = query.gte("transaction_date", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("transaction_date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }

  return (data || []) as PropertyTransaction[];
}

/**
 * Get a single transaction by ID
 */
export async function getPropertyTransaction(
  transactionId: string,
  propertyId: string
): Promise<PropertyTransaction | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("property_transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("property_id", propertyId)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching transaction:", error);
    throw new Error("Failed to fetch transaction");
  }

  return data as PropertyTransaction;
}

/**
 * Create a new transaction
 */
export async function createPropertyTransaction(
  transaction: PropertyTransactionInsert
): Promise<PropertyTransaction> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("property_transactions")
    // @ts-expect-error - property_transactions Insert type is not properly recognized in Database type
    .insert(transaction)
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }

  return data as PropertyTransaction;
}

/**
 * Update a transaction
 */
export async function updatePropertyTransaction(
  transactionId: string,
  propertyId: string,
  updates: PropertyTransactionUpdate
): Promise<PropertyTransaction> {
  const supabase = createServiceRoleClient();

  // Verify transaction belongs to property
  const existing = await getPropertyTransaction(transactionId, propertyId);
  if (!existing) {
    throw new Error("Transaction not found");
  }

  const { data, error } = await supabase
    .from("property_transactions")
    // @ts-expect-error - property_transactions Update type is not properly recognized in Database type
    .update(updates)
    .eq("id", transactionId)
    .eq("property_id", propertyId)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }

  return data as PropertyTransaction;
}

/**
 * Delete a transaction (soft delete)
 */
export async function deletePropertyTransaction(
  transactionId: string,
  propertyId: string
): Promise<void> {
  const supabase = createServiceRoleClient();

  // Verify transaction belongs to property
  const existing = await getPropertyTransaction(transactionId, propertyId);
  if (!existing) {
    throw new Error("Transaction not found");
  }

  const { error } = await supabase
    .from("property_transactions")
    // @ts-expect-error - property_transactions Update type is not properly recognized in Database type
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", transactionId)
    .eq("property_id", propertyId);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
}

/**
 * Get transaction summary by category
 */
export interface TransactionSummary {
  category: string;
  total: number;
  count: number;
}

export async function getTransactionSummary(
  propertyId: string,
  startDate?: string,
  endDate?: string
): Promise<TransactionSummary[]> {
  const transactions = await getPropertyTransactions(propertyId, { startDate, endDate });

  const summaryMap = new Map<string, { total: number; count: number }>();

  transactions.forEach((tx) => {
    const existing = summaryMap.get(tx.category) || { total: 0, count: 0 };
    summaryMap.set(tx.category, {
      total: existing.total + (tx.type === "income" ? tx.amount : -tx.amount),
      count: existing.count + 1,
    });
  });

  return Array.from(summaryMap.entries()).map(([category, data]) => ({
    category,
    total: data.total,
    count: data.count,
  }));
}
