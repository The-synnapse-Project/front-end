// Role utility functions and constants to handle role naming inconsistencies
import { Role } from "@/models/Permission";

// Display names for each role
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  admin: "Admin",
  profesor: "Teacher",
  alumno: "Student",
};

// CSS classes for styling roles
export const ROLE_STYLE_CLASSES: Record<string, string> = {
  admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  profesor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  alumno: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

// Get display name for a role, safely handles undefined/null values
export function getRoleDisplayName(role?: string | null): string {
  if (!role) return "Unknown";
  return ROLE_DISPLAY_NAMES[role] || "Unknown";
}

// Get CSS classes for styling a role badge
export function getRoleStyleClass(role?: string | null): string {
  if (!role)
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  return (
    ROLE_STYLE_CLASSES[role] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  );
}

// Safe role comparison that works with string values or Role enum
export function isRole(role: any, targetRole: Role | string): boolean {
  if (role === targetRole) return true;

  // Handle string values
  if (typeof role === "string" && typeof targetRole === "string") {
    return role.toLowerCase() === targetRole.toLowerCase();
  }

  // Handle enum values
  const roleValue = typeof role === "string" ? role : role?.toString();
  const targetValue =
    typeof targetRole === "string" ? targetRole : String(targetRole);

  return roleValue === targetValue;
}
