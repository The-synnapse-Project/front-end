"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-full">
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
