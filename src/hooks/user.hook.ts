import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  adminDeleteUser,
  deleteMyAccount,
  getAllUsers,
  type UserFilterParams,
  updateMyProfile,
  uploadProfileImage,
} from "@/api";
import { toast } from "@/components/ui/toast";
import { clearAuthCookies } from "@/lib/cookie";
import type { ApiResponse, UpdateMyProfilePayload, User } from "@/types";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) => updateMyProfile(payload),
    onSuccess: (response: ApiResponse<User>) => {
      if (response.data) {
        queryClient.setQueryData(["user"], response);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.add({
        title: "Profile Updated",
        description:
          "Your citizen profile details have been saved successfully.",
      });
    },
    onError: (err: ApiError) => {
      const message =
        err?.data?.message || err?.message || "Failed to update profile";
      toast.add({
        title: "Update Failed",
        description: message,
      });
    },
  });
}

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadProfileImage(formData),
    onSuccess: (response: ApiResponse<User>) => {
      if (response.data) {
        queryClient.setQueryData(["user"], response);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.add({
        title: "Avatar Updated",
        description: "Your profile photo has been successfully uploaded.",
      });
    },
    onError: (err: ApiError) => {
      const message =
        err?.data?.message || err?.message || "Failed to upload profile image";
      toast.add({
        title: "Upload Failed",
        description: message,
      });
    },
  });
}

export function useDeleteMyAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteMyAccount(),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("demo_user");
        clearAuthCookies();
      }
      queryClient.removeQueries({ queryKey: ["user"] });
      toast.add({
        title: "Account Deleted",
        description: "Your citizen account has been closed permanently.",
      });
      router.push("/login");
    },
    onError: (err: ApiError) => {
      const message =
        err?.data?.message || err?.message || "Failed to delete account";
      toast.add({
        title: "Deletion Failed",
        description: message,
      });
    },
  });
}

export function useGetUsers(params?: UserFilterParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.add({
        title: "User Deactivated",
        description: "The user account has been deactivated successfully.",
      });
    },
    onError: (err: ApiError) => {
      const message =
        err?.data?.message || err?.message || "Failed to deactivate user";
      toast.add({
        title: "Action Failed",
        description: message,
      });
    },
  });
}
