import React, { useState, useEffect, use } from "react";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { Permission } from "@/models/Permission";
import { getAllPersons } from "@/lib/api-client";

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
  const [apiStatus, setApiStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [apiMessage, setApiMessage] = useState<string>(
    "Testing API connection...",
  );

  const [isApiOk, setIsApiOk] = useState<number>(0); // 0 loading, 1 ok, 2 error

  useEffect(() => {
    async function testApi() {
      try {
        const persons = await getAllPersons();
        if (persons) {
          setIsApiOk(1);
        }
      } catch (error) {
        setIsApiOk(2);
      }
    }
    testApi();
  }, []);
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
                Rocket API
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {isApiOk == 1
                  ? "✅ Working"
                  : isApiOk == 2
                    ? "🔴 Error"
                    : "🔄 Pending"}
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
