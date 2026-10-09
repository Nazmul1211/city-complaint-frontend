"use client";

import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetAllRequests, useIssuePayment } from "@/hooks";
import type { PaymentPurpose, ServiceRequest } from "@/types";

interface IssuePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRequestId?: string;
  defaultRequestNo?: string;
  onSuccess?: () => void;
}

const PAYMENT_PURPOSES: {
  value: PaymentPurpose;
  label: string;
  description: string;
  icon: typeof Banknote;
}[] = [
  {
    value: "INSPECTION_FEE",
    label: "Site Inspection Fee",
    description: "On-site engineering inspection or structural assessment",
    icon: Clock,
  },
  {
    value: "PERMIT_FEE",
    label: "Permit / Road Cutting Fee",
    description: "Permits for utility excavation, road cutting or signage",
    icon: FileText,
  },
  {
    value: "SERVICE_FEE",
    label: "Municipal Service Charge",
    description: "Waste extraction, septic clearing or specialized machinery",
    icon: Banknote,
  },
  {
    value: "PENALTY",
    label: "Municipal Code Penalty",
    description: "Violation fines, unauthorized dumping or encroachment",
    icon: ShieldAlert,
  },
  {
    value: "APPLICATION_FEE",
    label: "Application Processing Fee",
    description: "Administrative document review and processing",
    icon: FileText,
  },
  {
    value: "OTHER",
    label: "Other Official Surcharge",
    description: "Miscellaneous city municipal assessment fee",
    icon: Banknote,
  },
];

export function IssuePaymentModal({
  isOpen,
  onClose,
  defaultRequestId,
  defaultRequestNo,
  onSuccess,
}: IssuePaymentModalProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    defaultRequestId || "",
  );
  const [purpose, setPurpose] = useState<PaymentPurpose>("INSPECTION_FEE");
  const [amount, setAmount] = useState<string>("");
  const [expiryDays, setExpiryDays] = useState<number>(7);

  const { data: requestsResponse, isLoading: isLoadingRequests } =
    useGetAllRequests({ limit: 50 });
  const requests: ServiceRequest[] = requestsResponse?.data || [];

  const issuePaymentMutation = useIssuePayment();
  const isSubmitting = issuePaymentMutation.isPending;

  useEffect(() => {
    if (defaultRequestId) {
      setSelectedRequestId(defaultRequestId);
    }
  }, [defaultRequestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!selectedRequestId) {
      toast.add({
        title: "Request Required",
        description: "Please select or specify a service request for this fee.",
        type: "error",
      });
      return;
    }

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.add({
        title: "Invalid Amount",
        description: "Amount must be greater than zero BDT.",
        type: "error",
      });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    try {
      await issuePaymentMutation.mutateAsync({
        requestId: selectedRequestId,
        purpose,
        amount: numericAmount,
        currency: "BDT",
        expiresAt: expiresAt.toISOString(),
      });

      toast.add({
        title: "Municipal Fee Issued",
        description: `Invoice for ৳${numericAmount} BDT has been successfully billed.`,
        type: "success",
      });

      setAmount("");
      if (!defaultRequestId) {
        setSelectedRequestId("");
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to issue payment bill.";
      toast.add({
        title: "Fee Issuance Failed",
        description: message,
        type: "error",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden border-border/80 shadow-2xl bg-card">
        {/* Header with City Branding */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Banknote className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Issue Municipal Fee / Invoice
                <Badge
                  variant="outline"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  Official Billing
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Generate an official fee invoice payable by the citizen via
                bKash gateway.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Service Request Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center justify-between">
              <span>Target Complaint / Service Request</span>
              {defaultRequestNo && (
                <span className="text-xs font-mono text-primary font-medium">
                  {defaultRequestNo}
                </span>
              )}
            </Label>

            {defaultRequestId ? (
              <div className="p-3 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold">
                  <FileText className="size-4 text-primary" />
                  {defaultRequestNo || selectedRequestId}
                </div>
                <Badge variant="outline" className="text-xs">
                  Locked to active case
                </Badge>
              </div>
            ) : (
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                disabled={isLoadingRequests}
              >
                <option value="">-- Choose a Complaint Case --</option>
                {requests.map((req) => (
                  <option key={req.id} value={req.id}>
                    [{req.requestNo}] {req.title.slice(0, 45)}... ({req.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Payment Purpose Cards */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Fee Purpose / Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {PAYMENT_PURPOSES.map((item) => {
                const Icon = item.icon;
                const isSelected = purpose === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPurpose(item.value)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                        : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`size-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {item.label}
                        {isSelected && (
                          <CheckCircle2 className="size-3 text-primary ml-auto" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Amount (BDT) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  ৳
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 font-semibold text-base tracking-tight"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDays" className="text-sm font-semibold">
                Payment Due Window
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="expiryDays"
                  type="number"
                  min="1"
                  max="60"
                  value={expiryDays}
                  onChange={(e) =>
                    setExpiryDays(Math.max(1, Number(e.target.value)))
                  }
                  className="font-medium"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  days from issue
                </span>
              </div>
            </div>
          </div>

          {/* Notice info */}
          <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
            <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Once issued, an official municipal payment order will be
              registered. The citizen will receive an email & in-app
              notification with a direct{" "}
              <span className="font-semibold text-foreground">bKash</span>{" "}
              checkout link.
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !amount || !selectedRequestId}
              className="gap-2 shadow-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Issuing Bill...
                </>
              ) : (
                <>
                  <Banknote className="size-4" />
                  Confirm & Issue Fee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
