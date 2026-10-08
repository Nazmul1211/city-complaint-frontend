export type UserRole = "CITIZEN" | "STAFF" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "BLOCKED"
  | "SUSPENDED"
  | "DELETED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type AuthProvider = "GOOGLE" | "GITHUB" | "CREDENTIAL";

export type StaffPosition = "MANAGER" | "CASE_OFFICER" | "TECHNICIAN";

export interface CitizenProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentMembership {
  id: string;
  userId: string;
  departmentId: string;
  position: StaffPosition;
  isActive: boolean;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  gender?: Gender | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  citizen?: CitizenProfile | null;
  departmentMemberships?: DepartmentMembership[];
}

export interface UpdateMyProfilePayload {
  name?: string;
  phone?: string;
  citizen?: {
    contactNumber?: string;
    address?: string;
  };
}
