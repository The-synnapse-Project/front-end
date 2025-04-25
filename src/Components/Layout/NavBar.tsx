"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import LoginButton from "@/Components/LoginButton";
import ThemeToggle from "@/Components/ThemeToggle";

interface NavItem {
  name: string;
  href: string;
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav className="bg-light-primary dark:bg-dark-primary shadow-lg w-full transition-colors duration-300 fixed z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-light-txt-primary dark:text-dark-txt-primary font-bold text-xl">
                Logo
              </span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary hover:text-light-txt-primary dark:hover:bg-dark-secondary dark:hover:text-dark-txt-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Auth buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <LoginButton />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-light-txt-secondary dark:text-dark-txt-secondary hover:text-light-txt-primary hover:bg-light-secondary dark:hover:text-dark-txt-primary dark:hover:bg-dark-secondary focus:outline-none transition-colors duration-200"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-label="Open menu"
              >
                <title>Open menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-label="Close menu"
              >
                <title>Close menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-light-txt-secondary dark:text-dark-txt-secondary hover:bg-light-secondary hover:text-light-txt-primary dark:hover:bg-dark-secondary dark:hover:text-dark-txt-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile auth buttons */}
          <div className="mt-4 pt-4 border-t border-light-secondary/20 dark:border-dark-secondary/20">
            <div className="flex items-center px-3 py-2">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
