"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { forgotPassword, resetPasswordWithToken } from "@/lib/api-client";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchParams = useSearchParams();
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Por favor, ingrese su correo electrónico.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      if (!response) {
        setError("Error al enviar el correo. Por favor, inténtelo de nuevo.");
        return;
      }
      if (response.status !== "ok") {
        setError(response.message || "Error al enviar el correo.");
        return;
      }

      setEmailSent(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError(
        "Error al enviar el correo. Por favor, inténtelo de nuevo más tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPasswordWithToken(
        token as string,
        newPassword,
      );

      if (response) {
        if (response.status === "ok") {
          setSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setError(response.message || "Error al restablecer la contraseña.");
        }
      } else {
        setError(
          "Error al restablecer la contraseña. Por favor, inténtelo de nuevo.",
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(
        "Error al restablecer la contraseña. Por favor, inténtelo de nuevo más tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent && !token) {
    return (
      <div className="fixed inset-0 flex overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
        <div className="w-full max-w-md rounded-xl bg-white dark:bg-dark-primary p-8 shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transition-all duration-300 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary">
            Correo Enviado
          </h1>
          <p className="mb-6 text-center text-light-txt-secondary dark:text-dark-txt-secondary">
            Hemos enviado un enlace para restablecer tu contraseña a{" "}
            <span className="font-medium text-light-txt-primary dark:text-dark-txt-primary">
              {email}
            </span>
          </p>
          <p className="mb-6 text-center text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
            Revisa tu bandeja de entrada y haz clic en el enlace para
            restablecer tu contraseña. El enlace expirará en 1 hora.
          </p>
          <div className="text-center">
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

  return (
    <div className="fixed inset-0 flex overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-dark-primary p-8 shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transition-all duration-300 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white shadow-md">
            {token ? (
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
            ) : (
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300">
          {token ? "Nueva Contraseña" : "¿Olvidaste tu contraseña?"}
        </h1>
        <p className="mb-6 text-center text-light-txt-secondary dark:text-dark-txt-secondary">
          {token
            ? "Ingresa tu nueva contraseña"
            : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"}
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
              Contraseña restablecida correctamente. Redirigiendo al inicio de
              sesión...
            </div>
          </div>
        )}

        {token ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
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
                  placeholder="Mínimo 8 caracteres"
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
                  placeholder="Confirme su nueva contraseña"
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
                  "Restablecer Contraseña"
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
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
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Enviar Enlace de Restablecimiento"
                )}
              </button>
            </div>
          </form>
        )}

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

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md mb-4"></div>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Cargando página de restablecimiento de contraseña...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
