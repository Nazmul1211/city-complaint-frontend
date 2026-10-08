import type { User } from "./user.type";

export type RequestType = "COMPLAINT" | "SERVICE" | "INFORMATION";

export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type RequestStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PENDING"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED"
  | "REJECTED";

export interface Category {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  departmentId: string;
  isActive: boolean;
  slaPolicy?: SlaPolicy | null;
}

export interface SlaPolicy {
  id: string;
  categoryId: string;
  responseHours: number;
  resolutionHours: number;
}

export interface Ward {
  id: string;
  wardNumber: string;
  name: string;
  city: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isActive: boolean;
}

export interface MediaAttachment {
  id: string;
  requestId: string;
  url: string;
  publicId?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  caption?: string | null;
  createdAt: string;
}

export interface WorkUpdate {
  id: string;
  requestId: string;
  staffId: string;
  description: string;
  createdAt: string;
  staff?: User;
}

export interface TimelineEvent {
  id: string;
  requestId: string;
  eventType: string;
  title: string;
  description?: string | null;
  actorId?: string | null;
  createdAt: string;
  actor?: User;
}

export interface ServiceRequest {
  id: string;
  requestNo: string;
  title: string;
  description: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  wardId: string;
  categoryId: string;
  citizenId: string;
  addressLine: string;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  responseDueAt?: string | null;
  resolutionDueAt?: string | null;
  firstRespondedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  ward?: Ward;
  citizen?: {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber?: string | null;
    user?: User;
  };
  attachments?: MediaAttachment[];
  workUpdates?: WorkUpdate[];
}

export interface CreateServiceRequestPayload {
  categoryId: string;
  title: string;
  description: string;
  type: RequestType;
  priority?: RequestPriority;
  wardId: string;
  addressLine: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}
