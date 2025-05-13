"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error en un servicio de informes de errores
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-light-background dark:bg-dark-background text-light-txt-primary dark:text-dark-txt-primary">
      <div className="max-w-lg w-full bg-white dark:bg-dark-primary p-8 rounded-lg shadow-md border border-light-secondary/10 dark:border-dark-secondary/10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-light-accent/10 dark:bg-dark-accent/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-light-accent dark:text-dark-accent"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Algo ha salido mal</h1>
          <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-8">
            Lo sentimos, pero ha ocurrido algo inesperado. Puedes intentar reiniciar
            la aplicación o volver a la página principal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={reset}
              className="px-6 py-3 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-transparent border border-light-accent text-light-accent hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10 rounded-md transition-all duration-300 w-full sm:w-auto"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
