import { Role } from "@/models/Permission";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** User's ID from the API */
      id?: string;
      /** User's API token for making authenticated requests */
      apiToken?: string;
      /** User's surname */
      surname?: string;
      /** User's role */
      role?: Role;
      /** User's permissions */
      permissions?: {
        dashboard: boolean;
        seeSelfHistory: boolean;
        seeOthersHistory: boolean;
        adminPanel: boolean;
        editPermissions: boolean;
      } | null;
      /** Flag if user is a Google account */
      googleId?: string;
    } & DefaultSession["user"];
  }
}
