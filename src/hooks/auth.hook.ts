import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";

import { clearAuthCookies, getAuthCookie } from "@/lib/cookie";

function parseJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,
    onSettled: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("demo_user");
        clearAuthCookies();
      }
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (typeof window !== "undefined") {
        const token = getAuthCookie();
        if (!token) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("demo_user");
          throw new Error("No authentication cookie found");
        }
      }

      try {
        return await getMe();
      } catch (err) {
        if (typeof window !== "undefined") {
          const token = getAuthCookie();
          if (token) {
            const payload = parseJwtPayload(token);
            if (payload?.userId) {
              return {
                success: true,
                statusCode: 200,
                message: "User session from token",
                data: {
                  id: payload.userId,
                  name: payload.name || "Civic Citizen",
                  email: payload.email || "citizen@citycomplaint.gov",
                  role: payload.role || "CITIZEN",
                  status: "ACTIVE" as const,
                  emailVerified: true,
                  avatarUrl: null,
                  avatarPublicId: null,
                  phone: null,
                  citizen: null,
                  authProvider: "CREDENTIAL" as const,
                  isDeleted: false,
                  deletedAt: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              };
            }
          }
        }
        throw err;
      }
    },
    retry: false,
  });
}
