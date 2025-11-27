/**
 * Auth Prompt Component
 * Inline prompt to encourage users to login
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Save } from "lucide-react";

interface AuthPromptProps {
  onLoginClick: () => void;
  message?: string;
}

export default function AuthPrompt({
  onLoginClick,
  message = "Login to save this calculation and access it later",
}: AuthPromptProps) {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Save Your Calculation</h4>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <Button onClick={onLoginClick} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Login to Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
