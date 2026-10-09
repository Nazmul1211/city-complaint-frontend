import { Banknote, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { PaymentList } from "@/components/modules/payment";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Bills & Payments | CityCare Portal",
  description:
    "Review, track, and pay municipal fees, inspection charges, and permits via bKash.",
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Municipal Payments & Invoices
            </h1>
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary"
            >
              <Banknote className="size-3 text-primary" />
              bKash Secured
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review official municipal invoices, settle inspection and permit
            fees via bKash, and download digital payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>Encrypted bKash Payment Gateway</span>
        </div>
      </div>

      {/* Main Payment Module List */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Spinner className="size-8 text-primary mb-3" />
            <p className="text-xs text-muted-foreground">
              Loading municipal payment records...
            </p>
          </div>
        }
      >
        <PaymentList />
      </Suspense>
    </div>
  );
}
