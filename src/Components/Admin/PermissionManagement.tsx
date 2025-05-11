import React, { useState } from "react";
import { Person } from "@/models/Person";
import { Permission, Role } from "@/models/Permission";
import { updatePermission } from "@/lib/api-client";

interface PermissionManagementProps {
  persons: Person[];
  permissions: Permission[];
  onUpdate?: () => void;
}

export default function PermissionManagement({
  persons,
  permissions,
  onUpdate,
}: PermissionManagementProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "">("");

  // Map permissions to their corresponding persons for easier management
  const permissionsMap = new Map<string, Permission>();
  permissions.forEach((permission) => {
    if (permission.personId) {
      permissionsMap.set(permission.personId, permission);
    }
  });

  // Filter persons based on search and role
  const filteredPersons = persons.filter((person) => {
    const fullName = `${person.name} ${person.surname || ""}`.toLowerCase();
    const email = (person.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      fullName.includes(query) || email.includes(query) || !query;

    // Only filter by role if a role is selected
    if (!filterRole) return matchesSearch;

    // Get person's permission
    const personPermission = permissionsMap.get(person.id || "");
    if (!personPermission) return false;

    // Check if role matches
    return personPermission.getRole() === filterRole && matchesSearch;
  });

  const handleRoleChange = async (personId: string, newRole: Role) => {
    if (!personId) return;

    setLoading(true);
    try {
      const existingPermission = permissionsMap.get(personId);

      if (existingPermission) {
        // Create new permission based on role
        const updatedPermission = Permission.fromRole(
          existingPermission.id,
          personId,
          newRole,
        );

        // Update permission in API
        await updatePermission(
          existingPermission.id,
          updatedPermission.toApiRequest(),
        );

        // Update local map
        permissionsMap.set(personId, updatedPermission);

        // Call onUpdate callback if provided
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error(`Error updating permission for ${personId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (
    personId: string,
    permissionKey: keyof Permission,
  ) => {
    if (!personId || typeof permissionKey !== "string") return;
    if (
      ![
        "dashboard",
        "seeSelfHistory",
        "seeOthersHistory",
        "adminPanel",
        "editPermissions",
      ].includes(permissionKey)
    )
      return;

    setLoading(true);
    try {
      const existingPermission = permissionsMap.get(personId);

      if (existingPermission) {
        // Create updated permission
        const updatedPermission = new Permission(
          existingPermission.id,
          personId,
          {
            ...existingPermission,
            [permissionKey]:
              !existingPermission[permissionKey as keyof Permission],
          },
        );

        // Update permission in API
        await updatePermission(
          existingPermission.id,
          updatedPermission.toApiRequest(),
        );

        // Update local map
        permissionsMap.set(personId, updatedPermission);

        // Call onUpdate callback if provided
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error(`Error updating permission for ${personId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="permission-search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Search Users
          </label>
          <input
            type="text"
            id="permission-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email"
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="role-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filter by Role
          </label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Role | "")}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Roles</option>
            <option value={Role.ADMIN}>Admin</option>
            <option value={Role.PROFESOR}>Teacher</option>
            <option value={Role.ALUMNO}>Student</option>
          </select>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Role
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
                Self History
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Others History
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Admin Panel
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Edit Permissions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPersons.length > 0 ? (
              filteredPersons.map((person) => {
                const permission = permissionsMap.get(person.id || "");
                const role = permission?.getRole() || Role.ALUMNO;

                return (
                  <tr
                    key={person.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center">
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
                                {person.surname ? person.surname.charAt(0) : ""}
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
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <select
                        value={role}
                        onChange={(e) =>
                          handleRoleChange(
                            person.id || "",
                            e.target.value as Role,
                          )
                        }
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        disabled={loading}
                      >
                        <option value={Role.ADMIN}>Admin</option>
                        <option value={Role.PROFESOR}>Teacher</option>
                        <option value={Role.ALUMNO}>Student</option>
                      </select>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permission?.dashboard || false}
                        onChange={() =>
                          handlePermissionToggle(person.id || "", "dashboard")
                        }
                        disabled={loading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permission?.seeSelfHistory || false}
                        onChange={() =>
                          handlePermissionToggle(
                            person.id || "",
                            "seeSelfHistory",
                          )
                        }
                        disabled={loading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permission?.seeOthersHistory || false}
                        onChange={() =>
                          handlePermissionToggle(
                            person.id || "",
                            "seeOthersHistory",
                          )
                        }
                        disabled={loading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permission?.adminPanel || false}
                        onChange={() =>
                          handlePermissionToggle(person.id || "", "adminPanel")
                        }
                        disabled={loading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permission?.editPermissions || false}
                        onChange={() =>
                          handlePermissionToggle(
                            person.id || "",
                            "editPermissions",
                          )
                        }
                        disabled={loading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
