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
  checkoutUrl?: string | null;
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
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  request?: {
    id: string;
    requestNo: string;
    title: string;
    status: string;
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
