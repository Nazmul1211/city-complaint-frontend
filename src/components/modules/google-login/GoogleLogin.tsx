"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";

import { setAuthCookies } from "@/lib/cookie";

interface GoogleLoginComponentProps {
  onSuccess?: () => void;
}

export default function GoogleLoginComponent({
  onSuccess,
}: GoogleLoginComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutate: googleLogin } = useGoogleOAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Google OAuth Failed",
        description: "Missing credential token. Please try again.",
        type: "error",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: async (res) => {
          const accessToken = res?.data?.accessToken;
          const refreshToken = res?.data?.refreshToken;
          let userRole = res?.data?.user?.role;

          if (accessToken && typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }
            setAuthCookies(accessToken, refreshToken);

            if (!userRole) {
              try {
                const base64Url = accessToken.split(".")[1];
                if (base64Url) {
                  const base64 = base64Url
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");
                  const payload = JSON.parse(window.atob(base64));
                  userRole = payload?.role;
                }
              } catch {}
            }
          }

          toast.add({
            title: "Logged in Successfully",
            description: "Welcome to CityCare Civic Portal",
            type: "success",
          });

          await queryClient.invalidateQueries({ queryKey: ["user"] });

          if (onSuccess) {
            onSuccess();
            return;
          }

          const redirectUrl = searchParams?.get("redirect");
          if (redirectUrl) {
            router.push(redirectUrl);
            return;
          }

          const resolvedRole = userRole || "CITIZEN";
          if (resolvedRole === "ADMIN" || resolvedRole === "SUPER_ADMIN") {
            router.push("/admin");
          } else if (resolvedRole === "STAFF") {
            router.push("/staff");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err: Error) => {
          const message =
            err?.message || "Authentication failed. Please try again.";

          // If the backend returns that the email is not verified
          if (
            message.toLowerCase().includes("email not verified") ||
            message.toLowerCase().includes("not verified")
          ) {
            toast.add({
              title: "Email Verification Required",
              description:
                "Your registered account email has not been verified yet. Please complete verification with your OTP code.",
              type: "warning",
            });
            router.push("/verify-email");
            return;
          }

          toast.add({
            title: "Google Sign-In Failed",
            description: message,
            type: "error",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Google Sign-In Failed",
      description: "Unable to complete Google authentication.",
      type: "error",
    });
  };

  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        theme="outline"
        shape="pill"
        text="continue_with"
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </div>
  );
}
