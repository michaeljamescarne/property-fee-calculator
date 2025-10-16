/**
 * Paywall Overlay Component
 * Blurred overlay for locked content
 * 
 * NOTE: This component is prepared but not active yet.
 * Will be used when paywall is enabled.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Star } from 'lucide-react';

interface PaywallOverlayProps {
  title: string;
  description?: string;
  onUnlock: () => void;
  isAuthenticated: boolean;
}

export default function PaywallOverlay({
  title,
  description,
  onUnlock,
  isAuthenticated,
}: PaywallOverlayProps) {
  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="blur-sm pointer-events-none select-none opacity-50">
        <Card>
          <CardContent className="p-8 space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-muted rounded animate-pulse" />
              <div className="h-24 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unlock overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="max-w-md border-2 border-primary shadow-xl">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isAuthenticated ? (
                <Star className="h-8 w-8 text-primary" />
              ) : (
                <Lock className="h-8 w-8 text-primary" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>

            <Button onClick={onUnlock} size="lg" className="w-full">
              {isAuthenticated ? 'Upgrade to Unlock' : 'Login to Unlock'}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground">
                Free to sign up • No credit card required
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




