"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail, RotateCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useForgotPassword, useVerifyAccount } from "@/hooks";

const INITIAL_COOLDOWN = 180; // 3 minutes

interface VerifyOtpProps {
  email: string;
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export default function VerifyOtpComponent({
  email,
  isOpen = true,
  onClose,
  isModal = false,
}: VerifyOtpProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(INITIAL_COOLDOWN);
  const [isResending, setIsResending] = useState(false);

  const { mutate: verifyAccount, isPending: isVerifying } = useVerifyAccount();
  const { mutate: sendOtp } = useForgotPassword();

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = (otpValue = otp) => {
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    setErrorMessage(null);
    verifyAccount(
      { email, otp: otpValue },
      {
        onSuccess: async () => {
          toast.add({
            title: "Account Verified Successfully",
            description:
              "Welcome to CityCare! Your citizen account is now active.",
            type: "success",
          });
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          if (onClose) onClose();
          router.push("/dashboard");
        },
        onError: (err: Error) => {
          setErrorMessage(
            err?.message ||
              "Invalid or expired verification code. Please check and try again.",
          );
          toast.add({
            title: "Verification Failed",
            description: err?.message || "Invalid or expired OTP code.",
            type: "error",
          });
        },
      },
    );
  };

  const handleResend = () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    sendOtp(
      { email },
      {
        onSuccess: () => {
          toast.add({
            title: "New OTP Sent",
            description: `A fresh 6-digit code was sent to ${email}`,
            type: "success",
          });
          setTimer(INITIAL_COOLDOWN);
          setOtp("");
          setErrorMessage(null);
          setIsResending(false);
        },
        onError: (err: Error) => {
          toast.add({
            title: "Resend Failed",
            description:
              err?.message || "Could not resend OTP. Please try again shortly.",
            type: "error",
          });
          setIsResending(false);
        },
      },
    );
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  const content = (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Mail className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-xs text-muted-foreground text-balance">
            We sent a 6-digit verification code to
          </p>
          <p className="text-xs font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-md inline-block">
            {email}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="space-y-4"
      >
        <Field
          data-invalid={!!errorMessage}
          className="flex flex-col items-center"
        >
          <FieldLabel htmlFor="otp" className="text-xs text-muted-foreground">
            Enter 6-Digit Code
          </FieldLabel>
          <div className="py-2">
            <InputOTP
              id="otp"
              name="otp"
              maxLength={6}
              value={otp}
              pattern={REGEXP_ONLY_DIGITS}
              onChange={(val) => {
                setOtp(val);
                if (errorMessage) setErrorMessage(null);
                if (val.length === 6) {
                  handleVerify(val);
                }
              }}
              autoFocus
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2">
                <InputOTPSlot
                  index={0}
                  className="size-10 sm:size-11 text-lg font-bold"
                />
                <InputOTPSlot
                  index={1}
                  className="size-10 sm:size-11 text-lg font-bold"
                />
                <InputOTPSlot
                  index={2}
                  className="size-10 sm:size-11 text-lg font-bold"
                />
                <InputOTPSlot
                  index={3}
                  className="size-10 sm:size-11 text-lg font-bold"
                />
                <InputOTPSlot
                  index={4}
                  className="size-10 sm:size-11 text-lg font-bold"
                />
                <InputOTPSlot
                  index={5}
                  className="size-10 sm:size-11 text-lg font-bold"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {errorMessage && <FieldError errors={[{ message: errorMessage }]} />}

          <FieldDescription className="text-xs text-center pt-1">
            {timer > 0 ? (
              <span>
                Code expires in{" "}
                <strong className="text-foreground">{formattedTime}</strong>
              </span>
            ) : (
              <span className="text-destructive font-medium">
                Code expired. Please request a new one.
              </span>
            )}
          </FieldDescription>
        </Field>

        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            className="w-full"
            disabled={otp.length !== 6 || isVerifying}
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4" /> Complete Verification
              </span>
            )}
          </Button>

          <div className="flex items-center justify-between text-xs pt-1 px-1 text-muted-foreground">
            <span>Didn&apos;t get the code?</span>
            <button
              type="button"
              disabled={timer > 0 || isResending}
              onClick={handleResend}
              className="text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
            >
              {isResending ? (
                <>
                  <Spinner className="size-3" /> Sending...
                </>
              ) : (
                <>
                  <RotateCw className="size-3" /> Resend Code
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Verify your citizen account OTP
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="max-w-md w-full shadow-md border-border/80">
      <CardContent className="p-6">{content}</CardContent>
    </Card>
  );
}
