import React, { useState, useEffect } from "react";
import { Person } from "@/models/Person";
import { Entry } from "@/models/Entry";
import { getEntriesByPerson } from "@/lib/api-client";
import DatePicker from "@/Components/Common/DatePicker";
import { getTodayString, formatDateDisplay } from "@/lib/date-utils";

interface StudentAttendanceDetailProps {
  student: Person;
  onBack: () => void;
  onMarkAttendance?: (personId: string, action: string) => Promise<void>;
}

export default function StudentAttendanceDetail({
  student,
  onBack,
  onMarkAttendance,
}: StudentAttendanceDetailProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);

  useEffect(() => {
    async function loadStudentEntries() {
      if (!student.id) return;

      setLoading(true);
      try {
        const entriesData = await getEntriesByPerson(student.id);
        const loadedEntries = entriesData.map((e) => Entry.fromApiResponse(e));
        setEntries(loadedEntries);
        setFilteredEntries(loadedEntries);
      } catch (error) {
        console.error("Error loading student entries:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStudentEntries();
  }, [student]);

  useEffect(() => {
    if (dateFilter) {
      const filtered = entries.filter((entry) => {
        const entryDate = new Date(entry.instant).toISOString().split("T")[0];
        return entryDate === dateFilter;
      });
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [dateFilter, entries]);

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

  const studentStatus = getStudentStatus();

  // Calculate attendance statistics
  const calculateStats = () => {
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

    // Calculate days present
    const daysPresent = Object.keys(entriesByDay).length;

    // Calculate total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    return {
      daysPresent,
      daysInMonth,
      attendanceRate: Math.round((daysPresent / daysInMonth) * 100),
      currentMonth: new Date(currentYear, currentMonth, 1).toLocaleString(
        "default",
        { month: "long" },
      ),
    };
  };

  const stats = calculateStats();

  // Handle marking attendance
  const handleMarkAttendance = async () => {
    if (!student.id || !onMarkAttendance) return;

    try {
      await onMarkAttendance(
        student.id,
        studentStatus.isPresent ? "Salida" : "Entrada",
      );

      // Reload entries
      const entriesData = await getEntriesByPerson(student.id);
      const loadedEntries = entriesData.map((e) => Entry.fromApiResponse(e));
      setEntries(loadedEntries);

      // Apply filter if needed
      if (dateFilter) {
        const filtered = loadedEntries.filter((entry) => {
          const entryDate = new Date(entry.instant).toISOString().split("T")[0];
          return entryDate === dateFilter;
        });
        setFilteredEntries(filtered);
      } else {
        setFilteredEntries(loadedEntries);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {student.picture ? (
              <img
                className="h-12 w-12 rounded-full"
                src={student.picture}
                alt={student.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {student.name.charAt(0)}
                  {student.surname ? student.surname.charAt(0) : ""}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">
              {student.name} {student.surname}
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              {student.email}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current status card */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Current Status</h3>
              {onMarkAttendance && (
                <button
                  onClick={handleMarkAttendance}
                  className={`px-4 py-2 rounded font-medium text-white ${
                    studentStatus.isPresent
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {studentStatus.isPresent ? "Mark Exit" : "Mark Entry"}
                </button>
              )}
            </div>

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
                <span className="ml-3 text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
                  Last update: {formatDateDisplay(studentStatus.lastEntryTime)}{" "}
                  at {studentStatus.lastEntryTime.toLocaleTimeString()}
                  {studentStatus.entry && (
                    <span className="ml-2 font-medium">
                      ({studentStatus.entry.action})
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Monthly statistics */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {stats.currentMonth} Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-light-background dark:bg-dark-background p-4 rounded">
                <div className="text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
                  Days Present
                </div>
                <div className="text-2xl font-bold">
                  {stats.daysPresent}{" "}
                  <span className="text-sm font-normal">
                    of {stats.daysInMonth}
                  </span>
                </div>
              </div>

              <div className="bg-light-background dark:bg-dark-background p-4 rounded">
                <div className="text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
                  Attendance Rate
                </div>
                <div className="text-2xl font-bold">
                  {stats.attendanceRate}%
                </div>
              </div>

              <div className="bg-light-background dark:bg-dark-background p-4 rounded">
                <div className="text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
                  Total Entries
                </div>
                <div className="text-2xl font-bold">{entries.length}</div>
              </div>
            </div>
          </div>

          {/* Attendance history */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance History</h3>

            <div className="mb-4">
              <DatePicker
                selectedDate={dateFilter}
                onDateChange={setDateFilter}
                className="max-w-xs"
                allowClear
                placeholder="Filter by date"
              />
            </div>

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
              <div className="text-center py-8 text-light-txt-secondary dark:text-dark-txt-secondary">
                No attendance records found for{" "}
                {dateFilter
                  ? formatDateDisplay(new Date(dateFilter))
                  : "this student"}
                .
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
