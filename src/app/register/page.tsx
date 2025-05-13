"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Redirigir al panel si el usuario ya está autenticado
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // No renderizar el formulario de registro si el usuario está autenticado o mientras se verifica el estado de autenticación
  if (status === "authenticated" || status === "loading") {
    return (
      <div className="flex h-screen overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md"></div>
        <p className="mt-4 text-light-txt-secondary dark:text-dark-txt-secondary">
          {status === "authenticated"
            ? "Redirigiendo al panel..."
            : "Cargando..."}
        </p>
      </div>
    );
  }

  const validateForm = () => {
    if (!name || !surname || !email || !password || !confirmPassword) {
      setError("Por favor, complete todos los campos.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return false;
    }

    // Validación de fortaleza de contraseña
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
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
      // Registrar al usuario con nuestra nueva API
      const result = await register(name, surname, email, password);

      if (result?.status === "ok") {
        setSuccess(true);
        // Redirigir al inicio de sesión después de 2 segundos
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (
        result?.status === "error" &&
        result.message === "Email already registered"
      ) {
        setError("Ya existe un usuario con este correo electrónico.");
      } else {
        setError("Error al crear la cuenta. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error de registro:", error);
      setError(
        "Error al crear la cuenta. Por favor, inténtelo de nuevo más tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="mt-16 fixed inset-0 flex overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-dark-primary p-8 shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transition-all duration-300 animate-fade-in overflow-y-auto max-h-screen">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300">
          Crear una nueva cuenta
        </h1>
        <p className="mb-6 text-center text-light-txt-secondary dark:text-dark-txt-secondary">
          Regístrate para acceder a tu panel de control
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
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
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
              <h3 className="font-medium">Éxito</h3>
              <p className="text-sm mt-1">
                Tu cuenta ha sido creada correctamente. Serás redirigido en unos
                momentos...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-light-secondary/30 dark:border-dark-secondary/30 bg-light-background/50 dark:bg-dark-secondary/10 px-4 py-2.5 text-light-txt-primary dark:text-dark-txt-primary shadow-sm focus:border-light-accent dark:focus:border-dark-accent focus:outline-none focus:ring-light-accent/20 dark:focus:ring-dark-accent/30 transition-colors duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300"
              >
                Apellido
              </label>
              <input
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-light-secondary/30 dark:border-dark-secondary/30 bg-light-background/50 dark:bg-dark-secondary/10 px-4 py-2.5 text-light-txt-primary dark:text-dark-txt-primary shadow-sm focus:border-light-accent dark:focus:border-dark-accent focus:outline-none focus:ring-light-accent/20 dark:focus:ring-dark-accent/30 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-light-secondary/30 dark:border-dark-secondary/30 bg-light-background/50 dark:bg-dark-secondary/10 px-4 py-2.5 text-light-txt-primary dark:text-dark-txt-primary shadow-sm focus:border-light-accent dark:focus:border-dark-accent focus:outline-none focus:ring-light-accent/20 dark:focus:ring-dark-accent/30 transition-colors duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-light-secondary/30 dark:border-dark-secondary/30 bg-light-background/50 dark:bg-dark-secondary/10 px-4 py-2.5 text-light-txt-primary dark:text-dark-txt-primary shadow-sm focus:border-light-accent dark:focus:border-dark-accent focus:outline-none focus:ring-light-accent/20 dark:focus:ring-dark-accent/30 transition-colors duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-light-secondary/30 dark:border-dark-secondary/30 bg-light-background/50 dark:bg-dark-secondary/10 px-4 py-2.5 text-light-txt-primary dark:text-dark-txt-primary shadow-sm focus:border-light-accent dark:focus:border-dark-accent focus:outline-none focus:ring-light-accent/20 dark:focus:ring-dark-accent/30 transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full rounded-md bg-light-accent dark:bg-dark-accent px-4 py-3 text-white font-medium hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:ring-offset-2 disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Registrarse
                </span>
              )}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-secondary dark:border-dark-secondary transition-colors duration-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-dark-primary text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300">
                O continuar con Google
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 rounded-md border border-light-secondary/30 dark:border-dark-secondary/30 bg-white dark:bg-dark-secondary/20 px-4 py-3 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-light-background dark:hover:bg-dark-secondary/30 hover:shadow-md transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="w-5 h-5"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Registrate con Google
          </button>

          <p className="text-light-txt-secondary dark:text-dark-txt-secondary text-sm mt-5">
            ¿Ya tienes una cuenta?
            <Link
              href="/login"
              className="ml-2 text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
          <p className="text-center mt-4 text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
            Al registrarte, aceptas nuestros
            <a
              href="/terms"
              className="text-light-accent dark:text-dark-accent hover:underline ml-1"
            >
              Términos de Servicio
            </a>{" "}
            y
            <a
              href="/privacy"
              className="text-light-accent dark:text-dark-accent hover:underline ml-1"
            >
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
