"use client";

import { useAuth, withRoleAccess } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";
import { useState, useEffect } from "react";
import {
  getAllPersons,
  getEntriesByDate,
  getAllPermissions,
} from "@/lib/api-client";
import DatePicker from "@/Components/Common/DatePicker";
import AttendanceSummary from "@/Components/Attendance/AttendanceSummary";
import AttendanceHistory from "@/Components/Attendance/AttendanceHistory";
import AttendanceReport from "@/Components/Attendance/AttendanceReport";
import PermissionManagement from "@/Components/Admin/PermissionManagement";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { Permission } from "@/models/Permission";
import { getTodayString } from "@/lib/date-utils";
import Image from "next/image";

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [reportStartDate, setReportStartDate] = useState(getTodayString());
  const [reportEndDate, setReportEndDate] = useState(getTodayString());

  // Helper function to get role display name and styles
  const getRoleInfo = (role: string) => {
    const roleToLower = role.toLowerCase();
    if (roleToLower === "admin") {
      return {
        name: "Admin",
        styles:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      };
    } else if (roleToLower.includes("prof") || roleToLower.includes("teach")) {
      return {
        name: "Teacher",
        styles: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      };
    } else if (
      roleToLower.includes("alum") ||
      roleToLower.includes("student")
    ) {
      return {
        name: "Student",
        styles:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      };
    } else {
      return {
        name: "Unknown",
        styles: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      };
    }
  };

  // Load persons and entries
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load all persons
        const personsData = await getAllPersons();
        const loadedPersons = personsData.map((p) => Person.fromApiResponse(p));
        setPersons(loadedPersons);

        // Load entries for the selected date
        await loadEntries(selectedDate);

        // Load all permissions
        const permissionsData = await getAllPermissions();
        const loadedPermissions = permissionsData.map((p) =>
          Permission.fromApiResponse(p),
        );
        setUserPermissions(loadedPermissions);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedDate]);

  // Load entries when date changes
  useEffect(() => {
    loadEntries(selectedDate);
  }, [selectedDate]);

  async function loadEntries(date: string) {
    try {
      const entriesData = await getEntriesByDate(date);
      if (!entriesData) {
        console.error(`No entries found for date ${date}`);
        return;
      }
      const loadedEntries = entriesData.map((e) => Entry.fromApiResponse(e));
      setEntries(loadedEntries);
    } catch (error) {
      console.error(`Error loading entries for date ${date}:`, error);
    }
  }

  // Handle permissions update
  const handlePermissionsUpdate = async () => {
    try {
      // Refresh both permissions and persons since role changes affect both
      const [permissionsData, personsData] = await Promise.all([
        getAllPermissions(),
        getAllPersons(),
      ]);

      const loadedPermissions = permissionsData.map((p) =>
        Permission.fromApiResponse(p),
      );
      const loadedPersons = personsData.map((p) => Person.fromApiResponse(p));

      setUserPermissions(loadedPermissions);
      setPersons(loadedPersons);
    } catch (error) {
      console.error("Error refreshing permissions:", error);
    }
  };

  // Set report end date to be at least start date
  useEffect(() => {
    if (new Date(reportEndDate) < new Date(reportStartDate)) {
      setReportEndDate(reportStartDate);
    }
  }, [reportStartDate, reportEndDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark-primary rounded-xl shadow-md transition-all duration-300 border border-light-secondary/10 dark:border-dark-secondary/10 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-6">
            Welcome, {user?.name}. Manage your application from here.
          </p>

          {/* Admin Navigation Tabs */}
          <div className="border-b border-light-secondary/10 dark:border-dark-secondary/10 mb-6">
            <ul className="flex gap-2">
              <li>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                    activeTab === "users"
                      ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent"
                      : "text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent dark:hover:text-dark-accent"
                  }`}
                >
                  User Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("permissions")}
                  className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                    activeTab === "permissions"
                      ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent"
                      : "text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent dark:hover:text-dark-accent"
                  }`}
                >
                  Permissions
                </button>
              </li>
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
                  onClick={() => setActiveTab("reports")}
                  className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                    activeTab === "reports"
                      ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent"
                      : "text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent dark:hover:text-dark-accent"
                  }`}
                >
                  Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          {activeTab === "users" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-6">
                Manage users and their roles in the system.
              </p>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {persons.map((person) => {
                        const role = person.role || "";
                        const roleInfo = getRoleInfo(role);

                        return (
                          <tr
                            key={person.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {person.picture ? (
                                    <Image
                                      className="h-10 w-10 rounded-full"
                                      src={person.picture}
                                      alt={person.name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                                        {person.name.charAt(0)}
                                        {person.surname
                                          ? person.surname.charAt(0)
                                          : ""}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {person.name} {person.surname || ""}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {person.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleInfo.styles}`}
                              >
                                {roleInfo.name}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">
                Permissions Management
              </h2>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-6">
                Configure user roles and permissions in the system.
              </p>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent"></div>
                </div>
              ) : (
                <PermissionManagement
                  persons={persons}
                  permissions={userPermissions}
                  onUpdate={handlePermissionsUpdate}
                />
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">
                Attendance Management
              </h2>

              {/* Date picker */}
              <div className="mb-6">
                <DatePicker
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  className="max-w-xs"
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent"></div>
                </div>
              ) : (
                <>
                  {/* Attendance stats */}
                  <div className="bg-light-background dark:bg-dark-background rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      Daily Attendance Summary
                    </h3>
                    <AttendanceSummary entries={entries} persons={persons} />
                  </div>

                  {/* Attendance history */}
                  <div className="bg-light-background dark:bg-dark-background rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">
                      Attendance History
                    </h3>
                    <AttendanceHistory
                      entries={entries}
                      persons={persons}
                      title="Complete Attendance Records"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Attendance Reports</h2>

              {/* Date range selection */}
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                <div>
                  <DatePicker
                    selectedDate={reportStartDate}
                    onDateChange={setReportStartDate}
                    label="Start Date"
                    className="w-full"
                  />
                </div>
                <div>
                  <DatePicker
                    selectedDate={reportEndDate}
                    onDateChange={setReportEndDate}
                    label="End Date"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Report component */}
              <AttendanceReport
                startDate={reportStartDate}
                endDate={reportEndDate}
                onExport={(format) => {
                  console.log(`Attendance data exported in ${format} format`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleAccess(AdminDashboard, Role.ADMIN);
