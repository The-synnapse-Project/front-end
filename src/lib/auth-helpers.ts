import { getServerSession } from "next-auth/next";
import { Person } from "@/models/Person";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  loginWithCredentials,
  createPerson,
  getAllPersons,
  getPermissionByPerson,
  createPermission,
  getPerson,
} from "@/lib/api-client";
import { Permission, Role } from "@/models/Permission";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate with the Rocket API
          const response = await loginWithCredentials({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.status === "ok") {
            // Get user details from API
            const user = (await getAllPersons()).filter(
              (p) => p.email === credentials.email,
            )[0];
            if (!user) return null;

            return {
              id: user.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If this is a sign-in from Google, we need to create/sync the user with our API
      if (account?.provider === "google" && user?.email) {
        try {
          // Check if the user exists in our API
          const existingUser = await getAllPersons().then((users) =>
            users.find((u) => u.email === user.email),
          );

          if (existingUser) {
            // User exists, use their API ID
            token.apiId = existingUser.id;
            token.surname = existingUser.surname;
            token.role = existingUser.role; // Also store the user's role
          } else {
            // User doesn't exist, create them
            const nameParts = user.name?.split(" ") || ["User", ""];
            const firstName = nameParts[0];
            const lastName =
              nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

            const newUser = await createPerson({
              name: firstName,
              surname: lastName,
              email: user.email,
              password: crypto.randomUUID(), // Random password since Google users authenticate differently
            });

            if (newUser) {
              token.apiId = newUser.id;
              token.surname = newUser.surname;

              // Create default permissions for new user (Alumno by default)
              if (newUser.id) {
                const defaultPermission = Permission.fromRole(
                  crypto.randomUUID(),
                  newUser.id,
                  Role.ALUMNO,
                );

                await createPermission({
                  id: defaultPermission.id,
                  person_id: defaultPermission.personId,
                  dashboard: defaultPermission.dashboard,
                  see_self_history: defaultPermission.seeSelfHistory,
                  see_others_history: defaultPermission.seeOthersHistory,
                  admin_panel: defaultPermission.adminPanel,
                  edit_permissions: defaultPermission.editPermissions,
                });

                // Set default role for new users
                token.role = Role.ALUMNO;
              }
            }
          }

          // Get user permissions
          if (token.apiId) {
            const userPermissions = await getPermissionByPerson(
              token.apiId as string,
            );
            if (userPermissions) {
              const permissions = Permission.fromApiResponse(userPermissions);
              token.permissions = {
                dashboard: permissions.dashboard,
                seeSelfHistory: permissions.seeSelfHistory,
                seeOthersHistory: permissions.seeOthersHistory,
                adminPanel: permissions.adminPanel,
                editPermissions: permissions.editPermissions,
              };
              token.role = (await getPerson(token.apiId as string))?.role;
            }
          }
        } catch (error) {
          console.error("Error syncing Google user with API:", error);
        }
      }

      // Pass data from user object to token on sign-in
      if (user) {
        token.id = user.id;
        token.surname = user.surname;

        // If this is a credential sign-in, fetch permissions
        if (user.id) {
          try {
            const userPermissions = await getPermissionByPerson(user.id);
            if (userPermissions) {
              const permissions = Permission.fromApiResponse(userPermissions);
              token.permissions = {
                dashboard: permissions.dashboard,
                seeSelfHistory: permissions.seeSelfHistory,
                seeOthersHistory: permissions.seeOthersHistory,
                adminPanel: permissions.adminPanel,
                editPermissions: permissions.editPermissions,
              };
              token.role = (await getPerson(user.id))?.role;
            }
          } catch (error) {
            console.error("Error fetching user permissions:", error);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.sub as string) || (token.id as string);
        session.user.surname = token.surname as string;
        // Use the API ID for interacting with our Rocket API
        session.user.apiToken = token.apiId as string;

        // Include permissions and role in the session
        session.user.permissions = token.permissions as {
          dashboard: boolean;
          seeSelfHistory: boolean;
          seeOthersHistory: boolean;
          adminPanel: boolean;
          editPermissions: boolean;
        } | null;

        // Add role to session
        if (token.role) {
          session.user.role = token.role as Role;
        }
      }
      return session;
    },
  },
};

/**
 * Gets the current authenticated user from the session
 * and retrieves their full profile from the API if available
 */
export async function getCurrentUser(): Promise<Person | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    // Try to get user data from the API
    const apiUser = await getAllPersons().then((users) =>
      users.find((user) => user.email === session.user.email),
    );

    if (apiUser) {
      return Person.fromApiResponse(apiUser);
    }

    // Fallback to session data if API data is not available
    return new Person(session.user.name || "User", {
      id: session.user.id,
      email: session.user.email,
      picture: session.user.image || undefined,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Utility function to create headers with authentication for API requests
 */
export function createAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Gets the API base URL from environment variables
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}
