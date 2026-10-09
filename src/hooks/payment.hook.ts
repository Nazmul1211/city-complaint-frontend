import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayments,
  getMyPayments,
  getPaymentById,
  initiateCheckout,
  issuePayment,
  refundPayment,
  sendPaymentReceipt,
} from "@/api/payment.api";
import type {
  IssuePaymentPayload,
  PaymentQueryParams,
  RefundPaymentPayload,
} from "@/types";

export function useMyPayments(params?: PaymentQueryParams) {
  return useQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });
}

export function useAllPayments(params?: PaymentQueryParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getAllPayments(params),
  });
}

export function useGetPaymentById(paymentId: string) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });
}

export function useIssuePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IssuePaymentPayload) => issuePayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useInitiateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => initiateCheckout(paymentId),
    onSuccess: (_data, paymentId) => {
      queryClient.invalidateQueries({ queryKey: ["payment", paymentId] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: RefundPaymentPayload;
    }) => refundPayment(paymentId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payment", variables.paymentId],
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
    },
  });
}

export function useSendPaymentReceipt() {
  return useMutation({
    mutationFn: (paymentId: string) => sendPaymentReceipt(paymentId),
  });
}
