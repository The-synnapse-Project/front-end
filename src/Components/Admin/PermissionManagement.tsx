import React, { useState } from "react";
import { Person } from "@/models/Person";
import { Permission, Role } from "@/models/Permission";
import { updatePermission, updatePerson } from "@/lib/api-client";
import { getRoleDisplayName, getRoleStyleClass } from "@/lib/role-utils";

interface PermissionManagementProps {
  persons: Person[];
  permissions: Permission[];
  onUpdate?: () => void;
}

// Componente para la celda de toggle de permisos
interface PermissionToggleCellProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function PermissionToggleCell({
  checked,
  onChange,
  disabled = false,
}: PermissionToggleCellProps) {
  return (
    <td className="px-3 py-4 whitespace-nowrap text-center">
      <div className="flex justify-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </td>
  );
}

export default function PermissionManagement({
  persons,
  permissions,
  onUpdate,
}: PermissionManagementProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "">("");

  // Mapear permisos a sus personas correspondientes para una gestión más fácil
  const permissionsMap = new Map<string, Permission>();
  permissions.forEach((permission) => {
    if (permission.personId) {
      permissionsMap.set(permission.personId, permission);
    }
  });

  // Filtrar personas en base a la búsqueda y rol
  const filteredPersons = persons.filter((person) => {
    const fullName = `${person.name} ${person.surname || ""}`.toLowerCase();
    const email = person.email?.toLowerCase() || "";
    const userPermission = permissionsMap.get(person.id || "");
    const userRole = person.role || userPermission?.getRole();

    // Aplicar filtrado por búsqueda
    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    // Aplicar filtrado por rol - Compatible con diferentes formatos de rol
    const matchesRole =
      filterRole === "" ||
      userRole === filterRole ||
      // Comparación insensible a mayúsculas/minúsculas
      userRole?.toLowerCase() === filterRole?.toLowerCase();

    console.log(
      `Usuario ${person.name}, rol=${userRole}, buscando=${filterRole}, coincide=${matchesRole}`,
    );

    return matchesSearch && matchesRole;
  });

  // Manejar cambios en los permisos
  const handlePermissionChange = async (
    personId: string,
    permissionKey: string,
  ) => {
    if (!personId || loading) return;

    try {
      setLoading(true);
      const existingPermission = permissionsMap.get(personId);

      if (existingPermission) {
        // Crear permiso actualizado
        const updatedPermission = new Permission(
          existingPermission.id,
          personId,
          {
            ...existingPermission,
            [permissionKey]:
              !existingPermission[permissionKey as keyof Permission],
          },
        );

        // Actualizar permiso en la API
        await updatePermission(
          existingPermission.id,
          updatedPermission.toApiRequest(),
        );

        // Actualizar mapa local
        permissionsMap.set(personId, updatedPermission);

        // Llamar a la función onUpdate si se proporciona
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error(`Error al actualizar el permiso para ${personId}:`, error);
    } finally {
      setLoading(false);
    }
  }; // Manejar cambios en el rol
  const handleRoleChange = async (personId: string, newRole: string) => {
    if (!personId || loading) return;

    try {
      setLoading(true);

      console.log(`Actualizando rol para usuario ${personId} a: ${newRole}`);

      // Actualizar el rol en la API
      await updatePerson(personId, { role: newRole });

      // Llamar a la función onUpdate si se proporciona
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(`Error al actualizar el rol para ${personId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="permission-search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Buscar Usuarios
          </label>
          <input
            type="text"
            id="permission-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o email"
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="role-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filtrar por Rol
          </label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Role | "")}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todos los Roles</option>
            <option value={Role.ADMIN}>Administrador</option>
            <option value={Role.PROFESOR}>Profesor</option>
            <option value={Role.ALUMNO}>Estudiante</option>
          </select>
        </div>
      </div>

      {/* Tabla de Permisos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Usuario
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Rol
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Dashboard
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Historial Propio
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Historial Otros
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Panel Admin
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Editar Permisos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPersons.map((person) => {
              const personId = person.id || "";
              const permission = permissionsMap.get(personId);
              const userRole =
                person.role ||
                (permission ? permission.getRole() : Role.ALUMNO);

              return (
                <tr
                  key={personId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {person.picture && (
                        <div className="flex-shrink-0 h-8 w-8 mr-3">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={person.picture}
                            alt={`${person.name}'s profile picture`}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {person.name} {person.surname}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {person.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={userRole}
                      onChange={(e) =>
                        handleRoleChange(personId, e.target.value)
                      }
                      disabled={loading}
                      className="text-sm rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Admin">
                        {getRoleDisplayName("Admin")}
                      </option>
                      <option value="Profesor">
                        {getRoleDisplayName("Profesor")}
                      </option>
                      <option value="Alumno">
                        {getRoleDisplayName("Alumno")}
                      </option>
                    </select>
                  </td>
                  {/* Resto de las celdas para los permisos */}
                  {permission && (
                    <>
                      <PermissionToggleCell
                        checked={permission.dashboard}
                        onChange={() =>
                          handlePermissionChange(personId, "dashboard")
                        }
                        disabled={loading}
                      />
                      <PermissionToggleCell
                        checked={permission.seeSelfHistory}
                        onChange={() =>
                          handlePermissionChange(personId, "seeSelfHistory")
                        }
                        disabled={loading}
                      />
                      <PermissionToggleCell
                        checked={permission.seeOthersHistory}
                        onChange={() =>
                          handlePermissionChange(personId, "seeOthersHistory")
                        }
                        disabled={loading}
                      />
                      <PermissionToggleCell
                        checked={permission.adminPanel}
                        onChange={() =>
                          handlePermissionChange(personId, "adminPanel")
                        }
                        disabled={loading}
                      />
                      <PermissionToggleCell
                        checked={permission.editPermissions}
                        onChange={() =>
                          handlePermissionChange(personId, "editPermissions")
                        }
                        disabled={loading}
                      />
                    </>
                  )}
                  {!permission && (
                    <td
                      colSpan={5}
                      className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400"
                    >
                      No hay permisos asignados
                    </td>
                  )}
                </tr>
              );
            })}
            {filteredPersons.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400"
                >
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
