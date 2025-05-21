// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
}

// User interfaces
export interface PersonResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: Role;
  password_hash: string;
}
export enum Role {
  Admin = "Admin",
  Profesor = "Profesor",
  Alumno = "Alumno",
}

// Permission interfaces
export interface PermissionResponse {
  id: string;
  person_id: string;
  dashboard: boolean;
  see_self_history: boolean;
  see_others_history: boolean;
  admin_panel: boolean;
  edit_permissions: boolean;
}

export interface CreatePermissionRequest {
  id: string;
  person_id: string;
  dashboard: boolean;
  see_self_history: boolean;
  see_others_history: boolean;
  admin_panel: boolean;
  edit_permissions: boolean;
}

// Entry interfaces
export interface EntryResponse {
  id: string;
  person_id: string;
  instant: string;
  action: string;
}

export interface CreateEntryRequest {
  id?: string;
  person_id: string;
  instant: string;
  action: string;
}

// Additional interfaces for API communication
export interface ApiError {
  status: string;
  message: string;
}

export interface CreatePersonRequest {
  name: string;
  surname: string;
  email: string;
  password_hash: string;
}
