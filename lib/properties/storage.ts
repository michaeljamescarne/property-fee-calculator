/**
 * Property Storage Helpers
 * Functions for property CRUD operations
 */

import type { Property, PropertyInsert, PropertyUpdate } from "@/types/database";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Get all properties for a user
 */
export async function getProperties(
  userId: string,
  filters?: {
    status?: "active" | "sold" | "archived";
    search?: string;
  }
): Promise<Property[]> {
  const supabase = createServiceRoleClient();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `property_name.ilike.%${filters.search}%,property_address.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }

  return (data || []) as Property[];
}

/**
 * Get a single property by ID
 */
export async function getProperty(propertyId: string, userId: string): Promise<Property | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching property:", error);
    throw new Error("Failed to fetch property");
  }

  return data as Property;
}

/**
 * Create a new property
 */
export async function createProperty(property: PropertyInsert): Promise<Property> {
  const supabase = createServiceRoleClient();

  // @ts-expect-error - properties Insert type is not properly recognized in Database type
  const { data, error } = await supabase.from("properties").insert(property).select().single();

  if (error) {
    console.error("Error creating property:", error);
    throw new Error("Failed to create property");
  }

  return data as Property;
}

/**
 * Update a property
 */
export async function updateProperty(
  propertyId: string,
  userId: string,
  updates: PropertyUpdate
): Promise<Property> {
  const supabase = createServiceRoleClient();

  // Verify property belongs to user
  const existing = await getProperty(propertyId, userId);
  if (!existing) {
    throw new Error("Property not found");
  }

  const { data, error } = await supabase
    .from("properties")
    // @ts-expect-error - properties Update type is not properly recognized in Database type
    .update(updates)
    .eq("id", propertyId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating property:", error);
    throw new Error("Failed to update property");
  }

  return data as Property;
}

/**
 * Soft delete a property
 */
export async function deleteProperty(propertyId: string, userId: string): Promise<void> {
  const supabase = createServiceRoleClient();

  // Verify property belongs to user
  const existing = await getProperty(propertyId, userId);
  if (!existing) {
    throw new Error("Property not found");
  }

  const { error } = await supabase
    .from("properties")
    // @ts-expect-error - properties Update type is not properly recognized in Database type
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", propertyId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting property:", error);
    throw new Error("Failed to delete property");
  }
}

/**
 * Get property summary statistics
 */
export interface PropertySummary {
  totalProperties: number;
  totalValue: number;
  totalEquity: number;
  averageYield: number;
}

export async function getPropertySummary(userId: string): Promise<PropertySummary> {
  const properties = await getProperties(userId, { status: "active" });

  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + (p.current_value || p.purchase_price), 0);
  const totalEquity = properties.reduce(
    (sum, p) => sum + ((p.current_value || p.purchase_price) - (p.current_loan_balance || 0)),
    0
  );

  // Calculate average yield (for rental properties)
  const rentalProperties = properties.filter(
    (p) => p.is_rental && p.weekly_rent && p.current_value
  );
  const totalYield = rentalProperties.reduce((sum, p) => {
    const annualRent = (p.weekly_rent || 0) * 52;
    const value = p.current_value || p.purchase_price;
    return sum + (annualRent / value) * 100;
  }, 0);
  const averageYield = rentalProperties.length > 0 ? totalYield / rentalProperties.length : 0;

  return {
    totalProperties,
    totalValue,
    totalEquity,
    averageYield,
  };
}
