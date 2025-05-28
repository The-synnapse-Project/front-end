"use client";

import { useEffect, useState } from "react";
import { getAllPersons } from "@/lib/api-client";
import { AuthGuard } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";
import RoleDebugger from "@/Components/Admin/RoleDebugger";

export default function RoleDebugPage() {
  return (
    <AuthGuard requiredRole={Role.ADMIN}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Depuración de Sistema de Roles
        </h1>

        <RoleDebugger />

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Notas Técnicas
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Roles en el Backend:</strong> Los roles se almacenan como
              &quot;Admin&quot;, &quot;Profesor&quot;, &quot;Alumno&quot;
              (primera letra mayúscula)
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
              <strong>Rol vs Permisos:</strong> El sistema usa ambos, pero el
              rol tiene precedencia para la interfaz
            </li>
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
}
