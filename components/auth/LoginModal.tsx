/**
 * Login Modal Component
 * Passwordless authentication flow: email → code entry
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthProvider";
import type { SendCodeResponse, VerifyCodeResponse, AuthErrorResponse } from "@/types/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = "email" | "code" | "success";

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const t = useTranslations("Auth");
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("email");
        setEmail("");
        setCode("");
        setError("");
        setExpiresAt("");
        setResendCooldown(0);
      }, 300);
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: SendCodeResponse | AuthErrorResponse = await response.json();

      if (!response.ok) {
        const errorData = data as AuthErrorResponse;
        setError(errorData.message);
        setIsLoading(false);
        return;
      }

      const successData = data as SendCodeResponse;
      setExpiresAt(successData.expiresAt || "");
      setStep("code");
      setResendCooldown(60); // 60 second cooldown
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data: VerifyCodeResponse | AuthErrorResponse = await response.json();

      if (!response.ok) {
        const errorData = data as AuthErrorResponse;
        setError(errorData.message);
        setIsLoading(false);
        return;
      }

      const successData = data as VerifyCodeResponse;
      if (successData.user) {
        login(successData.user);
        setStep("success");

        // Close modal and trigger success callback after animation
        setTimeout(() => {
          onClose();
          onSuccess?.();
          // Redirect to dashboard with a delay to ensure cookie is set and propagated
          // Use window.location.href for a full page load to ensure server reads the cookie
          setTimeout(() => {
            window.location.href = "/en/dashboard";
          }, 500);
        }, 1500);
      }
    } catch {
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCode("");
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to resend code");
      } else {
        setResendCooldown(60);
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    setCode("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {step === "email" && t("loginTitle")}
            {step === "code" && "Enter Verification Code"}
            {step === "success" && t("successTitle")}
          </DialogTitle>
          <DialogDescription>
            {step === "email" && t("loginDescription")}
            {step === "code" && `Code sent to ${email}`}
            {step === "success" && t("successDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Email Step */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("sendingCode")}
                </>
              ) : (
                t("sendCodeButton")
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">{t("noPasswordNeeded")}</p>
          </form>
        )}

        {/* Code Entry Step */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">6-Digit Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
                autoFocus
                disabled={isLoading}
                className="text-center text-2xl font-mono tracking-widest"
              />
              <p className="text-xs text-muted-foreground text-center">
                Check your email for the 6-digit code
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleChangeEmail}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Change email
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={isLoading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend code"}
              </Button>
            </div>

            {expiresAt && (
              <p className="text-xs text-muted-foreground text-center">
                Code expires in 10 minutes
              </p>
            )}
          </form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold">You&apos;re all set!</p>
            <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
