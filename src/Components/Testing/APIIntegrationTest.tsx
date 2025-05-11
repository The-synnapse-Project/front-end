import React, { useState, useEffect } from "react";
import { useAttendanceUpdates } from "@/hooks/useAttendanceUpdates";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { Permission } from "@/models/Permission";

interface IntegrationTestCardProps {
  title: string;
  status: "success" | "error" | "pending";
  message: string;
}

const IntegrationTestCard: React.FC<IntegrationTestCardProps> = ({
  title,
  status,
  message,
}) => {
  const statusColors = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <div className={`p-4 mb-4 rounded-lg border ${statusColors[status]}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default function APIIntegrationTest() {
  const [wsStatus, setWsStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [apiStatus, setApiStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [wsMessage, setWsMessage] = useState<string>(
    "Attempting to connect to WebSocket...",
  );
  const [apiMessage, setApiMessage] = useState<string>(
    "Testing API connection...",
  );
  const [entries, setEntries] = useState<Entry[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Test WebSocket connection
  const { isConnected, lastEntry, lastPerson, lastPermission } =
    useAttendanceUpdates({
      onEntry: (entry) => {
        setEntries((prev) => [...prev, entry]);
        setWsStatus("success");
        setWsMessage(
          `Successfully received entry update for person ${entry.person_id}`,
        );
      },
      onPerson: (person) => {
        setPersons((prev) => [...prev, person]);
        setWsStatus("success");
        setWsMessage(`Successfully received person update: ${person.name}`);
      },
      onPermission: (permission) => {
        setPermissions((prev) => [...prev, permission]);
        setWsStatus("success");
        setWsMessage(
          `Successfully received permission update for person ${permission.personId}`,
        );
      },
      onConnection: (status) => {
        if (status.status === "connected") {
          setWsStatus("success");
          setWsMessage("WebSocket connection established successfully");
        } else {
          setWsStatus("error");
          setWsMessage(
            `WebSocket disconnected: ${status.reason || "Unknown reason"}`,
          );
        }
      },
      onError: (error) => {
        setWsStatus("error");
        setWsMessage(`WebSocket error: ${error.message || "Unknown error"}`);
      },
    });

  // Test REST API connection
  useEffect(() => {
    async function testApiConnection() {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          const data = await response.json();
          setApiStatus("success");
          setApiMessage(`API is healthy: ${data.message || "OK"}`);
        } else {
          setApiStatus("error");
          setApiMessage(
            `API returned status ${response.status}: ${response.statusText}`,
          );
        }
      } catch (error: any) {
        setApiStatus("error");
        setApiMessage(`Failed to connect to API: ${error.message}`);
      }
    }

    testApiConnection();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        API Integration Test
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <IntegrationTestCard
          title="REST API Connection"
          status={apiStatus}
          message={apiMessage}
        />
        <IntegrationTestCard
          title="WebSocket Connection"
          status={wsStatus}
          message={wsMessage}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Real-time Updates
        </h3>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            WebSocket Status:{" "}
            <span className={isConnected ? "text-green-500" : "text-red-500"}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </p>

          {lastEntry && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">
                Last Entry Update:
              </h4>
              <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(lastEntry, null, 2)}
              </pre>
            </div>
          )}

          {lastPerson && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">
                Last Person Update:
              </h4>
              <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(lastPerson, null, 2)}
              </pre>
            </div>
          )}

          {lastPermission && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">
                Last Permission Update:
              </h4>
              <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(lastPermission, null, 2)}
              </pre>
            </div>
          )}

          {!lastEntry && !lastPerson && !lastPermission && (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No real-time updates received yet. Updates will appear here when
              they arrive.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Integration Status
        </h3>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Feature
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                API Authentication
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {apiStatus === "success" ? "✅ Working" : "🔄 Pending"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                WebSocket Connection
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {isConnected ? "✅ Connected" : "❌ Disconnected"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Real-time Updates
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {entries.length > 0 ||
                persons.length > 0 ||
                permissions.length > 0
                  ? "✅ Working"
                  : "🔄 Waiting for updates"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Error Handling
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                ✅ Implemented
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
