import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/Components/Layout/NavBar";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synnapse",
  description: "Plataforma para interactuar con el aula inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="shortcut icon" href="favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden bg-light-background text-light-txt-primary dark:bg-dark-background dark:text-dark-txt-primary transition-colors duration-200`}
      >
        <Providers>
          <NavBar />
          <main className="flex-grow w-full max-w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
