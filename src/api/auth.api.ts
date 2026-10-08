import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthTokens,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegistrationPayload,
  ResetPasswordPayload,
  User,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens & { user?: User }>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<AuthTokens & { user?: User }>>(
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
  return apiClient<ApiResponse<AuthTokens & { user?: User }>>(
    "/auth/google-login",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}
