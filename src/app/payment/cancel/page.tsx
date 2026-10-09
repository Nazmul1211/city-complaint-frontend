"use client";

import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  HelpCircle,
  Home,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const requestNo = searchParams.get("requestNo");

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="w-full max-w-lg space-y-6">
        <Card className="border-border/80 shadow-2xl bg-card overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent p-6 sm:p-8 text-center border-b border-border/60">
            <div className="size-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md mb-3">
              <AlertTriangle className="size-9 animate-in zoom-in-75 duration-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
              <ShieldAlert className="size-3.5" />
              Transaction Cancelled
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Payment Incomplete or Cancelled
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Your bKash checkout session was cancelled. No charges have been
              deducted from your bKash balance or account.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Status Information Box */}
            <div className="rounded-xl border border-border/60 bg-muted/25 p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                <span className="text-muted-foreground font-medium">
                  Session Status:
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  User Cancelled / Interrupted
                </span>
              </div>

              {paymentId && (
                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                  <span className="text-muted-foreground font-medium">
                    Invoice Ref:
                  </span>
                  <span className="font-mono text-foreground font-semibold">
                    {paymentId.slice(0, 12)}
                  </span>
                </div>
              )}

              {requestNo && (
                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                  <span className="text-muted-foreground font-medium">
                    Complaint Ref:
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {requestNo}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                <span className="text-muted-foreground font-medium">
                  Account Impact:
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  ৳0.00 Debited (Safe)
                </span>
              </div>

              <div className="pt-1 text-xs text-muted-foreground leading-relaxed">
                Your municipal fee invoice remains active in{" "}
                <strong className="text-foreground">Pending</strong> status. You
                can retry paying securely at any time before the due date.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link href="/dashboard/payments" className="w-full">
                  <Button className="w-full bg-[#E2136E] hover:bg-[#C2105D] text-white gap-2 text-xs h-10 font-semibold shadow-xs">
                    <Banknote className="size-4" />
                    Retry via bKash
                  </Button>
                </Link>

                <Link href="/dashboard/requests" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs h-10 font-medium"
                  >
                    <Home className="size-4" />
                    My Complaints
                  </Button>
                </Link>
              </div>

              <Link href="/contact" className="block w-full">
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <HelpCircle className="size-3.5" />
                  Need Help? Contact Municipal Support
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
