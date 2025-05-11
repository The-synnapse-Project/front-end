import NextAuth from "next-auth/next";
import { Role } from "@/models/Permission";
import { authOptions } from "@/lib/auth-helpers";

// Extend the Session type to include user.id
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      surname?: string | null;
      apiToken?: string | null;
      role?: Role | null;
      permissions?: {
        dashboard: boolean;
        seeSelfHistory: boolean;
        seeOthersHistory: boolean;
        adminPanel: boolean;
        editPermissions: boolean;
      } | null;
    };
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    surname?: string | null;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
