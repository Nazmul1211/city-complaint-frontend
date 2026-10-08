import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  GoogleLoginPayload,
  LoginPayload,
  RegistrationPayload,
  User,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<{ accessToken: string; user: User }>>(
    "/auth/login",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<{ accessToken: string; user: User }>>(
    "/auth/verify-email",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/users/me");
}

export function googleOAuth(payload: GoogleLoginPayload) {
  return apiClient<ApiResponse<{ accessToken: string; user: User }>>(
    "/auth/google-login",
    {
      method: "POST",
      body: payload,
    },
  );
}
