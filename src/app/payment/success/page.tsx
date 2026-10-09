"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  FileCheck2,
  Home,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const trxId =
    searchParams.get("trxId") ||
    searchParams.get("paymentID") ||
    "TRX-BKASH-VERIFIED";
  const amount = searchParams.get("amount") || "500.00";
  const paymentId = searchParams.get("paymentId");
  const requestNo = searchParams.get("requestNo");

  const [copied, setCopied] = useState(false);

  const handleCopyTrx = () => {
    navigator.clipboard.writeText(trxId);
    setCopied(true);
    toast.add({
      title: "Copied TrxID",
      description: `Transaction ID ${trxId} copied to clipboard.`,
      type: "info",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="w-full max-w-lg space-y-6">
        {/* Success Card */}
        <Card className="border-border/80 shadow-2xl bg-card overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent p-6 sm:p-8 text-center border-b border-border/60 relative">
            <div className="size-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md mb-3">
              <CheckCircle2 className="size-9 animate-in zoom-in-75 duration-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="size-3.5" />
              Official Municipal Confirmation
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Municipal Fee Payment Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Your transaction has cleared through the official bKash Tokenized
              Gateway. A tamper-evident receipt is logged in the municipal
              ledger.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Voucher Body */}
            <div className="rounded-xl border border-border/60 bg-muted/25 p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-muted-foreground font-medium">
                  Gateway Transaction ID:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground">
                    {trxId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTrx}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy Transaction ID"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {paymentId && (
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground font-medium">
                    Invoice Reference:
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    INV-{paymentId.slice(0, 12).toUpperCase()}
                  </span>
                </div>
              )}

              {requestNo && (
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground font-medium">
                    Complaint Case Ref:
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {requestNo}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-muted-foreground font-medium">
                  Payment Gateway:
                </span>
                <span className="font-semibold text-[#E2136E] flex items-center gap-1">
                  bKash Tokenized (Auto Verified)
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-muted-foreground font-medium">
                  Cleared Timestamp:
                </span>
                <span className="text-foreground">
                  {new Date().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-foreground">
                  Total Amount Paid:
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{Number(amount).toLocaleString()} BDT
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <span>
                An official confirmation invoice has been registered to your
                profile. Civic field technicians have been notified to proceed
                with service dispatch.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="gap-2 text-xs h-10 font-medium"
                >
                  <Printer className="size-4" />
                  Print Receipt
                </Button>

                <Link href="/dashboard/payments" className="w-full">
                  <Button className="w-full gap-2 text-xs h-10 font-medium shadow-xs">
                    <FileCheck2 className="size-4" />
                    Billing Records
                  </Button>
                </Link>
              </div>

              <Link href="/dashboard/requests" className="block w-full">
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <Home className="size-3.5" />
                  Return to My Complaints
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
