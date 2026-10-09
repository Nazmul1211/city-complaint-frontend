import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CheckoutResponse,
  IssuePaymentPayload,
  Payment,
  PaymentQueryParams,
  RefundPaymentPayload,
} from "@/types";

export function issuePayment(payload: IssuePaymentPayload) {
  return apiClient<ApiResponse<Payment>>("/payments", {
    method: "POST",
    body: payload,
  });
}

export function getMyPayments(params?: PaymentQueryParams) {
  return apiClient<ApiResponse<Payment[]>>("/payments/my-payments", {
    params,
  });
}

export function getAllPayments(params?: PaymentQueryParams) {
  return apiClient<ApiResponse<Payment[]>>("/payments", {
    params,
  });
}

export function getPaymentById(paymentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${paymentId}`);
}

export function initiateCheckout(paymentId: string) {
  return apiClient<ApiResponse<CheckoutResponse>>(
    `/payments/${paymentId}/checkout`,
    {
      method: "POST",
    },
  );
}

export function refundPayment(
  paymentId: string,
  payload: RefundPaymentPayload,
) {
  return apiClient<ApiResponse<Payment>>(`/payments/${paymentId}/refund`, {
    method: "POST",
    body: payload,
  });
}

export function sendPaymentReceipt(paymentId: string) {
  return apiClient<ApiResponse<{ message: string }>>(
    `/payments/${paymentId}/send-receipt`,
    {
      method: "POST",
    },
  );
}
