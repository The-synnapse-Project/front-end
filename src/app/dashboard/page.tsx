"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect based on user role
      switch (role) {
        case Role.ADMIN:
          router.replace("/dashboard/admin");
          break;
        case Role.PROFESOR:
          router.replace("/dashboard/profesor");
          break;
        case Role.ALUMNO:
          router.replace("/dashboard/alumno");
          break;
        default:
          // Default to alumno if role not found
          router.replace("/dashboard/alumno");
      }
    } else if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, role, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md"></div>
      <p className="mt-4 text-light-txt-secondary dark:text-dark-txt-secondary">
        Cargando tu panel...
      </p>
    </div>
  );
}
