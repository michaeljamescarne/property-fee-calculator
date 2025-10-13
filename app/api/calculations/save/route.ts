/**
 * Save Calculation API Route
 * Saves a calculation to the user's account
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { prepareCalculationForStorage } from '@/lib/calculations/storage';
import type { CalculationData } from '@/types/database';

interface SaveCalculationRequest {
  calculationData: CalculationData;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const body: SaveCalculationRequest = await request.json();
    const { calculationData, name } = body;

    // Validate calculation data
    if (!calculationData || !calculationData.eligibility || !calculationData.costs) {
      return NextResponse.json(
        { error: 'Invalid calculation data' },
        { status: 400 }
      );
    }

    // Prepare data for storage
    const dataToSave = prepareCalculationForStorage(
      calculationData,
      session.user.id,
      name
    );

    // Save to database using service role client (bypasses RLS)
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('saved_calculations')
      .insert(dataToSave as never)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save calculation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      calculation: data,
    });

  } catch (error) {
    console.error('Save calculation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

