"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/models/Permission";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
}

/**
 * A component that protects routes requiring authentication
 * Can also check for specific roles if requiredRole is provided
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated and the status is not loading, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // If session is loaded and a specific role is required but the user doesn't have it
    if (status === "authenticated" && requiredRole && session?.user?.role) {
      const hasPermission = checkUserRole(session?.user?.role, requiredRole);

      if (!hasPermission) {
        // Redirect to appropriate dashboard based on actual role
        if (session.user.role) {
          // Convertir a minúsculas para URLs: Admin → admin, Profesor → profesor, Alumno → alumno
          router.push(`/dashboard/${session.user.role.toLowerCase()}`);
        } else {
          router.push("/");
        }
      }
    }
  }, [status, router, requiredRole, session]);

  // If the session is loading, show a loading state
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light-background dark:bg-dark-background transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md"></div>
        <p className="mt-4 text-light-txt-secondary dark:text-dark-txt-secondary">
          Loading your profile...
        </p>
      </div>
    );
  }

  // If authenticated with correct role (or no role required), render the children
  if (session) {
    // If no specific role is required, or user has the required role
    if (!requiredRole || checkUserRole(session.user.role, requiredRole)) {
      return <>{children}</>;
    }

    // If we get here, the user is authenticated but doesn't have the right role
    // The useEffect above will handle the redirect, but return null for now
    return null;
  }

  // This should never be visible as the useEffect will redirect
  return null;
}

/**
 * Helper function to check if a user has the required role
 */
function checkUserRole(
  userRole: Role | null | undefined,
  requiredRole: Role | Role[] | undefined,
): boolean {
  if (!userRole || !requiredRole) return false;

  if (Array.isArray(requiredRole)) {
    let status = false;
    for (const role of requiredRole) {
      if (status) break;
      status = checkSingleRole(userRole, role);
    }
    return status;
  } else {
    return checkSingleRole(userRole, requiredRole);
  }
}

function checkSingleRole(userRole: Role, requiredRole: Role): boolean {
  if (userRole === Role.PROFESOR && requiredRole == Role.ALUMNO) return true;
  if (userRole === Role.ADMIN && requiredRole == Role.ALUMNO) return true;
  if (userRole === Role.ADMIN && requiredRole == Role.PROFESOR) return true;
  return userRole === requiredRole;
}

/**
 * Higher order component to protect routes with role-based access
 */
export function withRoleAccess(
  Component: React.ComponentType,
  requiredRole?: Role | Role[],
) {
  return function ProtectedRoute(props: any) {
    return (
      <AuthGuard requiredRole={requiredRole}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Type for permissions
type UserPermissions = {
  dashboard: boolean;
  seeSelfHistory: boolean;
  seeOthersHistory: boolean;
  adminPanel: boolean;
  editPermissions: boolean;
};

/**
 * Hook to get authentication state
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
    role: session?.user?.role,
    permissions: session?.user?.permissions,
    hasPermission: (permission: keyof UserPermissions) => {
      return permission in (session?.user?.permissions || {})
        ? !!session?.user?.permissions?.[
            permission as keyof typeof session.user.permissions
          ]
        : false;
    },
  };
}
