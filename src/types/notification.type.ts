export type NotificationType =
  | "REQUEST_CREATED"
  | "REQUEST_ASSIGNED"
  | "STATUS_CHANGED"
  | "WORK_UPDATE_ADDED"
  | "FEEDBACK_REQUESTED"
  | "PAYMENT_REQUIRED"
  | "PAYMENT_SUCCESSFUL";

export interface NotificationPayload {
  requestId?: string;
  requestNo?: string;
  title?: string;
  status?: string;
  oldStatus?: string;
  newStatus?: string;
  departmentName?: string;
  amount?: number | string;
  currency?: string;
  message?: string;
  note?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  requestId: string;
  type: NotificationType;
  payload: NotificationPayload;
  readAt: string | null;
  createdAt: string;
  request?: {
    id: string;
    requestNo: string;
    title: string;
    status: string;
  };
}

export interface NotificationFilterParams {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}
