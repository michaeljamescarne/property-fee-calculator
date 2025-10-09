'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CalculationResult {
  propertyPrice: number;
  interestRate: number;
  years: number;
  interestAmount: number;
  totalFees: number;
  totalCost: number;
}

export default function CalculatorPage() {
  const t = useTranslations('Calculator');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculate-fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyPrice: parseFloat(propertyPrice),
          interestRate: parseFloat(interestRate),
          years: parseInt(years)
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>Enter your property details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">{t('propertyPrice')}</Label>
                <Input
                  id="propertyPrice"
                  type="number"
                  placeholder="500000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">{t('interestRate')}</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="3.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">{t('years')}</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="30"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCalculate} 
                className="w-full"
                disabled={!propertyPrice || !interestRate || !years || loading}
              >
                {loading ? 'Calculating...' : t('calculate')}
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>{t('results')}</CardTitle>
                <CardDescription>{t('breakdown')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Property Price:</span>
                    <Badge variant="secondary">
                      ${result.propertyPrice.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{t('interestAmount')}:</span>
                    <Badge variant="secondary">
                      ${result.interestAmount.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{t('totalFees')}:</span>
                    <Badge variant="secondary">
                      ${result.totalFees.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-primary text-primary-foreground rounded-lg">
                    <span className="font-bold">{t('totalCost')}:</span>
                    <Badge variant="outline" className="bg-background text-foreground">
                      ${result.totalCost.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
