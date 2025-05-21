// API client for interacting with the Rocket backend
import { processApiError, createApiError } from "./error-handler";

// Update this with your Rocket API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
import { createHmac } from "crypto";

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

// Generic fetch wrapper with improved error handling
async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit,
): Promise<any> {
  try {
    if (options) {
      const uri = new URL(url).pathname;
      options.headers = {
        ...options.headers,
        "X-Syn-Api-Key": calc_api_key(uri),
      };
    }
    const response = await fetch(url, options);

    // Check if the request was successful
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If JSON parsing fails, use status text
        errorData = { message: response.statusText };
      }

      throw createApiError(
        response.status,
        errorData.message || response.statusText,
        errorData,
      );
    }

    // Check if response is empty
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error: any) {
    // If it's already an ApiError, rethrow it
    if (error && error.type) {
      throw error;
    }

    // Process and rethrow other errors
    throw processApiError(error);
  }
}

export async function loginWithCredentials(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// User functions

/**
 * Get a person by ID from the API
 */
export async function getPerson(id: string): Promise<PersonResponse | null> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/api/person/${id}`);
  } catch (error) {
    console.error("Error getting person:", error);
    return null;
  }
}

/**
 * Get all persons from the API
 * @returns Array of person objects
 */
export async function getAllPersons(): Promise<PersonResponse[]> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/person`);
}

export async function createPerson(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
}): Promise<PersonResponse | null> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/api/person`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error creating person:", error);
    return null;
  }
}

export async function updatePerson(
  id: string,
  data: {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    role?: string;
  },
): Promise<PersonResponse> {
  let real_data = await getPerson(id);
  if (real_data) {
    data = { ...real_data, ...data };
  }

  return await fetchWithErrorHandling(`${API_BASE_URL}/api/person/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deletePerson(id: string): Promise<void> {
  await fetchWithErrorHandling(`${API_BASE_URL}/api/person/${id}`, {
    method: "DELETE",
  });
}

// Permission functions

export async function getAllPermissions(): Promise<PermissionResponse[]> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/permission`);
}

export async function getPermission(id: string): Promise<PermissionResponse> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/permission/${id}`);
}

export async function getPermissionByPerson(
  personId: string,
): Promise<PermissionResponse> {
  return await fetchWithErrorHandling(
    `${API_BASE_URL}/api/permission/by-person/${personId}`,
  );
}

export async function createPermission(
  data: CreatePermissionRequest,
): Promise<PermissionResponse> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/permission`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updatePermission(
  id: string,
  data: Partial<CreatePermissionRequest>,
): Promise<PermissionResponse> {
  let real_data = await getPermission(id);
  if (real_data) {
    data = { ...real_data, ...data };
  }
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/permission/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deletePermission(id: string): Promise<void> {
  await fetchWithErrorHandling(`${API_BASE_URL}/api/permission/${id}`, {
    method: "DELETE",
  });
}

/**
 * Generate a password hash for users created from Google authentication
 * In a real system, this should be done on the server side
 */
export function generateSecureToken(): string {
  const length = 32;
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Register a new user
 */
export async function register(
  name: string,
  surname: string,
  email: string,
  password: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        surname,
        email,
        password,
      }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
}

/**
 * Change password for a user
 */
export async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      },
    );
  } catch (error) {
    console.error("Change password error:", error);
    return null;
  }
}

// Entry functions

export async function getAllEntries(): Promise<EntryResponse[]> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/entry`);
}

