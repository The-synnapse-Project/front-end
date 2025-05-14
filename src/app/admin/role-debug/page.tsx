"use client";

import { useEffect, useState } from "react";
import { getAllPersons } from "@/lib/api-client";
import { Person } from "@/models/Person";
import { AuthGuard } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";
import RoleDebugger from "@/Components/Admin/RoleDebugger";

export default function RoleDebugPage() {
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerson = async () => {
      try {
        // Cargar la primera persona para pruebas
        const persons = await getAllPersons();
        if (persons && persons.length > 0) {
          setPerson(persons[0]);
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        setError("No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    };

    loadPerson();
  }, []);

  return (
    <AuthGuard requiredRole={Role.ADMIN}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Depuración de Sistema de Roles
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <RoleDebugger />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notas Técnicas
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Roles en el Backend:</strong> Los roles se almacenan
                  como "Admin", "Profesor", "Alumno" (primera letra mayúscula)
                </li>
                <li>
                  <strong>Consistencia:</strong> Asegúrate de que todos los
                  componentes manejen correctamente estos formatos
                </li>
                <li>
                  <strong>Actualización de Roles:</strong> Después de cambiar un
                  rol, puede ser necesario refrescar la sesión
                </li>
                <li>
                  <strong>Rol vs Permisos:</strong> El sistema usa ambos, pero
                  el rol tiene precedencia para la interfaz
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
