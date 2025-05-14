import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  isMobile?: boolean;
  onNavigate?: () => void; // Callback para cuando ocurre la navegación
}

export default function LoginButton({
  isMobile = false,
  onNavigate,
}: LoginButtonProps) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    if (isMobile) return; // No activar dropdown en modo móvil
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    // Si se proporcionó un callback de navegación, llamarlo
    if (onNavigate) onNavigate();
  };

  const handleSignIn = () => {
    // Navegar a la página de login en lugar de activar directamente el inicio de sesión
    handleNavigation("/login");
  };

  if (session) {
    // Mostrar información del usuario conectado
    const displayName = session.user?.name || session.user?.email || "Usuario";
    // Si tenemos un apellido de la API, usarlo para mostrar
    const fullName = session.user?.surname
      ? `${session.user.name} ${session.user.surname}`
      : displayName;

    // Para el menú móvil, renderizar solo los enlaces de perfil sin un dropdown
    if (isMobile) {
      return (
        <div className="space-y-3 pt-2">
          <div className="flex items-center px-3 pb-2">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Perfil"
                className="h-8 w-8 rounded-full border-2 border-light-accent/20 dark:border-dark-accent/30 mr-3"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white font-medium shadow-sm mr-3">
                {session.user?.name?.charAt(0) ||
                  session.user?.email?.charAt(0) ||
                  "U"}
              </div>
            )}
            <div>
              <p className="font-medium text-light-txt-primary dark:text-dark-txt-primary">
                {fullName}
              </p>
              <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary truncate">
                {session.user?.email}
              </p>
            </div>
          </div>

          <a
            href="/profile"
            className="flex items-center px-3 py-2 text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 hover:text-light-accent dark:hover:bg-dark-secondary/20 dark:hover:text-dark-accent rounded-md transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/profile");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Mi Perfil
          </a>

          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
              if (onNavigate) onNavigate();
            }}
            className="flex items-center w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm6.293 11.293a1 1 0 001.414 0L13 11.414l2.293 2.293a1 1 0 001.414-1.414l-2.293-2.293 2.293-2.293a1 1 0 00-1.414-1.414L13 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L11.586 10l-2.293 2.293a1 1 0 000 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        <div
          className="flex items-center space-x-2 cursor-pointer px-3 py-2 text-light-txt-primary hover:text-light-accent hover:bg-light-secondary/10 dark:text-dark-txt-primary dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 rounded-md transition-all duration-300"
          onClick={toggleDropdown}
        >
          {session.user?.image ? (
            <>
              <img
                src={session.user.image}
                alt="Perfil"
                className="h-8 w-8 rounded-full border-2 border-light-accent/20 dark:border-dark-accent/30"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  setIsDropdownOpen(isDropdownOpen);
                }}
              />
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white font-medium shadow-sm">
              {session.user?.name?.charAt(0) ||
                session.user?.email?.charAt(0) ||
                "U"}
            </div>
          )}
          <span className="hidden md:inline-block">{fullName}</span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-dark-primary border border-light-secondary/20 dark:border-dark-secondary/20 z-40 transition-all duration-200 transform origin-top-right">
            <div className="overflow-hidden rounded-lg">
              <div className="px-4 py-3 text-sm text-light-txt-primary dark:text-dark-txt-primary border-b border-light-secondary/20 dark:border-dark-secondary/20">
                <p className="font-medium">{fullName}</p>
                <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary truncate mt-1">
                  {session.user?.email}
                </p>
              </div>
              <div className="py-1">
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-light-txt-primary hover:text-light-accent hover:bg-light-secondary/10 dark:text-dark-txt-primary dark:hover:text-dark-accent dark:hover:bg-dark-secondary/20 transition-all duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/profile");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mi Perfil
                </a>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    if (onNavigate) onNavigate();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm6.293 11.293a1 1 0 001.414 0L13 11.414l2.293 2.293a1 1 0 001.414-1.414l-2.293-2.293 2.293-2.293a1 1 0 00-1.414-1.414L13 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L11.586 10l-2.293 2.293a1 1 0 000 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Para el menú móvil, renderizar botones de inicio de sesión y registro
  if (isMobile) {
    return (
      <>
        <button
          onClick={handleSignIn}
          className="flex items-center w-full text-left px-3 py-2 text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 hover:text-light-accent dark:hover:bg-dark-secondary/20 dark:hover:text-dark-accent rounded-md transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Iniciar sesión
        </button>
        <button
          onClick={() => handleNavigation("/register")}
          className="flex items-center w-full text-left px-3 py-2 text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary/10 hover:text-light-accent dark:hover:bg-dark-secondary/20 dark:hover:text-dark-accent rounded-md transition-colors duration-200 mt-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Registrarse
        </button>
      </>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleSignIn}
        className="bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:text-white dark:hover:bg-dark-accent-hover px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Iniciar sesión
      </button>
      <button
        onClick={() => handleNavigation("/register")}
        className="border border-light-accent text-light-accent hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10 px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
        Registrarse
      </button>
    </div>
  );
}
