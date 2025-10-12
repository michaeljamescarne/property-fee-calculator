/**
 * Save Calculation Button Component
 * Button to save current calculation (with auth check)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthPrompt from '@/components/auth/AuthPrompt';
import type { CalculationData } from '@/types/database';

interface SaveCalculationButtonProps {
  calculationData: CalculationData;
  onLoginClick: () => void;
  className?: string;
}

export default function SaveCalculationButton({
  calculationData,
  onLoginClick,
  className,
}: SaveCalculationButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    if (!isAuthenticated) {
      onLoginClick();
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/calculations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationData }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSaveStatus('success');
        // Reset success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setErrorMessage(data.error || 'Failed to save calculation');
      }
    } catch {
      setSaveStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={className}>
        <AuthPrompt onLoginClick={onLoginClick} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        onClick={handleSave}
        disabled={isSaving || saveStatus === 'success'}
        className="w-full"
        size="lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : saveStatus === 'success' ? (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            Saved Successfully!
          </>
        ) : (
          <>
            <Save className="mr-2 h-5 w-5" />
            Save This Calculation
          </>
        )}
      </Button>

      {saveStatus === 'error' && errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {saveStatus === 'success' && (
        <Alert className="mt-4 border-green-200 bg-green-50 text-green-900">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Calculation saved! View it in your{' '}
            <Link href="/en/dashboard" className="underline font-medium">
              dashboard
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

