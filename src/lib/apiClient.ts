import { ofetch } from "ofetch";
import { getAuthCookie } from "./cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  headers: {
    Accept: "application/json",
  },
  onRequest({ options }) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken") || getAuthCookie();

      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        options.headers = headers;
      }
    }
  },
  onResponseError({ response }) {
    const errorData = response._data;
    const backendMessage =
      errorData?.message ||
      (Array.isArray(errorData?.errors) && errorData.errors[0]?.message) ||
      errorData?.error?.message;

    if (backendMessage && typeof backendMessage === "string") {
      const error = new Error(backendMessage);
      (error as unknown as { data: unknown }).data = errorData;
      (error as unknown as { status: number }).status = response.status;
      throw error;
    }
  },
});

export default apiClient;
