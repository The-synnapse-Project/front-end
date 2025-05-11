"use client";
import Balatro from "@/Components/Balatro/Balatro";
import { useTheme } from "@/Components/ThemeContext";

export default function Home() {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-full mt-10 grid grid-rows-[auto_1fr_auto] items-center justify-items-center w-full p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-[32px] row-start-2 items-center z-20 text-light-txt-primary dark:text-dark-txt-primary w-full">
        <div className="fixed top-0 left-0 w-screen h-screen z-[-1000] pointer-events-none">
          <Balatro
            color1={darkMode ? "#3b82f6" : "#60a5fa"}
            color2={darkMode ? "#1e293b" : "#3b82f6"}
            color3={darkMode ? "#0f172a" : "#f8fafc"}
            isRotate={false}
            mouseInteraction={true}
            pixelFilter={800}
            className="transition-all duration-700"
          />
        </div>
        <h1 className="text-[40px] sm:text-[80px] font-bold text-center">
          <span className="bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            Synnapse
          </span>
        </h1>
        <div className="max-w-3xl mx-auto">
          <span className="text-[20px] sm:text-[32px] text-center text-light-txt-secondary dark:text-dark-txt-secondary">
            Bienvenido a la plataforma del aula inteligente
          </span>
        </div>
        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300"
          >
            Iniciar Sesión
          </a>
          <a
            href="/profile"
            className="px-6 py-3 bg-transparent border border-light-accent text-light-accent hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10 rounded-md transition-all duration-300"
          >
            Mi Perfil
          </a>
        </div>
      </main>
    </div>
  );
}
