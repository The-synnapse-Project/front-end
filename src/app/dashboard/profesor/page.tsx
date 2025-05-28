"use client";

import { useAuth, withRoleAccess } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";
import { useState, useEffect } from "react";
import {
  getAllPersons,
  createEntry,
  getEntriesByDate,
  getAllEntries,
} from "@/lib/api-client";
import { handleApiRequest } from "@/lib/error-handler";
import DatePicker from "@/Components/Common/DatePicker";
import AttendanceTracker from "@/Components/Attendance/AttendanceTracker";
import AttendanceHistory from "@/Components/Attendance/AttendanceHistory";
import AttendanceReport from "@/Components/Attendance/AttendanceReport";
import StudentAttendanceDetail from "@/Components/Attendance/StudentAttendanceDetail";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { getTodayString } from "@/lib/date-utils";

function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [reportStartDate, setReportStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split("T")[0];
  });
  const [reportEndDate, setReportEndDate] = useState(getTodayString());
  const [selectedStudent, setSelectedStudent] = useState<Person | null>(null);
  const [studentFilter, setStudentFilter] = useState("");
  const [prevTab, setPrevTab] = useState("students");

  // Load persons and entries
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load all persons
        const personsData = await handleApiRequest(() => getAllPersons());
        const loadedPersons = personsData?.map((p) =>
          Person.fromApiResponse(p),
        );
        setPersons(loadedPersons ? loadedPersons : []);

        // Load entries for the selected date
        await loadEntries();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Load entries when date changes
  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const entriesData = await getAllEntries();

      if (entriesData) {
        const loadedEntries = entriesData.map((e) => Entry.fromApiResponse(e));
        setEntries(loadedEntries);
      }
    } catch (error) {
      console.error(`Error loading entries:`, error);
    }
  }

  // Mark attendance
  async function handleMarkAttendance(personId: string, action: string) {
    try {
      const entry = await handleApiRequest(() =>
        createEntry({
          person_id: personId,
          action: action,
        }),
      );

      if (entry) {
        // Reload entries to show the updated data
        await loadEntries();
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  }

  // Set report end date to be at least start date
  useEffect(() => {
    if (new Date(reportEndDate) < new Date(reportStartDate)) {
      setReportEndDate(reportStartDate);
    }
  }, [reportStartDate, reportEndDate]);

  // Filter persons based on search input
  const filteredPersons =
    studentFilter.trim() === ""
      ? persons
      : persons.filter((p) => {
          const fullName = `${p.name} ${p.surname || ""}`.toLowerCase();
          const email = (p.email || "").toLowerCase();
          const query = studentFilter.toLowerCase();
          return fullName.includes(query) || email.includes(query);
        });

  const handleViewStudentDetail = (student: Person) => {
    setSelectedStudent(student);
    setPrevTab(activeTab);
    setActiveTab("studentDetail");
  };

  const handleBackToStudentList = () => {
    setSelectedStudent(null);
    setActiveTab(prevTab);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark-primary rounded-xl shadow-md transition-all duration-300 border border-light-secondary/10 dark:border-dark-secondary/10 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-6">
            Welcome, {user?.name}. Manage your courses, students, and attendance
            from here.
          </p>

          {/* Teacher Navigation Tabs */}
          {!selectedStudent && (
            <div className="border-b border-light-secondary/10 dark:border-dark-secondary/10 mb-6">
              <ul className="flex gap-2">
                <li>
                  <button
                    onClick={() => setActiveTab("students")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                      activeTab === "students"
                        ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent"
                        : "text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent dark:hover:text-dark-accent"
                    }`}
                  >
                    My Students
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
          )}

          {/* Tab Content */}
          {activeTab === "students" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Mis Estudiantes</h2>

              {/* Student search filter */}
              <div className="mb-6">
                <div className="max-w-md">
                  <label
                    htmlFor="student-search"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Buscar Estudiante
                  </label>
                  <input
                    type="text"
                    id="student-search"
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                    placeholder="Search by name or email"
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

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
                          Nombre
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
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredPersons.length > 0 ? (
                        filteredPersons.map((person) => (
                          <tr
                            key={person.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleViewStudentDetail(person)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {person.picture ? (
                                    <img
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewStudentDetail(person)}
                                className="text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover"
                              >
                                Detalles
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            No se han encontrado estudiantes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "studentDetail" && selectedStudent && (
            <StudentAttendanceDetail
              student={selectedStudent}
              onBack={handleBackToStudentList}
              onMarkAttendance={handleMarkAttendance}
            />
          )}

          {activeTab === "attendance" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">
                Control de atencion
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
                  {/* Attendance tracker */}
                  <div className="bg-light-background dark:bg-dark-background rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      Marcar entradas
                    </h3>
                    <AttendanceTracker
                      entries={entries}
                      persons={persons}
                      onMarkAttendance={handleMarkAttendance}
                      onStudentClick={handleViewStudentDetail}
                    />
                  </div>

                  {/* Attendance history */}
                  <div className="bg-light-background dark:bg-dark-background rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">
                      Historial de asistencia de hoy
                    </h3>
                    <AttendanceHistory
                      entries={entries}
                      persons={persons}
                      title=""
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">
                Registros de asistenia
              </h2>

              {/* Date range selection */}
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    min={reportStartDate}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Report component */}
              <AttendanceReport
                startDate={reportStartDate}
                endDate={reportEndDate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleAccess(TeacherDashboard, Role.PROFESOR);
