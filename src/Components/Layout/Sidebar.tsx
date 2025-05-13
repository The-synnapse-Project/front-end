"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";

interface NavItem {
  href: string;
  label: string;
  requiredRoles?: Role[];
}

const Sidebar = () => {
  const pathname = usePathname();
  const { user, permissions, role } = useAuth();

  // Definir elementos de navegación basados en roles
  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Panel Principal" },
    {
      href: "/dashboard/alumno",
      label: "Portal del Estudiante",
      requiredRoles: [Role.ALUMNO],
    },
    {
      href: "/dashboard/profesor",
      label: "Portal del Profesor",
      requiredRoles: [Role.PROFESOR],
    },
    {
      href: "/dashboard/admin",
      label: "Panel de Administración",
      requiredRoles: [Role.ADMIN],
    },
    { href: "/profile", label: "Mi Perfil" },
  ];

  const userRoles = role;

  // Filtrar elementos de navegación basados en los roles del usuario
  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.some((role) => role === userRoles);
  });

  return (
    <aside className="w-64 bg-white dark:bg-dark-primary h-full border-r border-light-secondary/10 dark:border-dark-secondary/10">
      <div className="p-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent mb-6">
          Synnapse
        </h2>

        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent"
                    : "text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/5 dark:hover:bg-dark-secondary/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 border-t border-light-secondary/10 dark:border-dark-secondary/10">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary">
              {userRoles}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
