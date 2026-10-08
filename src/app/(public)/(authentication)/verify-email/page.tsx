"use client";

import { Building2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import VerifyOtpComponent from "@/components/form/verify-otp-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [manualEmail, setManualEmail] = useState("");
  const [activeEmail, setActiveEmail] = useState<string | null>(emailParam);

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualEmail.trim()) {
      setActiveEmail(manualEmail.trim());
    }
  };

  if (!activeEmail) {
    return (
      <Card className="max-w-md w-full shadow-md border-border/80">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="size-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Email Verification
            </h2>
            <p className="text-xs text-muted-foreground">
              Please enter your registered email address to verify your OTP
              code.
            </p>
          </div>

          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="verify-email-input">
                Email Address
              </FieldLabel>
              <Input
                id="verify-email-input"
                type="email"
                placeholder="citizen@example.com"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                required
              />
            </Field>

            <Button type="submit" className="w-full">
              Proceed to Enter Code
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Back to{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <VerifyOtpComponent email={activeEmail} isModal={false} />;
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-svh flex flex-col justify-between bg-muted/20 p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
            <Building2 className="size-5" />
          </div>
          <span className="text-lg">CityCare</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Two-Step Email Verification</span>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center py-10">
        <Suspense
          fallback={
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
              Loading verification screen...
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground max-w-4xl w-full mx-auto border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>CityCare Civic Platform © {new Date().getFullYear()}</span>
        <div className="flex gap-4">
          <Link href="/contact" className="hover:underline">
            Support Hotline
          </Link>
          <Link href="/login" className="hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
