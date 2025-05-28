import React, { useState, useEffect } from "react";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";
import { formatDateDisplay } from "@/lib/date-utils";

interface AttendanceHistoryProps {
  entries: Entry[];
  persons: Person[];
  title?: string;
}

export default function AttendanceHistory({
  entries,
  persons,
  title = "Historial de Asistencia",
}: AttendanceHistoryProps) {
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(entries);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [personFilter, setPersonFilter] = useState<string>("");

  // Get a map of person IDs to person objects for easy lookup
  const personMap = new Map<string, Person>();
  persons.forEach((person) => {
    if (person.id) {
      personMap.set(person.id, person);
    }
  });

  useEffect(() => {
    let result = [...entries];

    if (dateFilter) {
      const selectedDate = dateFilter;
      result = result.filter((entry) => {
        const entryDate = new Date(entry.instant).toISOString().split("T")[0];
        return entryDate === selectedDate;
      });
    }

    if (actionFilter) {
      result = result.filter(
        (entry) => entry.action.toLowerCase() === actionFilter.toLowerCase(),
      );
    }

    if (personFilter) {
      result = result.filter((entry) => entry.person_id === personFilter);
    }

    setFilteredEntries(result);
  }, [entries, dateFilter, actionFilter, personFilter]);

  // Get unique dates for the date filter
  const uniqueDates = Array.from(
    new Set(
      entries.map(
        (entry) => new Date(entry.instant).toISOString().split("T")[0],
      ),
    ),
  ).sort((a, b) => b.localeCompare(a)); // Sort descending

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="date-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filtrar por fecha
          </label>
          <select
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todas las fechas</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {formatDateDisplay(new Date(date))}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="action-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filtrar por acción
          </label>
          <select
            id="action-filter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todas las acciones</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="person-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filtrar por persona
          </label>
          <select
            id="person-filter"
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todas las personas</option>
            {persons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.surname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Hora
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Persona
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => {
                const entryDate = new Date(entry.instant);
                const person = personMap.get(entry.person_id);

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
                      <div className="flex items-center">
                        {person ? (
                          <>
                            <div className="flex-shrink-0 h-8 w-8">
                              {person.picture ? (
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src={person.picture}
                                  alt={person.name}
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                    {person.name.charAt(0)}
                                    {person.surname
                                      ? person.surname.charAt(0)
                                      : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {person.name} {person.surname || ""}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {person.email || ""}
                              </div>
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Usuario desconocido ({entry.person_id})
                          </span>
                        )}
                      </div>
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
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
