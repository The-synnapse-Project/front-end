"use client";

import { useAuth, withRoleAccess } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";
import { useState, useEffect } from "react";
import { getEntriesByPerson } from "@/lib/api-client";
import DatePicker from "@/Components/Common/DatePicker";
import AttendanceHistory from "@/Components/Attendance/AttendanceHistory";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { getTodayString, formatDateDisplay } from "@/lib/date-utils";
function AlumnoDashboard() {
  const { user, permissions } = useAuth();
  const [activeTab, setActiveTab] = useState("attendance");
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Create current user object
        if (user) {
          setCurrentUser(
            new Person(user.name || "User", {
              id: user.id,
              email: user.email || undefined,
              surname: user.surname || undefined,
            }),
          );
        }

        // Load entries for the current user
        const entriesData = await getEntriesByPerson(user.id);
        if (!entriesData) return;

        const loadedEntries = entriesData.map((e) => Entry.fromApiResponse(e));
        setEntries(loadedEntries);
        setFilteredEntries(loadedEntries);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Filter entries when filters change
  useEffect(() => {
    let result = [...entries];

    if (dateFilter) {
      result = result.filter((entry) => {
        const entryDate = new Date(entry.instant).toISOString().split("T")[0];
        return entryDate === dateFilter;
      });
    }

    if (actionFilter) {
      result = result.filter(
        (entry) => entry.action.toLowerCase() === actionFilter.toLowerCase(),
      );
    }

    setFilteredEntries(result);
  }, [entries, dateFilter, actionFilter]);

  // Get the latest entry to determine if student is currently present
  const getStudentStatus = () => {
    if (!entries.length) return { isPresent: false, lastEntryTime: null };

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.instant).getTime() - new Date(a.instant).getTime(),
    );

    const latestEntry = sortedEntries[0];
    return {
      isPresent: latestEntry.isEntry,
      lastEntryTime: new Date(latestEntry.instant),
      entry: latestEntry,
    };
  };

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Get entries for current month
    const monthEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.instant);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    // Group by day
    const entriesByDay = monthEntries.reduce(
      (acc, entry) => {
        const dateKey = new Date(entry.instant).toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(entry);
        return acc;
      },
      {} as { [key: string]: Entry[] },
    );

    // Count days present (days with at least one entry)
    const daysPresent = Object.keys(entriesByDay).length;

    // Count total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Calculate total hours
    let totalHoursPresent = 0;
    Object.values(entriesByDay).forEach((dayEntries) => {
      // Sort entries by time
      const sortedEntries = [...dayEntries].sort(
        (a, b) => new Date(a.instant).getTime() - new Date(b.instant).getTime(),
      );

      // Match each entry with exit
      let lastEntryTime: Date | null = null;
      sortedEntries.forEach((entry) => {
        if (entry.isEntry) {
          lastEntryTime = new Date(entry.instant);
        } else if (lastEntryTime) {
          // Calculate time difference in hours
          const exitTime = new Date(entry.instant);
          const diffHours =
            (exitTime.getTime() - lastEntryTime.getTime()) / (1000 * 60 * 60);
          totalHoursPresent += diffHours;
          lastEntryTime = null;
        }
      });
    });

    return {
      daysPresent,
      daysInMonth,
      attendanceRate: Math.round((daysPresent / daysInMonth) * 100),
      totalEntries: monthEntries.length,
      totalHoursPresent: Math.round(totalHoursPresent * 10) / 10, // Round to 1 decimal
      currentMonth: new Date(currentYear, currentMonth, 1).toLocaleString(
        "default",
        { month: "long" },
      ),
    };
  };

  const studentStatus = getStudentStatus();
  const stats = calculateAttendanceStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark-primary rounded-xl shadow-md transition-all duration-300 border border-light-secondary/10 dark:border-dark-secondary/10 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-6">
            Welcome, {user?.name}. View your attendance and courses here.
          </p>

          {/* Student Navigation Tabs */}
          <div className="border-b border-light-secondary/10 dark:border-dark-secondary/10 mb-6">
            <ul className="flex gap-2">
              <li>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                    activeTab === "attendance"
                      ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent"
                      : "text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent dark:hover:text-dark-accent"
                  }`}
                >
                  Attendance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                    activeTab === "courses"
                      ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent"
                      : "text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent dark:hover:text-dark-accent"
                  }`}
                >
                  My Courses
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          {activeTab === "attendance" && (
            <div className="animate-fade-in">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Status Card */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Current Status
                    </h2>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          studentStatus.isPresent
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {studentStatus.isPresent ? "Present" : "Absent"}
                      </span>

                      {studentStatus.lastEntryTime && (
                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                          Last update:{" "}
                          {formatDateDisplay(studentStatus.lastEntryTime)} at{" "}
                          {studentStatus.lastEntryTime.toLocaleTimeString()}
                          {studentStatus.entry && (
                            <span className="ml-2 font-medium">
                              ({studentStatus.entry.action})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monthly Stats Card */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {stats.currentMonth} Statistics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Days Present */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Days Present
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.daysPresent}{" "}
                          <span className="text-sm font-normal">
                            / {stats.daysInMonth}
                          </span>
                        </div>
                      </div>

                      {/* Attendance Rate */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Attendance Rate
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.attendanceRate}%
                        </div>
                      </div>

                      {/* Total Entries */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Total Entries
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.totalEntries}
                        </div>
                      </div>

                      {/* Total Hours */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Hours Present
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.totalHoursPresent}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance History */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Attendance History
                    </h2>

                    {/* Filters */}
                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                      <div>
                        <DatePicker
                          selectedDate={dateFilter}
                          onDateChange={setDateFilter}
                          label="Filter by date"
                          className="w-full"
                          allowClear
                          placeholder="All dates"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="action-filter"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Filter by action
                        </label>
                        <select
                          id="action-filter"
                          value={actionFilter}
                          onChange={(e) => setActionFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">All actions</option>
                          <option value="entrada">Entry</option>
                          <option value="salida">Exit</option>
                        </select>
                      </div>
                    </div>

                    {/* Entries Table */}
                    {filteredEntries.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Time
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredEntries.map((entry) => {
                              const entryDate = new Date(entry.instant);

                              return (
                                <tr
                                  key={entry.id}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDateDisplay(entryDate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {entryDate.toLocaleTimeString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        entry.isEntry
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                      }`}
                                    >
                                      {entry.action}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No attendance records found{" "}
                        {dateFilter &&
                          `for ${formatDateDisplay(new Date(dateFilter))}`}
                        .
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">My Courses</h2>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
                Coming soon: Course listing and materials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleAccess(AlumnoDashboard, Role.ALUMNO);
