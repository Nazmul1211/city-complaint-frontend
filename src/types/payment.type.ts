export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentPurpose =
  | "SERVICE_FEE"
  | "INSPECTION_FEE"
  | "PENALTY"
  | "PERMIT_FEE"
  | "APPLICATION_FEE"
  | "OTHER";

export type PaymentGateway = "BKASH" | "SSLCOMMERZ" | "CASH";

export type PaymentMethod = "BKASH" | "CARD" | "NET_BANKING" | "CASH";

export interface PaymentTransaction {
  id: string;
  paymentId: string;
  gateway: PaymentGateway;
  method?: PaymentMethod;
  amount: number | string;
  currency: string;
  status: string;
  gatewaySessionId?: string | null;
  gatewayTransactionId?: string | null;
  checkoutUrl?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  requestId: string;
  issuedById: string;
  purpose: PaymentPurpose;
  amount: number | string;
  currency: string;
  status: PaymentStatus;
  paidAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  request?: {
    id: string;
    requestNo: string;
    title: string;
    status: string;
    citizen?: {
      id: string;
      name?: string;
      email?: string;
      contactNumber?: string;
    };
  };
  issuedBy?: {
    id: string;
    name: string;
    email: string;
  };
  transactions?: PaymentTransaction[];
}

export interface IssuePaymentPayload {
  requestId: string;
  purpose: PaymentPurpose;
  amount: number;
  currency?: string;
  expiresAt?: string;
}

export interface CheckoutResponse {
  paymentId: string;
  transactionId: string;
  gatewaySessionId: string;
  checkoutUrl: string;
  amount: number | string;
  currency: string;
}

export interface PaymentQueryParams {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: PaymentStatus;
  requestId?: string;
  purpose?: PaymentPurpose;
}

export interface RefundPaymentPayload {
  amount?: number;
  reason: string;
  sku?: string;
}
