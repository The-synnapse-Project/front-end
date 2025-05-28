import React from "react";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { formatDateDisplay } from "@/lib/date-utils";
import Image from "next/image";

interface AttendanceSummaryProps {
  entries: Entry[];
  persons: Person[];
  date?: string;
}

export default function AttendanceSummary({
  entries,
  persons,
  date,
}: AttendanceSummaryProps) {
  // Filter entries by date if provided
  const filteredEntries = date
    ? entries.filter((entry) => {
        const entryDate = new Date(entry.instant).toISOString().split("T")[0];
        return entryDate === date;
      })
    : entries;

  // Get the latest entry for each person to determine if they're currently present
  const latestEntryMap = new Map<string, Entry>();
  filteredEntries.forEach((entry) => {
    const existingEntry = latestEntryMap.get(entry.person_id);
    if (
      !existingEntry ||
      new Date(entry.instant) > new Date(existingEntry.instant)
    ) {
      latestEntryMap.set(entry.person_id, entry);
    }
  });

  // Count present and absent persons
  const presentCount = Array.from(latestEntryMap.values()).filter(
    (entry) => entry.isEntry,
  ).length;
  const absentCount = persons.length - presentCount;

  // Entry and exit counts for the filtered period
  const entryCount = filteredEntries.filter((entry) => entry.isEntry).length;
  const exitCount = filteredEntries.filter((entry) => entry.isExit).length;

  // Get the 5 most recent entries
  const recentEntries = [...filteredEntries]
    .sort(
      (a, b) => new Date(b.instant).getTime() - new Date(a.instant).getTime(),
    )
    .slice(0, 5);

  // Map of person IDs to person objects
  const personMap = new Map<string, Person>();
  persons.forEach((person) => {
    if (person.id) {
      personMap.set(person.id, person);
    }
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Present count */}
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
                  Presentes
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {presentCount}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    de {persons.length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Absent count */}
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
                  Ausentes
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {absentCount}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    de {persons.length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Entry count */}
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
                  Entradas hoy
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {entryCount}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Exit count */}
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
                  Salidas hoy
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {exitCount}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-gray-800">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Actividad reciente
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {recentEntries.length > 0 ? (
              recentEntries.map((entry) => {
                const person = personMap.get(entry.person_id);
                const entryDate = new Date(entry.instant);

                return (
                  <li key={entry.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {person?.picture ? (
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={person.picture}
                            alt=""
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                              {person?.name.charAt(0)}
                              {person?.surname ? person.surname.charAt(0) : ""}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {person
                            ? `${person.name} ${person.surname || ""}`
                            : "Usuario desconocido"}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          <span
                            className={`font-medium ${entry.isEntry ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                          >
                            {entry.action}
                          </span>
                          {" • "}
                          {formatDateDisplay(entryDate)} •{" "}
                          {entryDate.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                No hay actividad reciente
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
