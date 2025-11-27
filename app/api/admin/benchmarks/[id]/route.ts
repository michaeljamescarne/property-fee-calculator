/**
 * Admin Benchmarks API Route (Single)
 * Update and delete operations for individual benchmarks
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { BenchmarkInput } from '../route';

// PUT - Update benchmark
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin access
    await requireAdmin();

    const { id } = await params;
    const body: Partial<BenchmarkInput> = await request.json();
    const supabase = createServiceRoleClient();

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.state !== undefined) updateData.state = body.state;
    if (body.suburb_name !== undefined) updateData.suburb_name = body.suburb_name || null;
    if (body.postcode !== undefined) updateData.postcode = body.postcode || null;
    if (body.gross_rental_yield !== undefined) updateData.gross_rental_yield = body.gross_rental_yield || null;
    if (body.net_rental_yield !== undefined) updateData.net_rental_yield = body.net_rental_yield || null;
    if (body.median_weekly_rent !== undefined) updateData.median_weekly_rent = body.median_weekly_rent || null;
    if (body.capital_growth_5yr !== undefined) updateData.capital_growth_5yr = body.capital_growth_5yr || null;
    if (body.capital_growth_10yr !== undefined) updateData.capital_growth_10yr = body.capital_growth_10yr || null;
    if (body.median_property_value !== undefined) updateData.median_property_value = body.median_property_value || null;
    if (body.data_source !== undefined) updateData.data_source = body.data_source || null;
    if (body.data_quality_score !== undefined) updateData.data_quality_score = body.data_quality_score || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.data_source || body.gross_rental_yield || body.capital_growth_5yr) {
      updateData.last_updated = new Date().toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('benchmark_data')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Benchmark not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update benchmark', details: error.message },
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

    console.error('Admin benchmarks PUT error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update benchmark',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete benchmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin access
    await requireAdmin();

    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('benchmark_data')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Benchmark not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to delete benchmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Benchmark deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    console.error('Admin benchmarks DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete benchmark',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

