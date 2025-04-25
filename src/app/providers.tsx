"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/Components/ThemeContext";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider
      // Re-fetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
      // Re-fetch session when window focuses
      refetchOnWindowFocus={true}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
