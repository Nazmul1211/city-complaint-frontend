"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { getAuthCookie } from "@/lib/cookie";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    const token = getAuthCookie();
    if (!token) {
      router.replace("/login");
      return;
    }
    if (isPending) {
      return;
    }
    if (isError || !user) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}
