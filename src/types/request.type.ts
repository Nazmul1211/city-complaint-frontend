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
  code?: string;
  description?: string | null;
  departmentId: string;
  paymentRequired?: boolean;
  defaultFeeAmount?: number | string | null;
  currency?: string;
  isActive: boolean;
  department?: Department;
  slaPolicy?: SlaPolicy | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SlaPolicy {
  id: string;
  categoryId: string;
  responseWithinHours?: number;
  resolutionWithinHours?: number;
  responseHours?: number;
  resolutionHours?: number;
  reopenWindowHours?: number;
  isActive?: boolean;
}

export interface Ward {
  id: string;
  wardNumber?: string;
  code?: string;
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
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    members?: number;
    categories?: number;
  };
  categories?: Category[];
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
  authorId?: string;
  staffId?: string;
  note?: string;
  description?: string;
  visibleToCitizen?: boolean;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  staff?: User;
}

export interface TimelineEvent {
  id?: string;
  requestId?: string;
  type?: string;
  eventType?: string;
  title?: string;
  note?: string;
  description?: string | null;
  timestamp?: string;
  createdAt?: string;
  actorId?: string | null;
  actor?:
    | {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string | null;
      }
    | User;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  meta?: Record<string, unknown>;
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
  reportedLocation?: {
    id?: string;
    wardId?: string;
    addressLine?: string;
    landmark?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    ward?: Ward;
  };
  currentDepartment?: Department;
  currentDepartmentId?: string;
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

export interface RequestFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  categoryId?: string;
  departmentId?: string;
  wardId?: string;
  citizenId?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
