/**
 * Admin Benchmarks API Route
 * CRUD operations for benchmark data (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { AustralianState } from '@/lib/firb/constants';

export interface BenchmarkInput {
  state: AustralianState;
  suburb_name?: string | null;
  postcode?: string | null;
  gross_rental_yield?: number | null;
  net_rental_yield?: number | null;
  median_weekly_rent?: number | null;
  capital_growth_5yr?: number | null;
  capital_growth_10yr?: number | null;
  median_property_value?: number | null;
  data_source?: string | null;
  data_quality_score?: number | null;
  notes?: string | null;
  is_active?: boolean;
}

// GET - List all benchmarks
export async function GET(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin();

    const supabase = createServiceRoleClient();
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query = supabase
      .from('benchmark_data')
      .select('*')
      .order('state', { ascending: true })
      .order('suburb_name', { ascending: true, nullsFirst: true });

    if (state) {
      query = query.eq('state', state);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch benchmarks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      benchmarks: data || [],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    console.error('Admin benchmarks GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch benchmarks',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new benchmark
export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin();

    const body: BenchmarkInput = await request.json();
    const supabase = createServiceRoleClient();

    // Validate required fields
    if (!body.state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      );
    }

    // Insert benchmark
    const { data, error } = await supabase
      .from('benchmark_data')
      .insert({
        state: body.state,
        suburb_name: body.suburb_name || null,
        postcode: body.postcode || null,
        gross_rental_yield: body.gross_rental_yield || null,
        net_rental_yield: body.net_rental_yield || null,
        median_weekly_rent: body.median_weekly_rent || null,
        capital_growth_5yr: body.capital_growth_5yr || null,
        capital_growth_10yr: body.capital_growth_10yr || null,
        median_property_value: body.median_property_value || null,
        data_source: body.data_source || null,
        data_quality_score: body.data_quality_score || null,
        notes: body.notes || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        last_updated: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A benchmark for this location already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create benchmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      benchmark: data,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    console.error('Admin benchmarks POST error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create benchmark',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

