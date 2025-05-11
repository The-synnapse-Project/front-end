"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api-client";
import { Role } from "@/models/Permission";

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

  const validateForm = () => {
    if (!name || !surname || !email || !password || !confirmPassword) {
      setError("Por favor, complete todos los campos.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return false;
    }

    // Password strength validation
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
      // Register the user with our new API
      const result = await register(name, surname, email, password);

      if (result?.status === "ok") {
        setSuccess(true);
        // Redirect to login after 2 seconds
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
      console.error("Registration error:", error);
      setError(
        "Error al crear la cuenta. Por favor, inténtelo de nuevo más tarde.",
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
          Regístrate para acceder a tu dashboard
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

        <div className="mt-6 text-center">
          <p className="text-light-txt-secondary dark:text-dark-txt-secondary text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
