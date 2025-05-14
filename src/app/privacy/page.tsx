"use client";
import { useTheme } from "@/Components/ThemeContext";

export default function Privacy() {
  const {} = useTheme();

  return (
    <div className="min-h-full grid grid-rows-[auto_1fr_auto] items-start justify-items-center w-full p-8 pb-20 pt-0 gap-8 sm:p-20 sm:pt-0 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-[24px] row-start-2 z-20 text-light-txt-primary dark:text-dark-txt-primary w-full max-w-4xl mx-auto">
        <h1 className="text-[32px] sm:text-[48px] font-bold">
          <span className="bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            Política de Privacidad
          </span>
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              En Synnapse, valoramos y respetamos su privacidad. Esta Política
              de Privacidad describe cómo recopilamos, utilizamos y compartimos
              su información personal cuando visita o utiliza nuestra plataforma
              de aula inteligente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Información que Recopilamos
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Podemos recopilar varios tipos de información, incluyendo:
            </p>
            <ul className="list-disc list-inside mt-2 text-light-txt-secondary dark:text-dark-txt-secondary">
              <li>
                Información de identificación personal (nombre, dirección de
                correo electrónico, etc.)
              </li>
              <li>Información de autenticación</li>
              <li>Datos de uso y actividad dentro de la plataforma</li>
              <li>Información del dispositivo y navegador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. Cómo Utilizamos Su Información
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc list-inside mt-2 text-light-txt-secondary dark:text-dark-txt-secondary">
              <li>Proporcionar, mantener y mejorar nuestra plataforma</li>
              <li>Procesar y completar transacciones</li>
              <li>
                Enviar información administrativa, como confirmaciones,
                actualizaciones técnicas, alertas de seguridad y mensajes de
                soporte
              </li>
              <li>Responder a sus comentarios, preguntas y solicitudes</li>
              <li>
                Monitorear y analizar tendencias, uso y actividades relacionadas
                con nuestra plataforma
              </li>
              <li>
                Detectar, investigar y prevenir actividades fraudulentas y no
                autorizadas
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Compartición de Información
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Podemos compartir su información personal con:
            </p>
            <ul className="list-disc list-inside mt-2 text-light-txt-secondary dark:text-dark-txt-secondary">
              <li>
                Proveedores de servicios que necesitan acceso a su información
                para realizar servicios en nuestro nombre
              </li>
              <li>
                Socios con los que ofrecemos servicios conjuntos o promociones
              </li>
              <li>
                Cuando sea requerido por ley o en respuesta a procesos legales
                válidos
              </li>
              <li>
                En relación con una fusión, venta de activos de la empresa,
                financiación o adquisición
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Seguridad de Datos
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Tomamos medidas razonables para proteger su información personal
              contra pérdida, acceso no autorizado, divulgación, alteración o
              destrucción. Sin embargo, ningún método de transmisión por
              Internet o método de almacenamiento electrónico es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Sus Derechos</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Dependiendo de su ubicación, es posible que tenga ciertos derechos
              con respecto a su información personal, como el derecho a acceder,
              corregir, eliminar o restringir el procesamiento de sus datos.
              Para ejercer estos derechos, contáctenos a través de los canales
              proporcionados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. Cookies y Tecnologías Similares
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Utilizamos cookies y tecnologías de seguimiento similares para
              recopilar información sobre sus interacciones con nuestra
              plataforma. Puede gestionar sus preferencias de cookies a través
              de la configuración de su navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Cambios a Esta Política
            </h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Podemos actualizar esta política de privacidad de vez en cuando.
              Le notificaremos cualquier cambio publicando la nueva política de
              privacidad en esta página y actualizando la fecha de "última
              actualización".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contacto</h2>
            <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
              Si tiene preguntas o inquietudes sobre nuestra política de
              privacidad o nuestras prácticas con respecto a su información
              personal, contáctenos a través de los canales proporcionados en
              nuestra plataforma.
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
