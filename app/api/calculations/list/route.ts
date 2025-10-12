/**
 * List Calculations API Route
 * Gets all calculations for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { sortCalculations, filterCalculations, type CalculationFilters, type SortOption } from '@/lib/calculations/storage';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const sortBy = (searchParams.get('sortBy') || 'date-desc') as SortOption;
    
    const filters: CalculationFilters = {
      search: searchParams.get('search') || undefined,
      eligibility: (searchParams.get('eligibility') as 'all' | 'eligible' | 'review-required') || 'all',
      propertyType: searchParams.get('propertyType') || undefined,
      state: searchParams.get('state') || undefined,
      favorites: searchParams.get('favorites') === 'true',
    };

    // Fetch calculations from database
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('saved_calculations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calculations' },
        { status: 500 }
      );
    }

    // Apply filters and sorting
    let calculations = data || [];
    calculations = filterCalculations(calculations, filters);
    calculations = sortCalculations(calculations, sortBy);

    return NextResponse.json({
      success: true,
      calculations,
      count: calculations.length,
    });

  } catch (error) {
    console.error('List calculations error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

