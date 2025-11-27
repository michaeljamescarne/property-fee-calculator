/**
 * Bulk Import Benchmarks API Route
 * Handles CSV file upload and batch insert/update of benchmarks
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { AustralianState } from '@/lib/firb/constants';

interface CSVRow {
  state: string;
  suburb_name?: string;
  postcode?: string;
  gross_rental_yield?: string;
  net_rental_yield?: string;
  median_weekly_rent?: string;
  capital_growth_5yr?: string;
  capital_growth_10yr?: string;
  median_property_value?: string;
  data_source?: string;
  data_quality_score?: string;
  notes?: string;
  is_active?: string;
  last_updated?: string; // Optional date in CSV, will default to today if not provided
}

const AUSTRALIAN_STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];

function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  // Parse rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const row: CSVRow = {};
    headers.forEach((header, index) => {
      const value = values[index];
      if (value && value !== '') {
        row[header as keyof CSVRow] = value;
      }
    });
    rows.push(row);
  }

  return rows;
}

function validateRow(row: CSVRow, index: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // State is required and must be valid
  if (!row.state) {
    errors.push('State is required');
  } else if (!AUSTRALIAN_STATES.includes(row.state.toUpperCase() as AustralianState)) {
    errors.push(`Invalid state: ${row.state}. Must be one of: ${AUSTRALIAN_STATES.join(', ')}`);
  }

  // Validate rental yield (0-20%)
  if (row.gross_rental_yield) {
    const yieldValue = parseFloat(row.gross_rental_yield);
    if (isNaN(yieldValue) || yieldValue < 0 || yieldValue > 20) {
      errors.push(`Gross rental yield must be between 0 and 20%`);
    }
  }

  if (row.net_rental_yield) {
    const yieldValue = parseFloat(row.net_rental_yield);
    if (isNaN(yieldValue) || yieldValue < 0 || yieldValue > 20) {
      errors.push(`Net rental yield must be between 0 and 20%`);
    }
  }

  // Validate capital growth (0-15%)
  if (row.capital_growth_5yr) {
    const growthValue = parseFloat(row.capital_growth_5yr);
    if (isNaN(growthValue) || growthValue < 0 || growthValue > 15) {
      errors.push(`Capital growth (5yr) must be between 0 and 15%`);
    }
  }

  if (row.capital_growth_10yr) {
    const growthValue = parseFloat(row.capital_growth_10yr);
    if (isNaN(growthValue) || growthValue < 0 || growthValue > 15) {
      errors.push(`Capital growth (10yr) must be between 0 and 15%`);
    }
  }

  // Validate data quality score (1-10)
  if (row.data_quality_score) {
    const score = parseFloat(row.data_quality_score);
    if (isNaN(score) || score < 1 || score > 10) {
      errors.push(`Data quality score must be between 1 and 10`);
    }
  }

  // Validate is_active (true/false or 1/0)
  if (row.is_active && !['true', 'false', '1', '0', 'yes', 'no'].includes(row.is_active.toLowerCase())) {
    errors.push(`is_active must be true/false, 1/0, or yes/no`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function transformRow(row: CSVRow): {
  state: AustralianState;
  suburb_name: string | null;
  postcode: string | null;
  gross_rental_yield: number | null;
  net_rental_yield: number | null;
  median_weekly_rent: number | null;
  capital_growth_5yr: number | null;
  capital_growth_10yr: number | null;
  median_property_value: number | null;
  data_source: string | null;
  data_quality_score: number | null;
  notes: string | null;
  is_active: boolean;
  last_updated: string;
} {
  // Parse last_updated from CSV if provided, otherwise use today's date
  let lastUpdated: string;
  if (row.last_updated) {
    // Try to parse the date - could be in various formats
    const date = new Date(row.last_updated);
    if (isNaN(date.getTime())) {
      // Invalid date, use today
      lastUpdated = new Date().toISOString().split('T')[0];
    } else {
      lastUpdated = date.toISOString().split('T')[0];
    }
  } else {
    // Use current date
    lastUpdated = new Date().toISOString().split('T')[0];
  }

  return {
    state: row.state.toUpperCase() as AustralianState,
    suburb_name: row.suburb_name || null,
    postcode: row.postcode || null,
    gross_rental_yield: row.gross_rental_yield ? parseFloat(row.gross_rental_yield) : null,
    net_rental_yield: row.net_rental_yield ? parseFloat(row.net_rental_yield) : null,
    median_weekly_rent: row.median_weekly_rent ? parseFloat(row.median_weekly_rent) : null,
    capital_growth_5yr: row.capital_growth_5yr ? parseFloat(row.capital_growth_5yr) : null,
    capital_growth_10yr: row.capital_growth_10yr ? parseFloat(row.capital_growth_10yr) : null,
    median_property_value: row.median_property_value ? parseFloat(row.median_property_value) : null,
    data_source: row.data_source || null,
    data_quality_score: row.data_quality_score ? parseFloat(row.data_quality_score) : null,
    notes: row.notes || null,
    is_active: row.is_active ? ['true', '1', 'yes'].includes(row.is_active.toLowerCase()) : true,
    last_updated: lastUpdated, // Explicitly set last_updated to satisfy NOT NULL constraint
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const locale = 'en'; // Default locale for admin routes
    await requireAdmin(locale);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    // Validate all rows
    const validationResults = rows.map((row, index) => ({
      rowIndex: index + 2, // +2 because of header and 0-based index
      ...validateRow(row, index)
    }));

    const invalidRows = validationResults.filter(r => !r.valid);
    if (invalidRows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        invalidRows: invalidRows.map(r => ({
          row: r.rowIndex,
          errors: r.errors
        }))
      }, { status: 400 });
    }

    // Transform and insert/update rows
    const supabase = createServiceRoleClient();
    const transformedRows = rows.map(transformRow);

    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as Array<{ row: number; error: string }>
    };

    // Handle insert/update by checking existence first
    for (let i = 0; i < transformedRows.length; i++) {
      const row = transformedRows[i];
      try {
        // Build query to check if record exists
        // Match on state, suburb_name, and postcode
        // The unique index uses COALESCE(state, COALESCE(suburb_name, ''), COALESCE(postcode, ''))
        // So we need exact matches for the values
        let query = supabase
          .from('benchmark_data')
          .select('id')
          .eq('state', row.state);
        
        // Match suburb_name (NULL if not provided)
        if (row.suburb_name) {
          query = query.eq('suburb_name', row.suburb_name);
        } else {
          query = query.is('suburb_name', null);
        }
        
        // Match postcode (NULL if not provided)
        if (row.postcode) {
          query = query.eq('postcode', row.postcode);
        } else {
          query = query.is('postcode', null);
        }

        const { data: existing, error: checkError } = await query.maybeSingle();

        if (checkError) {
          results.errors.push({
            row: i + 2,
            error: `Failed to check existing record: ${checkError.message}`
          });
          continue;
        }

        if (existing) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('benchmark_data')
            .update(row)
            .eq('id', existing.id);

          if (updateError) {
            results.errors.push({
              row: i + 2,
              error: `Update failed: ${updateError.message}`
            });
          } else {
            results.updated++;
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('benchmark_data')
            .insert(row);

          if (insertError) {
            results.errors.push({
              row: i + 2,
              error: `Insert failed: ${insertError.message}`
            });
          } else {
            results.inserted++;
          }
        }
      } catch (err) {
        results.errors.push({
          row: i + 2,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        total: rows.length,
        inserted: results.inserted,
        updated: results.updated,
        errors: results.errors.length,
        errorDetails: results.errors
      }
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

