"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import LoginButton from "@/Components/LoginButton";
import ThemeToggle from "@/Components/ThemeToggle";
import { Role } from "@/models/Permission";

interface NavItem {
  name: string;
  href: string;
  roles?: Role[]; // Optional roles that can see this nav item
}

interface DashboardItem {
  name: string;
  href: string;
  role: Role;
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const handleCloseMenu = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDashboardDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define los elementos de navegación con restricciones opcionales de roles
  const navItems: NavItem[] = [
    { name: "Inicio", href: "/" },
    {
      name: "Perfil",
      href: "/profile",
      roles: [Role.ADMIN, Role.PROFESOR, Role.ALUMNO],
    },
    { name: "Sobre nosotros", href: "/about" },
  ];

  // Define dashboard options based on role
  const dashboardItems: DashboardItem[] = [
    { name: "Dashboard Admin", href: "/dashboard/admin", role: Role.ADMIN },
    {
      name: "Dashboard Profesor",
      href: "/dashboard/profesor",
      role: Role.PROFESOR,
    },
    { name: "Dashboard Alumno", href: "/dashboard/alumno", role: Role.ALUMNO },
  ];

  // Filter dashboard items based on user role
  const getAvailableDashboards = (): DashboardItem[] => {
    if (!userRole) return [];

    switch (userRole as Role) {
      case Role.ADMIN:
        return dashboardItems; // Admin can see all dashboards
      case Role.PROFESOR:
        return dashboardItems.filter(
          (item) => item.role === Role.PROFESOR || item.role === Role.ALUMNO,
        ); // Professor can see profesor and alumno dashboards
      case Role.ALUMNO:
        return dashboardItems.filter((item) => item.role === Role.ALUMNO); // Student can only see alumno dashboard
      default:
        return [];
    }
  };

  const availableDashboards = getAvailableDashboards();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true; // Items without role restrictions are always shown
    return userRole && item.roles.includes(userRole as Role);
  });

  return (
    <>
      <nav className="bg-white/90 dark:bg-dark-primary/95 backdrop-blur-md shadow-sm border-b border-light-secondary/10 dark:border-dark-secondary/10 w-full transition-colors duration-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-light-accent dark:text-dark-accent font-bold text-xl mr-1">
                    Syn
                    <span className="text-light-txt-primary dark:text-dark-txt-primary">
                      napse
                    </span>
                  </span>
                </Link>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-1">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent hover:bg-light-secondary/10 dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Dashboard Dropdown or Single Link */}
                  {userRole &&
                    availableDashboards.length > 0 &&
                    (availableDashboards.length === 1 ? (
                      // Single dashboard link for ALUMNO
                      <Link
                        href={availableDashboards[0].href}
                        className="text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent hover:bg-light-secondary/10 dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      // Dropdown for ADMIN and PROFESOR
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() =>
                            setIsDashboardDropdownOpen(!isDashboardDropdownOpen)
                          }
                          className="text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent hover:bg-light-secondary/10 dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <span>Dashboard</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isDashboardDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {isDashboardDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-dark-primary rounded-md shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 z-50">
                            <div className="py-1">
                              {availableDashboards.map((dashboard) => (
                                <Link
                                  key={dashboard.href}
                                  href={dashboard.href}
                                  className="block px-4 py-2 text-sm text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/20 hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-200"
                                  onClick={() =>
                                    setIsDashboardDropdownOpen(false)
                                  }
                                >
                                  {dashboard.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>{" "}
            {/* Auth buttons and Theme Toggle */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              <LoginButton isMobile={false} onNavigate={handleCloseMenu} />
            </div>
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              <button
                onClick={isOpen ? handleCloseMenu : handleOpenMenu}
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent hover:bg-light-secondary/10 dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 focus:outline-none transition-colors duration-200"
              >
                <svg
                  className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Abrir menú"
                >
                  <title>Abrir menú</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Cerrar menú"
                >
                  <title>Cerrar menú</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Overlay (separated from nav) */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black z-[9998] md:hidden ${isClosing ? "fade-out" : "fade-in"}`}
          onClick={handleCloseMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className={`fixed inset-y-0 right-0 max-w-xs w-[85%] bg-white dark:bg-dark-primary shadow-lg overflow-y-auto z-[9999] ${isClosing ? "slide-out" : "slide-in"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-5 pb-4 flex">
              <button
                type="button"
                className="ml-auto inline-flex items-center justify-center p-2 rounded-md text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-accent hover:bg-light-secondary/10 dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 focus:outline-none"
                onClick={handleCloseMenu}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Cerrar menú"
                >
                  <title>Cerrar menú</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 hover:text-light-accent dark:hover:bg-dark-secondary/20 dark:hover:text-dark-accent block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={handleCloseMenu}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Dashboard Links */}
              {userRole &&
                availableDashboards.length > 0 &&
                (availableDashboards.length === 1 ? (
                  // Single dashboard link for ALUMNO
                  <Link
                    href={availableDashboards[0].href}
                    className="text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 hover:text-light-accent dark:hover:bg-dark-secondary/20 dark:hover:text-dark-accent block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={handleCloseMenu}
                  >
                    Dashboard
                  </Link>
                ) : (
                  // Multiple dashboard links for ADMIN and PROFESOR
                  <>
                    <div className="px-3 py-2 text-sm font-semibold text-light-txt-primary dark:text-dark-txt-primary uppercase tracking-wide">
                      Dashboards
                    </div>
                    {availableDashboards.map((dashboard) => (
                      <Link
                        key={dashboard.href}
                        href={dashboard.href}
                        className="text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 hover:text-light-accent dark:hover:bg-dark-secondary/20 dark:hover:text-dark-accent block px-6 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        onClick={handleCloseMenu}
                      >
                        {dashboard.name}
                      </Link>
                    ))}
                  </>
                ))}

              {/* Mobile auth buttons */}
              <div className="mt-4 pt-4 border-t border-light-secondary/20 dark:border-dark-secondary/20">
                <LoginButton isMobile={true} onNavigate={handleCloseMenu} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
