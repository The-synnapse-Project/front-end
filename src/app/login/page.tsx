"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Redirigir al dashboard si el usuario ya está autenticado
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // No renderizar el formulario de inicio de sesión si el usuario está autenticado o mientras se verifica el estado de autenticación
  if (status === "authenticated" || status === "loading") {
    return (
      <div className="fixed inset-0 flex overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md"></div>
        <p className="mt-4 text-light-txt-secondary dark:text-dark-txt-secondary">
          {status === "authenticated"
            ? "Redirigiendo al panel..."
            : "Cargando..."}
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.log("Error de inicio de sesión:", result.error);
        setError("Correo electrónico o contraseña inválidos");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Ha ocurrido un error. Por favor, inténtelo de nuevo.");
      console.error("Error de inicio de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-dark-primary p-8 shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transition-all duration-300 animate-fade-in overflow-y-auto max-h-[90vh]">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary transition-colors duration-300">
          Bienvenido a Synnapse
        </h1>
        <p className="mb-6 text-center text-light-txt-secondary dark:text-dark-txt-secondary">
          Inicia sesión para acceder a tu cuenta
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
              <h3 className="font-medium">Error de autenticación</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary transition-colors duration-300"
            >
              Correo electrónico
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

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
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
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Iniciar sesión con email
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

          <div className="mt-6">
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
              Iniciar sesión con Google
            </button>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary text-sm mt-5 w-full text-center">
              ¿No tienes una cuenta?
              <Link
                href="/register"
                className="ml-2 text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover font-medium"
              >
                Registrarse
              </Link>
            </p>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary text-sm mt-5 w-full text-center">
              ¿Has olvidado tu contraseña?
              <Link
                href="/reset-password"
                className="ml-2 text-light-accent dark:text-dark-accent hover:text-light-accent-hover dark:hover:text-dark-accent-hover font-medium"
              >
                Restablecer contraseña
              </Link>
            </p>
            <p className="text-center mt-6 text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
              Al iniciar sesión, aceptas nuestros
              <a
                href="#"
                className="text-light-accent dark:text-dark-accent hover:underline ml-1"
              >
                Términos de Servicio
              </a>{" "}
              y
              <a
                href="#"
                className="text-light-accent dark:text-dark-accent hover:underline ml-1"
              >
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
