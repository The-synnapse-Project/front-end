import { useState, useEffect } from "react";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { Permission } from "@/models/Permission";
import { toast } from "react-hot-toast";

type EventType = "entry" | "permission" | "person" | "connection" | "error";
type EntryCallback = (entry: Entry) => void;
type PersonCallback = (person: Person) => void;
type PermissionCallback = (permission: Permission) => void;
type ConnectionCallback = (status: {
  status: string;
  code?: number;
  reason?: string;
}) => void;
type ErrorCallback = (error: any) => void;

interface AttendanceUpdateOptions {
  showToasts?: boolean;
  autoConnect?: boolean;
  onEntry?: EntryCallback;
  onPerson?: PersonCallback;
  onPermission?: PermissionCallback;
  onConnection?: ConnectionCallback;
  onError?: ErrorCallback;
}

export function useAttendanceUpdates(options: AttendanceUpdateOptions = {}) {
  const [lastEntry, setLastEntry] = useState<Entry | null>(null);
  const [lastPerson, setLastPerson] = useState<Person | null>(null);
  const [lastPermission, setLastPermission] = useState<Permission | null>(null);

  const {
    showToasts = true,
    autoConnect = true,
    onEntry,
    onPerson,
    onPermission,
    onConnection,
    onError,
  } = options;

  // Entry handler
  const handleEntry = (data: any) => {
    try {
      const entry = Entry.fromApiResponse(data);
      setLastEntry(entry);

      if (showToasts) {
        toast.success(
          `New attendance entry: ${entry.action} by ${entry.person_id}`,
        );
      }

      if (onEntry) {
        onEntry(entry);
      }
    } catch (error) {
      console.error("Error processing entry update:", error);
    }
  };

  // Person handler
  const handlePerson = (data: any) => {
    try {
      const person = Person.fromApiResponse(data);
      setLastPerson(person);

      if (showToasts) {
        toast.success(`Person updated: ${person.name} ${person.surname || ""}`);
      }

      if (onPerson) {
        onPerson(person);
      }
    } catch (error) {
      console.error("Error processing person update:", error);
    }
  };

  // Permission handler
  const handlePermission = (data: any) => {
    try {
      const permission = Permission.fromApiResponse(data);
      setLastPermission(permission);

      if (showToasts) {
        toast.success(`Permission updated for user ID: ${permission.personId}`);
      }

      if (onPermission) {
        onPermission(permission);
      }
    } catch (error) {
      console.error("Error processing permission update:", error);
    }
  };

  // Connection handler
  const handleConnection = (data: {
    status: string;
    code?: number;
    reason?: string;
  }) => {
    if (data.status === "connected" && showToasts) {
      toast.success("Connected to real-time updates");
    } else if (data.status === "disconnected" && showToasts) {
      toast.error(
        `Disconnected from real-time updates ${data.reason ? ": " + data.reason : ""}`,
      );
    }

    if (onConnection) {
      onConnection(data);
    }
  };

  // Error handler
  const handleError = (error: any) => {
    if (showToasts) {
      toast.error(
        `Real-time update error: ${error.message || "Unknown error"}`,
      );
    }

    if (onError) {
      onError(error);
    }
  };

  return {
    lastEntry,
    lastPerson,
    lastPermission,
  };
}
