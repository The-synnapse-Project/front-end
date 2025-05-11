// Error handling utilities for API requests
import { toast } from "react-hot-toast";

// Error types for specific handling
export enum ErrorType {
  NETWORK = "network",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  SERVER = "server",
  VALIDATION = "validation",
  UNKNOWN = "unknown",
}

// Error response from the API
export interface ApiError {
  status: number;
  message: string;
  type: ErrorType;
  details?: string | Record<string, any>;
}

// Map HTTP status code to error type
export function getErrorTypeFromStatus(status: number): ErrorType {
  switch (status) {
    case 401:
      return ErrorType.UNAUTHORIZED;
    case 403:
      return ErrorType.FORBIDDEN;
    case 404:
      return ErrorType.NOT_FOUND;
    case 422:
      return ErrorType.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
}

// Create a standardized error object
export function createApiError(
  status: number,
  message: string,
  details?: any,
): ApiError {
  return {
    status,
    message,
    type: getErrorTypeFromStatus(status),
    details,
  };
}

// Process an error from fetch or other source into an ApiError
export function processApiError(error: any): ApiError {
  if (!navigator.onLine) {
    return createApiError(0, "No internet connection", { original: error });
  }

  // Error from fetch API
  if (error.status) {
    return createApiError(
      error.status,
      error.statusText || getDefaultErrorMessage(error.status),
      error.data,
    );
  }

  // Network error
  if (error.name === "TypeError" && error.message === "Failed to fetch") {
    return createApiError(
      0,
      "Network error - unable to connect to the server",
      { original: error },
    );
  }

  // Unknown error
  return createApiError(0, error.message || "An unknown error occurred", {
    original: error,
  });
}

// Get a user-friendly error message based on status code
export function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Bad request - please check your input";
    case 401:
      return "You need to be logged in to access this resource";
    case 403:
      return "You do not have permission to access this resource";
    case 404:
      return "The requested resource was not found";
    case 422:
      return "Validation error - please check your input";
    case 429:
      return "Too many requests - please try again later";
    case 500:
      return "Internal server error - please try again later";
    case 502:
    case 503:
    case 504:
      return "Server is temporarily unavailable - please try again later";
    default:
      return "An error occurred";
  }
}

// Display an error message to the user
export function displayErrorToUser(error: ApiError): void {
  // Log all errors to console for debugging
  console.error("API Error:", error);

  // Show toast notification with appropriate message
  toast.error(error.message || "An error occurred", {
    duration: 5000,
    position: "top-right",
  });
}

// Utility function to handle API errors in async functions
export async function handleApiRequest<T>(
  apiCall: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
    successMessage?: string;
  } = {},
): Promise<T | null> {
  try {
    const data = await apiCall();

    if (options.successMessage) {
      toast.success(options.successMessage);
    }

    if (options.onSuccess) {
      options.onSuccess(data);
    }

    return data;
  } catch (error) {
    const apiError = processApiError(error);

    // Display error to the user
    displayErrorToUser(apiError);

    // Call onError handler if provided
    if (options.onError) {
      options.onError(apiError);
    }

    return null;
  }
}
