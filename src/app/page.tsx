"use client";
import Balatro from "@/Components/Balatro/Balatro";
import { useTheme } from "@/Components/ThemeContext";
import SplitText from "@/TextAnimations/SplitText/SplitText";

export default function Home() {
  const { darkMode } = useTheme();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden relative">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start z-20  text-dark-txt-primary">
        <div className="absolute top-0 left-0 w-full h-screen z-[-100] pointer-events-none">
          <Balatro
            color1={darkMode ? "#4c1714" : "#DE443B"}
            color2={darkMode ? "#002d4c" : "#006BB4"}
            color3={darkMode ? "#070c0c" : "#162325"}
            isRotate={false}
            mouseInteraction={false}
            pixelFilter={700}
            className="transition-all duration-700"
          />
        </div>
        <h1 className="text-[40px] sm:text-[80px] font-bold text-center ">
          <SplitText text="Synapse" className="text-gradient " delay={100} />
        </h1>
        <SplitText
          text="Bienvenido a la plataforma para interactuar con el aula inteligente"
          className="text-[20px] sm:text-[40px] text-center"
          delay={30}
        />
      </main>
    </div>
  );
}
