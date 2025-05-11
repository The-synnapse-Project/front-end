"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { changePassword } from "@/lib/api-client";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      setError("Por favor, complete todos los campos.");
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return false;
    }

    // Password validation
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await changePassword(email, oldPassword, newPassword);

      if (result?.status === "ok") {
        setSuccess(true);
        // Display success message for 3 seconds, then redirect to login
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else if (
        result?.status === "error" &&
        result.message === "Current password is incorrect"
      ) {
        setError("La contraseña actual es incorrecta.");
      } else if (
        result?.status === "error" &&
        result.message === "User not found"
      ) {
        setError("No se encontró un usuario con este correo electrónico.");
      } else {
        setError("No se pudo cambiar la contraseña. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Change password error:", error);
      setError(
        "Error al cambiar la contraseña. Por favor, inténtelo de nuevo más tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-dark-primary p-8 shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transition-all duration-300 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300">
          Cambiar Contraseña
        </h1>
        <p className="mb-6 text-center text-light-txt-secondary dark:text-dark-txt-secondary">
          Ingrese sus credenciales para cambiar su contraseña
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-4 text-red-700 dark:text-red-400 flex items-center space-x-3 animate-fade-in">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-red-500 dark:text-red-400"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 p-4 text-green-700 dark:text-green-400 flex items-center space-x-3 animate-fade-in">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-green-500 dark:text-green-400"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              Contraseña cambiada correctamente. Redirigiendo a la página de
              inicio de sesión...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-light-txt-primary dark:text-dark-txt-primary"
            >
              Correo electrónico
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-light-secondary/20 dark:border-dark-secondary/20 rounded-md shadow-sm placeholder-light-txt-secondary/50 dark:placeholder-dark-txt-secondary/50 focus:outline-none focus:ring-light-accent dark:focus:ring-dark-accent focus:border-light-accent dark:focus:border-dark-accent sm:text-sm bg-white dark:bg-dark-primary text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="old-password"
              className="block text-sm font-medium text-light-txt-primary dark:text-dark-txt-primary"
            >
              Contraseña actual
            </label>
            <div className="mt-1">
              <input
                id="old-password"
                name="old-password"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-light-secondary/20 dark:border-dark-secondary/20 rounded-md shadow-sm placeholder-light-txt-secondary/50 dark:placeholder-dark-txt-secondary/50 focus:outline-none focus:ring-light-accent dark:focus:ring-dark-accent focus:border-light-accent dark:focus:border-dark-accent sm:text-sm bg-white dark:bg-dark-primary text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-light-txt-primary dark:text-dark-txt-primary"
            >
              Nueva contraseña
            </label>
            <div className="mt-1">
              <input
                id="new-password"
                name="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-light-secondary/20 dark:border-dark-secondary/20 rounded-md shadow-sm placeholder-light-txt-secondary/50 dark:placeholder-dark-txt-secondary/50 focus:outline-none focus:ring-light-accent dark:focus:ring-dark-accent focus:border-light-accent dark:focus:border-dark-accent sm:text-sm bg-white dark:bg-dark-primary text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-light-txt-primary dark:text-dark-txt-primary"
            >
              Confirmar nueva contraseña
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-light-secondary/20 dark:border-dark-secondary/20 rounded-md shadow-sm placeholder-light-txt-secondary/50 dark:placeholder-dark-txt-secondary/50 focus:outline-none focus:ring-light-accent dark:focus:ring-dark-accent focus:border-light-accent dark:focus:border-dark-accent sm:text-sm bg-white dark:bg-dark-primary text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-light-accent hover:text-light-accent-hover dark:text-dark-accent dark:hover:text-dark-accent-hover transition-colors duration-300"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
