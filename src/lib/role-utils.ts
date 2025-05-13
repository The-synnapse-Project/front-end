// Role utility functions and constants to handle role naming inconsistencies
import { Role } from "@/models/Permission";

// Display names for each role
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  // Valores en minúsculas (compatibilidad anterior)
  admin: "Admin",
  profesor: "Teacher",
  alumno: "Student",
  // Valores con primera letra mayúscula (formato actual en el backend)
  Admin: "Admin",
  Profesor: "Teacher",
  Alumno: "Student",
};

// CSS classes for styling roles
export const ROLE_STYLE_CLASSES: Record<string, string> = {
  // Valores en minúsculas (compatibilidad anterior)
  admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  profesor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  alumno: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  // Valores con primera letra mayúscula (formato actual en el backend)
  Admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Profesor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Alumno: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
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

// Convert a permission set to a role
export function getEffectiveRole(permission: {
  adminPanel: boolean;
  editPermissions: boolean;
  seeOthersHistory: boolean;
}): Role {
  if (permission.adminPanel && permission.editPermissions) {
    return Role.ADMIN;
  } else if (permission.seeOthersHistory) {
    return Role.PROFESOR;
  } else {
    return Role.ALUMNO;
  }
}

// Check if the user has admin privileges
export function isAdmin(role?: string | null): boolean {
  return role === Role.ADMIN;
}

// Check if the user has teacher privileges
export function isTeacher(role?: string | null): boolean {
  return role === Role.PROFESOR;
}

// Check if the user has student privileges
export function isStudent(role?: string | null): boolean {
  return role === Role.ALUMNO;
}

// Get permissions based on role for new users
export function getDefaultPermissionsForRole(role: Role) {
  switch (role) {
    case Role.ADMIN:
      return {
        dashboard: true,
        seeSelfHistory: true,
        seeOthersHistory: true,
        adminPanel: true,
        editPermissions: true,
      };
    case Role.PROFESOR:
      return {
        dashboard: true,
        seeSelfHistory: true,
        seeOthersHistory: true,
        adminPanel: false,
        editPermissions: false,
      };
    case Role.ALUMNO:
    default:
      return {
        dashboard: true,
        seeSelfHistory: true,
        seeOthersHistory: false,
        adminPanel: false,
        editPermissions: false,
      };
  }
}
