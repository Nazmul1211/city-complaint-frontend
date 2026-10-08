"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeClosed,
  KeyRound,
  Mail,
  RotateCw,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const INITIAL_COOLDOWN = 180; // 3 minutes

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"REQUEST_CODE" | "VERIFY_AND_RESET">(
    "REQUEST_CODE",
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(INITIAL_COOLDOWN);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: requestOtp, isPending: isRequesting } = useForgotPassword();
  const { mutate: resetPwd, isPending: isResetting } = useResetPassword();

  useEffect(() => {
    if (step !== "VERIFY_AND_RESET" || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

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

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setValidationError("Please enter a valid registered email address.");
      return;
    }

    requestOtp(
      { email: trimmedEmail },
      {
        onSuccess: () => {
          toast.add({
            title: "Verification Code Sent",
            description: `A 6-digit recovery code was sent to ${trimmedEmail}.`,
          });
          setStep("VERIFY_AND_RESET");
          setTimer(INITIAL_COOLDOWN);
        },
        onError: (err: ApiError) => {
          const msg =
            err?.data?.message || err?.message || "Failed to send code.";
          setValidationError(msg);
          toast.add({
            title: "Request Failed",
            description: msg,
          });
        },
      },
    );
  };

  const handleResendCode = () => {
    if (timer > 0) return;
    requestOtp(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          toast.add({
            title: "New Code Sent",
            description:
              "A fresh 6-digit verification code has been dispatched.",
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
      setValidationError("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (!isPasswordValid) {
      setValidationError(
        "Please meet all password requirements and make sure passwords match.",
      );
      return;
    }

    resetPwd(
      {
        email: email.trim().toLowerCase(),
        otp,
        newPassword,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Password Reset Successfully",
            description: "You can now log in with your new password.",
          });
          router.push("/login");
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
            <KeyRound className="size-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            {step === "REQUEST_CODE"
              ? "Reset Account Password"
              : "Set New Password"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-relaxed">
            {step === "REQUEST_CODE"
              ? "Enter your verified citizen email address to receive an authorization code."
              : `Enter the 6-digit code dispatched to ${email} and set your new credentials.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {step === "REQUEST_CODE" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <Field>
                <FieldLabel className="text-xs font-semibold flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Registered Email Address
                </FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="citizen@citycomplaint.gov"
                  disabled={isRequesting}
                  className="h-10 text-sm"
                  autoFocus
                />
              </Field>

              {validationError && (
                <p className="text-xs text-destructive font-medium">
                  {validationError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isRequesting || !email.trim()}
                className="w-full gap-1.5 text-xs h-10"
              >
                {isRequesting ? (
                  <>
                    <Spinner className="size-3.5" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="size-3.5" />
                    Send Authorization Code
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitReset} className="space-y-4">
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

              <Field>
                <FieldLabel className="text-xs font-semibold">
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong password"
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

              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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

              {/* Password Requirements */}
              <div className="rounded-lg border bg-muted/20 p-2.5 space-y-1 text-[11px]">
                <span className="font-semibold text-muted-foreground">
                  Security Checklist:
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
                    1 uppercase
                  </span>
                  <span
                    className={`flex items-center gap-1 ${hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasLowercase ? (
                      <Check className="size-3" />
                    ) : (
                      <X className="size-3" />
                    )}
                    1 lowercase
                  </span>
                  <span
                    className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasNumber ? (
                      <Check className="size-3" />
                    ) : (
                      <X className="size-3" />
                    )}
                    1 number
                  </span>
                  <span
                    className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}`}
                  >
                    {hasSpecial ? (
                      <Check className="size-3" />
                    ) : (
                      <X className="size-3" />
                    )}
                    1 special char
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

              {validationError && (
                <p className="text-xs text-destructive font-medium">
                  {validationError}
                </p>
              )}

              <div className="flex items-center justify-between text-xs">
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

              <Button
                type="submit"
                disabled={isResetting || !isPasswordValid || otp.length !== 6}
                className="w-full gap-1.5 text-xs h-10"
              >
                {isResetting ? (
                  <>
                    <Spinner className="size-3.5" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3.5" />
                    Set New Password
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="pt-2 text-center border-t">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
