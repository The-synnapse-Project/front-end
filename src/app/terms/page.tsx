"use client";
import { useTheme } from "@/Components/ThemeContext";

export default function Terms() {
  const {} = useTheme();

  return (
    <div className="min-h-full grid grid-rows-[auto_1fr_auto] items-start justify-items-center w-full p-8 pb-20 pt-0 gap-8 sm:pt-0 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-[24px] row-start-2 z-20 text-light-txt-primary dark:text-dark-txt-primary w-full max-w-4xl mx-auto">
        <h1 className="text-[32px] sm:text-[48px] font-bold">
          <span className="bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            Términos de Servicio
          </span>
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Bienvenido a Synnapse. Estos Términos de Servicio ("Términos")
              rigen su acceso y uso de nuestra plataforma de aula inteligente,
              incluyendo cualquier contenido, funcionalidad y servicios
              ofrecidos en o a través de nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Aceptación de los Términos
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Al acceder o utilizar nuestro servicio, usted acepta estar sujeto
              a estos Términos. Si no está de acuerdo con alguna parte de los
              términos, no podrá acceder al servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. Cambios en los Términos
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Nos reservamos el derecho, a nuestra sola discreción, de modificar
              o reemplazar estos Términos en cualquier momento. Los cambios
              sustanciales serán efectivos 30 días después de la publicación de
              la notificación. Su uso continuado del Servicio después de tales
              cambios constituye su aceptación de los nuevos Términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Acceso al Servicio
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Nos reservamos el derecho de retirar o modificar nuestro Servicio,
              y cualquier servicio o material que proporcionemos en nuestro
              Servicio, a nuestra sola discreción sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cuenta de Usuario</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Al registrarse en Synnapse, usted es responsable de mantener la
              confidencialidad de su cuenta y contraseña. Usted acepta la
              responsabilidad por todas las actividades que ocurran bajo su
              cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Propiedad Intelectual
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              El Servicio y su contenido original, características y
              funcionalidad son y seguirán siendo propiedad exclusiva de
              Synnapse y sus licenciantes. El Servicio está protegido por
              derechos de autor, marcas registradas y otras leyes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. Enlaces a Otros Sitios Web
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Nuestro Servicio puede contener enlaces a sitios web de terceros
              que no son propiedad ni están controlados por Synnapse. No tenemos
              control ni asumimos responsabilidad por el contenido, las
              políticas de privacidad o las prácticas de los sitios web de
              terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Limitación de Responsabilidad
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              En ningún caso Synnapse, sus directores, empleados, socios,
              agentes, proveedores o afiliados serán responsables por cualquier
              daño indirecto, incidental, especial, consecuente o punitivo,
              incluyendo, sin limitación, pérdida de beneficios, datos, uso,
              buena voluntad, u otras pérdidas intangibles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Ley Aplicable</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Estos Términos se regirán e interpretarán de acuerdo con las leyes
              locales aplicables, sin tener en cuenta sus disposiciones sobre
              conflictos de leyes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contacto</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Si tiene alguna pregunta sobre estos Términos, por favor
              contáctenos a través de los canales proporcionados en nuestra
              plataforma.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <p className="text-sm text-light-txt-secondary dark:text-dark-txt-secondary">
            Última actualización: 2025
          </p>
        </div>
      </main>
    </div>
  );
}
