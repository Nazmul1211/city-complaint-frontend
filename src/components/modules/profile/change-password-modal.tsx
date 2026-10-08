"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Check,
  Eye,
  EyeClosed,
  KeyRound,
  Mail,
  RotateCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useForgotPassword, useResetPassword } from "@/hooks";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

const INITIAL_COOLDOWN = 180; // 3 minutes

export function ChangePasswordModal({
  open,
  onOpenChange,
  userEmail,
}: ChangePasswordModalProps) {
  const [step, setStep] = useState<"REQUEST_CODE" | "VERIFY_AND_RESET">(
    "REQUEST_CODE",
  );
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(INITIAL_COOLDOWN);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: requestOtp, isPending: isRequesting } = useForgotPassword();
  const { mutate: resetPwd, isPending: isResetting } = useResetPassword();

  // Cooldown countdown timer
  useEffect(() => {
    if (step !== "VERIFY_AND_RESET" || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setStep("REQUEST_CODE");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setValidationError(null);
      setTimer(INITIAL_COOLDOWN);
    }
  }, [open]);

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleSendCode = () => {
    if (!userEmail) {
      toast.add({
        title: "Missing Email",
        description: "User email address is missing.",
      });
      return;
    }

    requestOtp(
      { email: userEmail },
      {
        onSuccess: () => {
          toast.add({
            title: "Authorization Code Sent",
            description: `A 6-digit verification code has been dispatched to ${userEmail}.`,
          });
          setStep("VERIFY_AND_RESET");
          setTimer(INITIAL_COOLDOWN);
        },
        onError: (err: ApiError) => {
          toast.add({
            title: "Failed to Send Code",
            description:
              err?.data?.message || err?.message || "Please try again later.",
          });
        },
      },
    );
  };

  const handleResendCode = () => {
    if (timer > 0) return;
    requestOtp(
      { email: userEmail },
      {
        onSuccess: () => {
          toast.add({
            title: "New Code Dispatched",
            description: `A fresh 6-digit code was sent to ${userEmail}.`,
          });
          setTimer(INITIAL_COOLDOWN);
        },
        onError: (err: ApiError) => {
          toast.add({
            title: "Resend Failed",
            description: err?.data?.message || err?.message,
          });
        },
      },
    );
  };

  const handleSubmitReset = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (otp.length !== 6) {
      setValidationError("Please enter the complete 6-digit code.");
      return;
    }

    if (!isPasswordValid) {
      setValidationError(
        "Please ensure the new password fulfills all security requirements and matches confirmation.",
      );
      return;
    }

    resetPwd(
      {
        email: userEmail,
        otp,
        newPassword,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Password Changed Successfully",
            description:
              "Your citizen login credentials have been securely updated.",
          });
          onOpenChange(false);
        },
        onError: (err: ApiError) => {
          const message =
            err?.data?.message || err?.message || "Password reset failed.";
          setValidationError(message);
          toast.add({
            title: "Reset Failed",
            description: message,
          });
        },
      },
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <KeyRound className="size-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Change Account Password
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {step === "REQUEST_CODE"
              ? "To secure your account, we will send a 6-digit authorization code to your verified email."
              : `Enter the 6-digit code dispatched to ${userEmail} and your new password.`}
          </DialogDescription>
        </DialogHeader>

        {step === "REQUEST_CODE" ? (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1.5 text-xs">
              <span className="text-muted-foreground">Authorized Email:</span>
              <p className="font-semibold text-foreground flex items-center gap-1.5 font-mono">
                <Mail className="size-3.5 text-primary" />
                {userEmail}
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Clicking below will dispatch a time-sensitive security code valid
              for 5 minutes.
            </p>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isRequesting}
                onClick={handleSendCode}
                className="gap-1.5 text-xs min-w-[140px]"
              >
                {isRequesting ? (
                  <>
                    <Spinner className="size-3.5" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="size-3.5" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmitReset} className="space-y-4 py-2">
            {/* 6-Digit Code */}
            <Field>
              <FieldLabel className="text-xs font-semibold flex items-center justify-between">
                <span>6-Digit Verification Code</span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Expires in {formatTimer(timer)}
                </span>
              </FieldLabel>
              <div className="flex justify-center py-1">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={isResetting}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Field>

            {/* New Password */}
            <Field>
              <FieldLabel className="text-xs font-semibold">
                New Password
              </FieldLabel>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong new password"
                  disabled={isResetting}
                  className="h-9 pr-9 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeClosed className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            {/* Confirm New Password */}
            <Field>
              <FieldLabel className="text-xs font-semibold">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  disabled={isResetting}
                  className="h-9 pr-9 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeClosed className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            {/* Password Strength Checklist */}
            <div className="rounded-lg border bg-muted/20 p-2.5 space-y-1 text-[11px]">
              <span className="font-semibold text-muted-foreground">
                Password Security Requirements:
              </span>
              <div className="grid grid-cols-2 gap-1 pt-1 text-muted-foreground">
                <span
                  className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                >
                  {hasMinLength ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  8+ characters
                </span>
                <span
                  className={`flex items-center gap-1 ${hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                >
                  {hasUppercase ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  1 uppercase (A-Z)
                </span>
                <span
                  className={`flex items-center gap-1 ${hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                >
                  {hasLowercase ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  1 lowercase (a-z)
                </span>
                <span
                  className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                >
                  {hasNumber ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  1 number (0-9)
                </span>
                <span
                  className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                >
                  {hasSpecial ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  1 special (!@#$)
                </span>
                <span
                  className={`flex items-center gap-1 ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                >
                  {passwordsMatch ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  Passwords match
                </span>
              </div>
            </div>

            {/* Error Message */}
            {validationError && (
              <p className="text-xs text-destructive font-medium">
                {validationError}
              </p>
            )}

            {/* Resend Action */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={timer > 0 || isRequesting}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:text-muted-foreground disabled:no-underline cursor-pointer"
              >
                <RotateCw className="size-3" />
                Resend Code {timer > 0 ? `(${timer}s)` : ""}
              </button>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isResetting || !isPasswordValid || otp.length !== 6}
                className="gap-1.5 text-xs min-w-[130px]"
              >
                {isResetting ? (
                  <>
                    <Spinner className="size-3.5" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3.5" />
                    Set New Password
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
