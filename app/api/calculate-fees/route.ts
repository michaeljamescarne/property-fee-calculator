import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyPrice, interestRate, years } = body;

    // Validate inputs
    if (!propertyPrice || !interestRate || !years) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simple interest calculation: I = P * r * t
    const principal = parseFloat(propertyPrice);
    const rate = parseFloat(interestRate) / 100;
    const time = parseInt(years);

    const interestAmount = principal * rate * time;
    
    // Example additional fees (2% of property price)
    const additionalFees = principal * 0.02;
    
    const totalFees = interestAmount + additionalFees;
    const totalCost = principal + totalFees;

    return NextResponse.json({
      propertyPrice: principal,
      interestRate: parseFloat(interestRate),
      years: time,
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalFees: Math.round(totalFees * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 }
    );
  }
}
