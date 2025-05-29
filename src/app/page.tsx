"use client";
import Balatro from "@/Components/Balatro/Balatro";
import { useTheme } from "@/Components/ThemeContext";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { darkMode } = useTheme();

  return (
    <>
      {/* Static Background - Fixed and stays in place during scroll */}
      <div className="fixed inset-0 w-full h-full z-[-1000] pointer-events-none">
        <Balatro
          color1={darkMode ? "#3b82f6" : "#60a5fa"}
          color2={darkMode ? "#1e293b" : "#3b82f6"}
          color3={darkMode ? "#0f172a" : "#f8fafc"}
          isRotate={false}
          mouseInteraction={true}
          pixelFilter={800}
          className="w-full h-full transition-all duration-700"
        />
      </div>

      {/* Main Content */}
      <div className="min-h-screen relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:px-10 mt-[-40px]">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <h1 className="text-[48px] sm:text-[96px] font-bold leading-tight">
              <span className="bg-gradient-to-r from-light-accent via-light-accent-hover to-light-accent dark:from-dark-accent dark:via-dark-accent-hover dark:to-dark-accent bg-clip-text text-transparent">
                Synnapse
              </span>
            </h1>

            <p className="text-[24px] sm:text-[36px] text-light-txt-secondary dark:text-dark-txt-secondary leading-relaxed">
              Bienvenido a la plataforma del aula inteligente
            </p>

            <p className="text-[16px] sm:text-[20px] text-light-txt-secondary dark:text-dark-txt-secondary opacity-80 max-w-3xl mx-auto">
              Revoluciona tu experiencia educativa con tecnología avanzada,
              seguimiento inteligente y herramientas colaborativas.
            </p>

            <div className="flex gap-6 flex-wrap justify-center mt-12">
              {(session && session.user) || session?.user ? (
                <a
                  href="/dashboard"
                  className="group px-8 py-4 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                >
                  <span className="flex items-center gap-2">
                    Ir al Panel
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="group px-8 py-4 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    <span className="flex items-center gap-2">
                      Iniciar Sesión
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </a>
                  <a
                    href="/profile"
                    className="group px-8 py-4 bg-transparent border-2 border-light-accent text-light-accent hover:bg-light-accent hover:text-white dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent dark:hover:text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    Mi Perfil
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-8 sm:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] sm:text-[48px] font-bold text-light-txt-primary dark:text-dark-txt-primary mb-4">
                Características Principales
              </h2>
              <p className="text-[18px] sm:text-[24px] text-light-txt-secondary dark:text-dark-txt-secondary">
                Descubre las herramientas que harán de tu experiencia educativa
                algo extraordinario
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-light-txt-primary dark:text-dark-txt-primary mb-3">
                  Gestión Inteligente
                </h3>
                <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
                  Sistema avanzado de control de asistencia totalmente
                  automatizado.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-light-txt-primary dark:text-dark-txt-primary mb-3">
                  Analíticas Avanzadas
                </h3>
                <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
                  Obtén analíticas detalladas sobre la asistencia de cada
                  alumno.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-light-txt-primary dark:text-dark-txt-primary mb-3">
                  Sin Complicaciones
                </h3>
                <p className="text-light-txt-secondary dark:text-dark-txt-secondary ">
                  Olvídate de pasar lista. Nuestro sistema automatizado se
                  encarga de todo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-8 sm:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 bg-gradient-to-r from-light-accent/20 to-light-accent-hover/20 dark:from-dark-accent/20 dark:to-dark-accent-hover/20 backdrop-blur-sm border border-light-accent/30 dark:border-dark-accent/30 rounded-2xl">
              <h2 className="text-[28px] sm:text-[40px] font-bold text-light-txt-primary dark:text-dark-txt-primary mb-6">
                ¿Listo para transformar tu experiencia educativa?
              </h2>
              <p className="text-[18px] sm:text-[24px] text-light-txt-secondary dark:text-dark-txt-secondary mb-8">
                Únete a miles de estudiantes y educadores que ya están
                revolucionando su forma de aprender y enseñar.
              </p>
              <div className="flex gap-6 flex-wrap justify-center">
                {/* Conditional rendering based on session */}
                {(session && session.user) || session?.user ? (
                  <a
                    href="/dashboard"
                    className="px-8 py-4 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    Ir al Panel
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="px-8 py-4 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    Comenzar Ahora
                  </a>
                )}
                <a
                  href="/about"
                  className="px-8 py-4 bg-transparent border-2 border-light-accent text-light-accent hover:bg-light-accent hover:text-white dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent dark:hover:text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                >
                  Saber Más
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </>
  );
}
