"use client";

import { withRoleAccess } from "@/lib/auth-guard";
import { Role } from "@/models/Permission";
import APIIntegrationTest from "@/Components/Testing/APIIntegrationTest";

function IntegrationTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark-primary rounded-xl shadow-md transition-all duration-300 border border-light-secondary/10 dark:border-dark-secondary/10 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
            API Integration Tests
          </h1>
          <p className="text-light-txt-secondary dark:text-dark-txt-secondary mb-6">
            This page tests integration with the Rocket.rs backend API and
            WebSocket connection
          </p>

          <APIIntegrationTest />
        </div>
      </div>
    </div>
  );
}

// Allow access to admin users only
export default withRoleAccess(IntegrationTestPage, Role.ADMIN);
