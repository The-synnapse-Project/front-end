import Image from "next/image";
import Balatro from "@/components/Balatro/Balatro";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <Balatro isRotate={false} mouseInteraction={false} pixelFilter={700} />
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start z-20">
        <h1 className="text-[40px] sm:text-[80px] font-bold text-center">
          Synapse
        </h1>
        <p className="text-[20px] sm:text-[40px] text-center">
          Bienvenido a Synapse, la plataforma para interactuar con el aula
          inteligente.
        </p>
      </main>
    </div>
  );
}
