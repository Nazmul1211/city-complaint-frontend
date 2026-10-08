"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAuthProvider from "./google.provider";
import QueryProviders from "./query.provider";
import { ThemeProvider } from "./theme.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <GoogleAuthProvider>
        <QueryProviders>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProviders>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
}
