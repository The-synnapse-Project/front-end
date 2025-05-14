"use client";

import Link from "next/link";
import React from "react";

export default function About() {
  // TODO: Cambiar la redaccion de esto //
  return (
    <div className="fixed inset-0 mt-10 flex overflow-hidden flex-col items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-primary shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 rounded-lg overflow-hidden transition-colors duration-300">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover">
            <h1 className="text-3xl font-bold text-white">Sobre Nosotros</h1>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-light-txt-primary dark:text-dark-txt-primary mb-4">
                ¡Bienvenido a Synnapse! El proyecto del aula inteligente.
              </p>

              <h2 className="text-2xl font-semibold text-light-txt-primary dark:text-dark-txt-primary mt-6 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-4">
                Nuestro objetivo es lograr la automatización del control de
                asistencia en las aulas. Gracias a un sistema de camaras y de
                antenar RFID podemos lograr un control preciso y eficiente de la
                asistencia en las aulas.
              </p>

              <h2 className="text-2xl font-semibold text-light-txt-primary dark:text-dark-txt-primary mt-6 mb-4">
                Nuestro Equipo
              </h2>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-4">
                Contamos con un equipo apasionado de profesionales con diversas
                formaciones y experiencia, comprometidos con la excelencia en
                todo lo que hacemos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  ["Manuel Romero", "Administrador"],
                  ["Ivan Villagrasa", "Desarrollo de Integracion y web"],
                  ["Victor Galan", "Desarrollo de Backend y web"],
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-light-secondary/10 dark:bg-dark-secondary/20 p-4 rounded-lg transition-colors duration-300"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-light-txt-primary dark:text-dark-txt-primary text-center">
                      {item[0]}
                    </h3>
                    <p className="text-light-txt-secondary dark:text-dark-txt-secondary text-center">
                      {item[1]}
                    </p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-semibold text-light-txt-primary dark:text-dark-txt-primary mt-8 mb-4">
                Contáctanos
              </h2>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-4">
                No dudes en ponerte en contacto con nosotros si tienes alguna
                pregunta o deseas obtener más información sobre nuestros
                servicios.
              </p>

              <div className="mt-6 flex justify-center md:justify-start">
                <Link
                  className="bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white py-2 px-4 rounded-md shadow-sm transition-all duration-300 hover:shadow-md"
                  href="mailto:ala-inteligente@cpilosenlaces.com"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
