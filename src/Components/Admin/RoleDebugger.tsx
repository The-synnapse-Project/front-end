"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { getRoleDisplayName } from "@/lib/role-utils";
import { updatePerson } from "@/lib/api-client";

/**
 * Componente para depurar problemas con el sistema de roles
 * Solo visible para administradores
 */
export default function RoleDebugger() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userId = session?.user?.id;
  const currentRole = session?.user?.role;

  // Logs del estado actual
  const debugInfo = {
    "ID de Usuario": userId || "No disponible",
    "Rol Actual": currentRole || "Sin rol",
    "Nombre de Rol": getRoleDisplayName(currentRole || ""),
    Permisos: JSON.stringify(session?.user?.permissions || {}, null, 2),
    "Formato de rol":
      typeof currentRole === "string"
        ? `String: "${currentRole}"`
        : "No es string",
  };

  const refreshSession = async () => {
    try {
      setLoading(true);
      setMessage("Actualizando sesión...");
      await updateSession();
      setMessage("Sesión actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la sesión:", error);
      setMessage("Error al actualizar la sesión");
    } finally {
      setLoading(false);
    }
  };

  const testUpdate = async (newRole: string) => {
    if (!userId) {
      setMessage("No hay ID de usuario disponible");
      return;
    }

    try {
      setLoading(true);
      setMessage(`Cambiando rol a: ${newRole}...`);

      await updatePerson(userId, { role: newRole });
      await updateSession();

      setMessage(`Rol actualizado a: ${newRole}`);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      setMessage(`Error al actualizar el rol: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Depurador de Roles 🔧
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Información de Depuración
        </h3>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
          <pre className="text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
            {Object.entries(debugInfo).map(
              ([key, value]) => `${key}: ${value}\n`,
            )}
          </pre>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Pruebas de Rol
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => testUpdate("Admin")}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md disabled:opacity-50"
          >
            Cambiar a Admin
          </button>
          <button
            onClick={() => testUpdate("Profesor")}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Cambiar a Profesor
          </button>
          <button
            onClick={() => testUpdate("Alumno")}
            disabled={loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            Cambiar a Alumno
          </button>
          <button
            onClick={refreshSession}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md disabled:opacity-50"
          >
            Refrescar Sesión
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md ${message.includes("Error") ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
