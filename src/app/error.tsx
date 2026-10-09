"use client";

import {
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Home,
  RefreshCw,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log unexpected runtime anomaly to console
    console.error("[CityCare Global Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/15 to-background">
      <div className="w-full max-w-lg space-y-6">
        <Card className="border-border/80 shadow-2xl bg-card overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-br from-destructive/15 via-destructive/5 to-transparent p-6 sm:p-8 text-center border-b border-border/60">
            <div className="size-16 rounded-2xl bg-destructive/15 text-destructive border border-destructive/25 flex items-center justify-center mx-auto shadow-md mb-3">
              <ShieldAlert className="size-9 animate-in zoom-in-75 duration-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold mb-2">
              <AlertTriangle className="size-3.5" />
              Runtime Anomaly Intercepted
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Municipal Service Dispatch Disrupted
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              A temporary application anomaly interrupted your request. The
              issue has been isolated to prevent session contamination.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-5">
            {/* Error Message & Digest Box */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Terminal className="size-3.5 text-muted-foreground" />
                <span>Diagnostics & Audit Trace</span>
              </div>
              <p className="text-muted-foreground break-words font-mono text-[11px] bg-background/80 p-2.5 rounded-lg border border-border/40">
                {error.message ||
                  "An unexpected rendering exception was caught."}
              </p>
              {error.digest && (
                <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                  <span>Incident Digest Code:</span>
                  <span className="font-mono font-bold text-foreground">
                    {error.digest}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  onClick={() => reset()}
                  className="w-full gap-2 text-xs h-10 font-semibold shadow-xs"
                >
                  <RefreshCw className="size-3.5" />
                  Try Again
                </Button>

                <Link href="/" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs h-10 font-medium"
                  >
                    <Home className="size-3.5" />
                    Return Home
                  </Button>
                </Link>
              </div>

              <Link href="/contact" className="block w-full">
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <HelpCircle className="size-3.5" />
                  Report Issue to Municipal IT Helpdesk
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
