/**
 * Save Calculation Button Component
 * Button to save current calculation (with auth check)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthPrompt from "@/components/auth/AuthPrompt";
import type { CalculationData } from "@/types/database";

interface SaveCalculationButtonProps {
  calculationData: CalculationData;
  onLoginClick: () => void;
  className?: string;
  editingCalculationId?: string | null;
  onSaveSuccess?: (name: string, calculationId: string) => void;
}

export default function SaveCalculationButton({
  calculationData,
  onLoginClick,
  className,
  editingCalculationId,
  onSaveSuccess,
}: SaveCalculationButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [calculationName, setCalculationName] = useState("");
  const [dialogError, setDialogError] = useState("");

  // Check if this is a first-time save (not editing)
  const isFirstTimeSave = !editingCalculationId;

  const performSave = async (name?: string) => {
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      const url = editingCalculationId
        ? `/api/calculations/${editingCalculationId}`
        : "/api/calculations/save";
      const method = editingCalculationId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calculationData, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSaveStatus("success");
        // Reset success message after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);
        // Close dialog if open
        if (showNameDialog) {
          setShowNameDialog(false);
          setCalculationName("");
        }
        // Call onSaveSuccess callback with the saved name and calculation ID
        if (onSaveSuccess && data.calculation) {
          const savedName = name || data.calculation.calculation_name || "";
          const calcId = data.calculation.id || editingCalculationId || "";
          if (savedName && calcId) {
            onSaveSuccess(savedName, calcId);
          }
        }
      } else {
        setSaveStatus("error");
        const errorMsg = data.error || "Failed to save calculation";
        const details = data.details ? `: ${data.details}` : "";
        setErrorMessage(`${errorMsg}${details}`);
        console.error("Save calculation error:", data);
      }
    } catch {
      setSaveStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      onLoginClick();
      return;
    }

    // If first time save, show dialog to get name
    if (isFirstTimeSave) {
      setShowNameDialog(true);
      setDialogError("");
      return;
    }

    // For edits, save directly without dialog
    await performSave();
  };

  const handleDialogSave = () => {
    const trimmedName = calculationName.trim();
    if (!trimmedName) {
      setDialogError("Please enter a name for this calculation");
      return;
    }

    if (trimmedName.length > 100) {
      setDialogError("Name must be 100 characters or less");
      return;
    }

    setDialogError("");
    performSave(trimmedName);
  };

  const handleDialogCancel = () => {
    setShowNameDialog(false);
    setCalculationName("");
    setDialogError("");
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
    <>
      <div className={className}>
        <Button
          onClick={handleSave}
          disabled={isSaving || saveStatus === "success"}
          className="w-full"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : saveStatus === "success" ? (
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

        {saveStatus === "error" && errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {saveStatus === "success" && (
          <Alert className="mt-4 border-green-200 bg-green-50 text-green-900">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Calculation saved! View it in your{" "}
              <Link href="/en/dashboard" className="underline font-medium">
                dashboard
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Name Dialog - only show for first-time saves */}
      <Dialog
        open={showNameDialog}
        onOpenChange={(open) => {
          // Only allow closing if not currently saving
          if (!open && !isSaving) {
            handleDialogCancel();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter a name for this calculation</DialogTitle>
            <DialogDescription>
              Give your calculation a name so you can easily identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="calculation-name">Calculation Name</Label>
              <Input
                id="calculation-name"
                placeholder="e.g., Carlton North Home"
                value={calculationName}
                onChange={(e) => {
                  setCalculationName(e.target.value);
                  setDialogError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSaving && calculationName.trim()) {
                    e.preventDefault();
                    handleDialogSave();
                  } else if (e.key === "Escape" && !isSaving) {
                    handleDialogCancel();
                  }
                }}
                autoFocus
                maxLength={100}
              />
              {dialogError && <p className="text-sm text-destructive">{dialogError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleDialogSave} disabled={isSaving || !calculationName.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
