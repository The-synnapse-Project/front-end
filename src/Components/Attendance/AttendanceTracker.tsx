import React, { useState } from "react";
import { Entry } from "@/models/Entry";
import { Person } from "@/models/Person";

interface AttendanceTrackerProps {
  entries: Entry[];
  persons: Person[];
  onMarkAttendance?: (personId: string, action: string) => Promise<void>;
  isReadOnly?: boolean;
}

export default function AttendanceTracker({
  entries,
  persons,
  onMarkAttendance,
  isReadOnly = false,
}: AttendanceTrackerProps) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Group entries by person and get the latest entry
  const personEntryMap = new Map<string, Entry>();
  entries.forEach((entry) => {
    const existingEntry = personEntryMap.get(entry.person_id);
    if (
      !existingEntry ||
      new Date(entry.instant) > new Date(existingEntry.instant)
    ) {
      personEntryMap.set(entry.person_id, entry);
    }
  });

  const handleMarkAttendance = async (personId: string, action: string) => {
    if (!onMarkAttendance) return;

    setLoading((prev) => ({ ...prev, [personId]: true }));
    try {
      await onMarkAttendance(personId, action);
    } finally {
      setLoading((prev) => ({ ...prev, [personId]: false }));
    }
  };

  return (
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
              Estado
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Último registro
            </th>
            {!isReadOnly && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {persons.map((person) => {
            const latestEntry = personEntryMap.get(person.id || "");
            const isPresent = latestEntry?.isEntry;

            return (
              <tr
                key={person.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
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
                            {person.surname ? person.surname.charAt(0) : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {person.name} {person.surname || ""}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {person.email || ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isPresent
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {isPresent ? "Presente" : "Ausente"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {latestEntry ? (
                    <div>
                      <div>{latestEntry.formattedDate}</div>
                      <div>
                        {latestEntry.formattedTime} - {latestEntry.action}
                      </div>
                    </div>
                  ) : (
                    "No hay registros"
                  )}
                </td>
                {!isReadOnly && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        handleMarkAttendance(
                          person.id || "",
                          isPresent ? "Salida" : "Entrada",
                        )
                      }
                      disabled={loading[person.id || ""]}
                      className={`${
                        isPresent
                          ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                          : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      } px-3 py-1 border border-transparent rounded-md text-sm font-medium shadow-sm transition-colors`}
                    >
                      {loading[person.id || ""] ? (
                        <span>Procesando...</span>
                      ) : isPresent ? (
                        "Marcar salida"
                      ) : (
                        "Marcar entrada"
                      )}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
