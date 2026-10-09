"use client";

import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileCheck2,
  FileText,
  Mail,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { TablePagination } from "@/components/ui/table-pagination";
import { toast } from "@/components/ui/toast";
import {
  useAllPayments,
  useGetMe,
  useInitiateCheckout,
  useMyPayments,
  useSendPaymentReceipt,
} from "@/hooks";
import type { Payment, PaymentPurpose, PaymentStatus } from "@/types";
import { IssuePaymentModal } from "./issue-payment-modal";

const SKELETON_ROWS = [
  "sk-pay-1",
  "sk-pay-2",
  "sk-pay-3",
  "sk-pay-4",
  "sk-pay-5",
];

const PURPOSE_LABELS: Record<
  PaymentPurpose,
  { label: string; icon: typeof Banknote; color: string }
> = {
  INSPECTION_FEE: {
    label: "Site Inspection Fee",
    icon: Clock,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  PERMIT_FEE: {
    label: "Permit / Road Cutting",
    icon: FileText,
    color:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  SERVICE_FEE: {
    label: "Municipal Service Fee",
    icon: Banknote,
    color:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  PENALTY: {
    label: "Municipal Code Penalty",
    icon: ShieldAlert,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  APPLICATION_FEE: {
    label: "Application Processing",
    icon: FileCheck2,
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  OTHER: {
    label: "Official Surcharge",
    icon: Banknote,
    color: "bg-muted text-muted-foreground border-border/60",
  },
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "PAID":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
        >
          <CheckCircle2 className="size-3" />
          Paid
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium animate-pulse"
        >
          <Clock className="size-3" />
          Pending Due
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium"
        >
          <AlertTriangle className="size-3" />
          Failed
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 font-medium"
        >
          <XCircle className="size-3" />
          Cancelled
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 bg-muted text-muted-foreground border-border/60 font-medium"
        >
          <Clock className="size-3" />
          Expired
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-medium"
        >
          <RefreshCw className="size-3" />
          Refunded
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function PaymentCallbackBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const trxId = searchParams.get("trxId");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !status) {
    return null;
  }

  if (status === "success") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                Municipal Fee Payment Confirmed!
                <Sparkles className="size-4 text-emerald-500" />
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Your payment has been successfully verified via the bKash
                payment gateway.
                {trxId && (
                  <span className="ml-1 font-mono font-semibold text-foreground">
                    TrxID: {trxId}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (status === "cancel") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Payment Session Cancelled
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                The bKash transaction was cancelled. Your invoice remains
                pending until the due date. You can retry paying at any time.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (status === "failure") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent p-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Payment Verification Failed
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                The bKash checkout was unsuccessful or rejected. Please try
                again or contact municipal billing assistance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export function PaymentList() {
  const { data: userResponse } = useGetMe();
  const currentUser = userResponse?.data;
  const isPrivileged =
    currentUser?.role === "ADMIN" || currentUser?.role === "STAFF";

  const [activeTab, setActiveTab] = useState<
    "ALL" | "PENDING" | "PAID" | "FAILED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [purposeFilter, setPurposeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected payment for receipt preview
  const [selectedReceiptPayment, setSelectedReceiptPayment] =
    useState<Payment | null>(null);

  // Fee issuance modal for staff/admin
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Active bKash checkout loading ID
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(
    null,
  );

  // Queries
  const citizenQuery = useMyPayments();
  const privilegedQuery = useAllPayments();

  const activeQuery = isPrivileged ? privilegedQuery : citizenQuery;
  const { data: paymentsResponse, isLoading, refetch } = activeQuery;
  const payments: Payment[] = paymentsResponse?.data || [];

  // Mutations
  const checkoutMutation = useInitiateCheckout();
  const sendReceiptMutation = useSendPaymentReceipt();

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let paidCount = 0;
    let pendingCount = 0;

    for (const p of payments) {
      const numAmount = Number(p.amount) || 0;
      if (p.status === "PAID") {
        totalPaid += numAmount;
        paidCount++;
      } else if (p.status === "PENDING") {
        totalPending += numAmount;
        pendingCount++;
      }
    }

    return {
      totalCount: payments.length,
      totalPaid,
      totalPending,
      paidCount,
      pendingCount,
    };
  }, [payments]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      // Tab status filter
      if (activeTab === "PENDING" && item.status !== "PENDING") return false;
      if (activeTab === "PAID" && item.status !== "PAID") return false;
      if (
        activeTab === "FAILED" &&
        item.status !== "FAILED" &&
        item.status !== "CANCELLED" &&
        item.status !== "EXPIRED"
      ) {
        return false;
      }

      // Purpose filter
      if (purposeFilter !== "ALL" && item.purpose !== purposeFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = Boolean(item.id?.toLowerCase().includes(query));
        const matchReqNo = Boolean(
          item.request?.requestNo?.toLowerCase().includes(query),
        );
        const matchTitle = Boolean(
          item.request?.title?.toLowerCase().includes(query),
        );
        const matchPurpose = Boolean(
          item.purpose?.toLowerCase().includes(query),
        );
        if (!matchId && !matchReqNo && !matchTitle && !matchPurpose) {
          return false;
        }
      }

      return true;
    });
  }, [payments, activeTab, purposeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, currentPage]);

  // Initiate bKash Checkout
  const handlePayWithBkash = async (payment: Payment) => {
    try {
      setCheckoutLoadingId(payment.id);
      toast.add({
        title: "Initiating bKash Checkout",
        description: `Preparing session for ৳${payment.amount} BDT...`,
        type: "info",
      });

      const response = await checkoutMutation.mutateAsync(payment.id);
      const checkoutUrl = response?.data?.checkoutUrl;

      if (checkoutUrl) {
        toast.add({
          title: "Redirecting to bKash Gateway",
          description: "Navigating to secure bKash payment portal...",
          type: "success",
        });
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Payment gateway URL not provided.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to launch bKash checkout.";
      toast.add({
        title: "Checkout Error",
        description: message,
        type: "error",
      });
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  // Resend / Email Receipt
  const handleSendReceipt = async (paymentId: string) => {
    try {
      await sendReceiptMutation.mutateAsync(paymentId);
      toast.add({
        title: "Receipt Sent",
        description: "Official payment receipt email dispatched successfully.",
        type: "success",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not send receipt email.";
      toast.add({
        title: "Delivery Failed",
        description: message,
        type: "error",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.add({
      title: "Copied to Clipboard",
      description: text,
      type: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* Return Callback Alert with Suspense */}
      <Suspense fallback={null}>
        <PaymentCallbackBanner />
      </Suspense>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoices */}
        <Card className="border-border/60 shadow-xs bg-card hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Invoiced
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {isLoading ? "--" : metrics.totalCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Municipal service bills
              </p>
            </div>
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              <FileText className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Paid / Collected */}
        <Card className="border-border/60 shadow-xs bg-card hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Paid Amount
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                ৳{isLoading ? "--" : metrics.totalPaid.toLocaleString()}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.paidCount} cleared payment
                {metrics.paidCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Dues */}
        <Card className="border-border/60 shadow-xs bg-card hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Pending Fees Due
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
                ৳{isLoading ? "--" : metrics.totalPending.toLocaleString()}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.pendingCount} invoice
                {metrics.pendingCount === 1 ? "" : "s"} awaiting bKash
              </p>
            </div>
            <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Gateway Security Badge */}
        <Card className="border-border/60 shadow-xs bg-gradient-to-br from-[#E2136E]/10 via-card to-card hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Payment Gateway
              </p>
              <h3 className="text-lg font-bold tracking-tight text-[#E2136E] mt-1 flex items-center gap-1.5">
                bKash Tokenized
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                256-bit encrypted checkout
              </p>
            </div>
            <div className="size-11 rounded-xl bg-[#E2136E]/15 text-[#E2136E] flex items-center justify-center shadow-xs font-bold text-xs">
              bKash
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border/60 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { key: "ALL", label: "All Bills" },
              { key: "PENDING", label: `Pending (${metrics.pendingCount})` },
              { key: "PAID", label: `Paid (${metrics.paidCount})` },
              { key: "FAILED", label: "Failed / Other" },
            ] as const
          ).map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className="text-xs font-medium rounded-lg whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search, Filter & Issue Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by invoice or case..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 text-xs h-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-1">
            <select
              value={purposeFilter}
              onChange={(e) => {
                setPurposeFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by purpose"
              className="h-9 px-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Purposes</option>
              <option value="INSPECTION_FEE">Inspection Fee</option>
              <option value="PERMIT_FEE">Permit Fee</option>
              <option value="SERVICE_FEE">Service Charge</option>
              <option value="PENALTY">Penalty</option>
              <option value="APPLICATION_FEE">Application Fee</option>
              <option value="OTHER">Other Surcharge</option>
            </select>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => refetch()}
              title="Refresh payments"
              className="size-9"
            >
              <RefreshCw className="size-3.5" />
            </Button>

            {isPrivileged && (
              <Button
                size="sm"
                onClick={() => setIsIssueModalOpen(true)}
                className="gap-1.5 text-xs h-9 font-medium shadow-xs"
              >
                <Plus className="size-3.5" />
                Issue Fee
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Invoices List / Table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {SKELETON_ROWS.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/40"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="size-12 rounded-xl bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
              <Banknote className="size-6" />
            </div>
            <h4 className="text-base font-semibold text-foreground">
              No Municipal Invoices Found
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              {searchQuery || purposeFilter !== "ALL" || activeTab !== "ALL"
                ? "No invoices match your selected filters. Try clearing search criteria."
                : "You do not have any municipal fee obligations or bills on file at this time."}
            </p>
            {isPrivileged && (
              <Button
                size="sm"
                onClick={() => setIsIssueModalOpen(true)}
                className="mt-4 gap-2 text-xs"
              >
                <Plus className="size-3.5" />
                Issue First Fee
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground font-semibold text-xs border-b border-border/60 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Invoice & Date</th>
                  <th className="px-5 py-3.5">Complaint Case</th>
                  <th className="px-5 py-3.5">Fee Purpose</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedPayments.map((item) => {
                  const purposeMeta =
                    PURPOSE_LABELS[item.purpose] || PURPOSE_LABELS.OTHER;
                  const PurposeIcon = purposeMeta.icon;
                  const isPending = item.status === "PENDING";
                  const isPaid = item.status === "PAID";
                  const isCheckingOut = checkoutLoadingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {/* Invoice ID & Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            INV-{item.id.slice(0, 8).toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.id)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Copy full Invoice ID"
                          >
                            <Copy className="size-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>

                      {/* Complaint Case */}
                      <td className="px-5 py-4">
                        {item.request ? (
                          <div>
                            <span className="font-mono text-xs font-semibold text-primary">
                              {item.request.requestNo}
                            </span>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                              {item.request.title}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            General Municipality
                          </span>
                        )}
                      </td>

                      {/* Fee Purpose */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`gap-1.5 text-xs py-1 ${purposeMeta.color}`}
                        >
                          <PurposeIcon className="size-3" />
                          {purposeMeta.label}
                        </Badge>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-foreground">
                          ৳{Number(item.amount).toLocaleString()}{" "}
                          <span className="text-[11px] font-normal text-muted-foreground">
                            BDT
                          </span>
                        </div>
                        {item.expiresAt && isPending && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">
                            Due by{" "}
                            {new Date(item.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <Button
                              size="sm"
                              onClick={() => handlePayWithBkash(item)}
                              disabled={isCheckingOut}
                              className="bg-[#E2136E] hover:bg-[#C2105D] text-white font-semibold text-xs h-8 px-3 shadow-sm gap-1.5"
                            >
                              {isCheckingOut ? (
                                <>
                                  <Spinner className="size-3.5 text-white" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Banknote className="size-3.5 text-white" />
                                  Pay with bKash
                                </>
                              )}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReceiptPayment(item)}
                            className="h-8 text-xs gap-1"
                          >
                            <Eye className="size-3.5" />
                            {isPaid ? "Receipt" : "Details"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/60">
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Official Receipt / Invoice Details Modal */}
      {selectedReceiptPayment && (
        <Dialog
          open={Boolean(selectedReceiptPayment)}
          onOpenChange={(open) => !open && setSelectedReceiptPayment(null)}
        >
          <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-border/80 shadow-2xl bg-card">
            {/* Receipt Modal Header */}
            <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    Official Municipal Receipt
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    City Public Works & Infrastructure Financial Records
                  </DialogDescription>
                </div>
                <StatusBadge status={selectedReceiptPayment.status} />
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Receipt Body */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">
                    Invoice Reference:
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    INV-{selectedReceiptPayment.id.slice(0, 12).toUpperCase()}
                  </span>
                </div>

                {selectedReceiptPayment.request && (
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">
                      Service Request:
                    </span>
                    <span className="font-mono font-semibold text-primary">
                      {selectedReceiptPayment.request.requestNo}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">
                    Fee Classification:
                  </span>
                  <span className="font-semibold text-foreground">
                    {PURPOSE_LABELS[selectedReceiptPayment.purpose]?.label ||
                      selectedReceiptPayment.purpose}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="text-foreground">
                    {new Date(
                      selectedReceiptPayment.createdAt,
                    ).toLocaleString()}
                  </span>
                </div>

                {selectedReceiptPayment.paidAt && (
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">
                      Payment Confirmed:
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {new Date(selectedReceiptPayment.paidAt).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Amount Highlight */}
                <div className="flex items-center justify-between pt-1 text-sm font-bold">
                  <span className="text-foreground">Total Billed:</span>
                  <span className="text-lg text-primary">
                    ৳{Number(selectedReceiptPayment.amount).toLocaleString()}{" "}
                    BDT
                  </span>
                </div>
              </div>

              {/* Transaction Logs (if transactions exist) */}
              {selectedReceiptPayment.transactions &&
                selectedReceiptPayment.transactions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Gateway Transaction Trail
                    </h5>
                    <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5 text-xs">
                      {selectedReceiptPayment.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-muted-foreground">
                            {tx.gateway} ({tx.status})
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {tx.gatewayTransactionId ||
                              tx.gatewaySessionId ||
                              tx.id.slice(0, 8)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <DialogFooter className="p-4 border-t border-border/60 bg-muted/10 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs"
              >
                <Printer className="size-3.5" />
                Print Voucher
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReceipt(selectedReceiptPayment.id)}
                disabled={sendReceiptMutation.isPending}
                className="gap-1.5 text-xs"
              >
                <Mail className="size-3.5" />
                Email Copy
              </Button>

              {selectedReceiptPayment.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => handlePayWithBkash(selectedReceiptPayment)}
                  disabled={checkoutLoadingId === selectedReceiptPayment.id}
                  className="bg-[#E2136E] hover:bg-[#C2105D] text-white text-xs gap-1.5 ml-auto"
                >
                  <Banknote className="size-3.5" />
                  Pay Now
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Fee Issuance Modal */}
      <IssuePaymentModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