export async function getEntry(id: string): Promise<EntryResponse> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/entry/${id}`);
}

export async function getEntriesByPerson(
  personId: string,
): Promise<EntryResponse[]> {
  return await fetchWithErrorHandling(
    `${API_BASE_URL}/api/entry/by-person/${personId}`,
  );
}

export async function getEntriesByDate(date: string): Promise<EntryResponse[]> {
  return await fetchWithErrorHandling(
    `${API_BASE_URL}/api/entry/by-date/${date}`,
  );
}

export async function getEntriesByPersonAndDate(
  personId: string,
  date: string,
): Promise<EntryResponse[]> {
  return await fetchWithErrorHandling(
    `${API_BASE_URL}/api/entry/by-date/${date}/${personId}`,
  );
}

export async function createEntry(data: {
  person_id: string;
  action: string;
}): Promise<EntryResponse> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/entry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateEntry(
  id: string,
  data: { person_id?: string; instant?: string; action?: string },
): Promise<EntryResponse> {
  let real_data = await getEntry(id);
  if (real_data) {
    data = { ...real_data, ...data };
  }
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/entry/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteEntry(id: string): Promise<void> {
  await fetchWithErrorHandling(`${API_BASE_URL}/api/entry/${id}`, {
    method: "DELETE",
  });
}

/**
 * Export attendance data for a specific date range
 * Note: This is a helper function that uses the existing API endpoints
 */
export async function exportAttendanceData(
  startDate: string,
  endDate: string,
  format: "csv" | "json" = "json",
): Promise<{ data: string; filename: string }> {
  try {
    // Get all entries for each day in the date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allEntries: EntryResponse[] = [];

    // Loop through each day in the range
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const entries = await getEntriesByDate(dateStr);
      allEntries.push(...entries);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Format the data
    if (format === "csv") {
      const csvContent = [
        "ID,Person ID,Date,Time,Action",
        ...allEntries.map((entry) => {
          const date = new Date(entry.instant);
          return `${entry.id},${
            entry.person_id
          },${date.toLocaleDateString()},${date.toLocaleTimeString()},${
            entry.action
          }`;
        }),
      ].join("\n");

      return {
        data: csvContent,
        filename: `attendance_${startDate}_to_${endDate}.csv`,
      };
    } else {
      return {
        data: JSON.stringify(allEntries, null, 2),
        filename: `attendance_${startDate}_to_${endDate}.json`,
      };
    }
  } catch (error) {
    console.error("Error exporting attendance data:", error);
    throw error;
  }
}

/**
 * Calculate attendance statistics for a given date range
 */
export async function calculateAttendanceStats(
  startDate: string,
  endDate: string,
): Promise<{
  totalPresent: number;
  totalAbsent: number;
  entriesCount: number;
  exitsCount: number;
  personStats: {
    [personId: string]: {
      present: number;
      absent: number;
      entries: EntryResponse[];
    };
  };
}> {
  try {
    // Get all entries for the date range
    const allEntries = await exportAttendanceData(startDate, endDate, "json");
    const entries: EntryResponse[] = JSON.parse(allEntries.data);

    // Get all persons
    const persons = await getAllPersons();

    // Initialize stats
    const personStats: {
      [personId: string]: {
        present: number;
        absent: number;
        entries: EntryResponse[];
      };
    } = {};
    let entriesCount = 0;
    let exitsCount = 0;

    // Initialize stats for each person
    persons.forEach((person) => {
      personStats[person.id] = { present: 0, absent: 0, entries: [] };
    });

    // Process entries
    entries.forEach((entry) => {
      if (entry.action.toLowerCase() === "entrada") {
        entriesCount++;
        personStats[entry.person_id].present++;
      } else if (entry.action.toLowerCase() === "salida") {
        exitsCount++;
      }

      personStats[entry.person_id].entries.push(entry);
    });

    // Calculate absent count (persons with no entries)
    let totalAbsent = 0;
    Object.keys(personStats).forEach((personId) => {
      if (personStats[personId].entries.length === 0) {
        personStats[personId].absent = 1;
        totalAbsent++;
      }
    });

    return {
      totalPresent: persons.length - totalAbsent,
      totalAbsent,
      entriesCount,
      exitsCount,
      personStats,
    };
  } catch (error) {
    console.error("Error calculating attendance stats:", error);
    throw error;
  }
}

function calc_api_key(uri: string): string {
  const api_secret = process.env.API_SECRET ?? "secret";
  let hmac = createHmac("sha256", api_secret);
  hmac.update(uri);
  let hash = hmac.digest("hex");
  return hash;
}
