"use server";
/**
 * Environment variables to be used in server components and API routes
 */
export const serverEnv = {
  /**
   * URL of the Rocket API
   */
  apiUrl:
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000",

  /**
   * Google OAuth client ID
   */
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",

  /**
   * Google OAuth client secret
   */
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  /**
   * Rocket API Secret
   */
  rocketApiSecret: process.env.API_SECRET || "",

  /**
   * NextAuth secret for JWT encryption
   */
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",

  /**
   * NextAuth URL (for callbacks)
   */
  nextAuthUrl: process.env.NEXTAUTH_URL || "",

  /**
   * Check if environment variables are set correctly
   */
  isConfigValid(): boolean {
    return !!this.apiUrl && !!this.googleClientId && !!this.googleClientSecret;
  },
};
