import React, { useState, useEffect } from "react";
import {
  calculateAttendanceStats,
  exportAttendanceData,
} from "@/lib/api-client";
import { formatDateDisplay } from "@/lib/date-utils";

interface AttendanceReportProps {
  startDate: string;
  endDate: string;
  onExport?: (format: "csv" | "json") => void;
}

export default function AttendanceReport({
  startDate,
  endDate,
  onExport,
}: AttendanceReportProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalPresent: number;
    totalAbsent: number;
    entriesCount: number;
    exitsCount: number;
    personStats: {
      [personId: string]: { present: number; absent: number; entries: any[] };
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      if (!startDate || !endDate) return;

      setLoading(true);
      try {
        const stats = await calculateAttendanceStats(startDate, endDate);
        setStats(stats);
        setError(null);
      } catch (error) {
        console.error("Error loading attendance stats:", error);
        setError("Failed to load attendance statistics");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [startDate, endDate]);

  const handleExport = async (format: "csv" | "json") => {
    try {
      const exportData = await exportAttendanceData(startDate, endDate, format);

      // Create download link
      const blob = new Blob([exportData.data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportData.filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);

      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      console.error("Error exporting attendance data:", error);
      setError("Failed to export attendance data");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/30 dark:border-red-700">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400 dark:text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 8a1 1 0 011 1v4a1 1 0 11-2 0V9a1 1 0 011-1z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { totalPresent, totalAbsent, entriesCount, exitsCount } = stats;
  const totalPersons = totalPresent + totalAbsent;
  const attendanceRate =
    totalPersons > 0 ? Math.round((totalPresent / totalPersons) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-lg font-semibold">
          Attendance Report: {formatDateDisplay(new Date(startDate))} -{" "}
          {formatDateDisplay(new Date(endDate))}
        </h3>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => handleExport("csv")}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-light-accent dark:bg-dark-accent hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("json")}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-light-accent dark:bg-dark-accent hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
                  Present
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {totalPresent}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    of {totalPersons}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
                  Absent
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {totalAbsent}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    of {totalPersons}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
                  Attendance Rate
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {attendanceRate}%
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
                  Total Records
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {entriesCount + exitsCount}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({entriesCount} in, {exitsCount} out)
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Visualization - Simple bar chart */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-gray-800 p-6">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          Attendance Visualization
        </h4>
        <div className="h-16 flex items-end space-x-2">
          <div
            className="bg-green-500 rounded"
            style={{
              height: "100%",
              width: `${attendanceRate}%`,
              minWidth: "20px",
            }}
          />
          <div
            className="bg-red-500 rounded"
            style={{
              height: "100%",
              width: `${100 - attendanceRate}%`,
              minWidth: attendanceRate === 100 ? "0" : "20px",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Present: {attendanceRate}%
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Absent: {100 - attendanceRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
