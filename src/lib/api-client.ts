"use server";
import {
  LoginCredentials,
  LoginResponse,
  PersonResponse,
  PermissionResponse,
  CreatePermissionRequest,
  EntryResponse,
} from "@/lib/interfaces";
// API client for interacting with the Rocket backend
import { processApiError, createApiError } from "./error-handler";

// Update this with your Rocket API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
import { createHmac } from "crypto";

// Generic fetch wrapper with improved error handling
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit,
): Promise<any> {
  try {
    const uri = new URL(url).pathname;
    let api_key = await calc_api_key(uri);
    let new_options = {
      ...options,
      headers: {
        ...options?.headers,
        "X-Syn-Api-Key": api_key,
      },
    };
    const response = await fetch(url, new_options);

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
 * Register a new user
 */
export async function register(
  name: string,
  surname: string,
  email: string,
  password: string | null,
  google_id?: string | null,
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
        google_id,
      }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
}

/**
 * Login with Google
 */
export async function loginWithGoogle(
  googleId: string,
  email: string,
): Promise<{ status: string; message?: string; user?: any } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/google-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          google_id: googleId,
          email,
        }),
      },
    );
  } catch (error) {
    console.error("Google login error:", error);
    return null;
  }
}

export async function registerWithGoogle(
  google_id: string,
  email: string,
  name: string,
  surname: string,
): Promise<{ status: string; message?: string; user?: any } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/register-google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          google_id,
          email,
          name,
          surname,
        }),
      },
    );
  } catch (error) {
    console.error("Register with Google error:", error);
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

/**
 * Request a password reset email
 */
export async function forgotPassword(
  email: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return null;
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      },
    );
  } catch (error) {
    console.error("Reset password error:", error);
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
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${entry.id},${
            entry.person_id
          },${day}/${month}/${year},${date.toLocaleTimeString()},${
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

async function calc_api_key(uri: string): Promise<string> {
  const api_secret = process.env.SYN_API_SECRET ?? "secret";
  let hmac = createHmac("sha256", api_secret);
  hmac.update(uri);
  let hash = hmac.digest("hex");
  return hash;
}

/**
 * Set a password for a user (particularly for Google users who don't have one)
 */
export async function setPassword(
  email: string,
  newPassword: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/set-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: newPassword,
        }),
      },
    );
  } catch (error) {
    console.error("Set password error:", error);
    return null;
  }
}

/**
 * Link a Google account to an existing user account
 */
export async function linkGoogleAccount(
  email: string,
  googleEmail: string,
  password: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/link-google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          google_email: googleEmail,
          password,
        }),
      },
    );
  } catch (error) {
    console.error("Link Google account error:", error);
    return null;
  }
}

/**
 * Get a person by Google ID from the API
 */
export async function getPersonByGoogleId(
  googleId: string,
): Promise<PersonResponse | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/person/by-google-id/${googleId}`,
    );
  } catch (error) {
    console.error("Error getting person by Google ID:", error);
    return null;
  }
}

/**
 * Update a user's Google ID
 */
export async function updateGoogleId(
  personId: string,
  googleId: string,
): Promise<{ status: string; message?: string } | null> {
  try {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/api/auth/update-google-id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person_id: personId,
          google_id: googleId,
        }),
      },
    );
  } catch (error) {
    console.error("Error updating Google ID:", error);
    return null;
  }
}
