import { getServerSession } from "next-auth/next";
import { Person } from "@/models/Person";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  loginWithCredentials,
  getAllPersons,
  getPermissionByPerson,
  createPermission,
  getPerson,
  register,
  loginWithGoogle,
  registerWithGoogle,
  updateGoogleId,
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
          // First, try to login with Google ID
          let googleLoginResponse = await loginWithGoogle(
            account.providerAccountId,
            user.email,
          );

          if (!googleLoginResponse || googleLoginResponse.status !== "ok") {
            const registerResponse = await registerWithGoogle(
              account.providerAccountId,
              user.email,
              user.name || "User",
              user.surname || "",
            );

            // If registration was successful and returned user data, use it
            if (registerResponse?.status === "ok" && registerResponse.user) {
              token.id = registerResponse.user.id;
              token.apiId = registerResponse.user.id;
              token.surname = registerResponse.user.surname || "";
              token.role = registerResponse.user.role;
              token.googleId = account.providerAccountId;
            } else {
              // Fallback: try to login again after registration
              googleLoginResponse = await loginWithGoogle(
                account.providerAccountId,
                user.email,
              );
            }
          }

          if (
            googleLoginResponse &&
            googleLoginResponse.status === "ok" &&
            googleLoginResponse.user
          ) {
            // User exists and was authenticated via Google ID
            // Set the database ID as both id and apiId to be used for all API interactions
            token.id = googleLoginResponse.user.id;
            token.apiId = googleLoginResponse.user.id;
            token.surname = googleLoginResponse.user.surname || "";
            token.role = googleLoginResponse.user.role;
            // Store Google ID separately, not as the main user ID
            token.googleId = account.providerAccountId;
          } else {
            // First, get all users and check for matching email
            const allUsers = await getAllPersons();
            const existingUser = allUsers.find((u) => u.email === user.email);

            if (existingUser) {
              // User exists with matching email but no Google ID, update their record
              token.id = existingUser.id;
              token.apiId = existingUser.id;
              token.surname = existingUser.surname;
              token.role = existingUser.role;
              token.googleId = account.providerAccountId;

              // Update the user's Google ID in the database if they don't have one
              if (!existingUser.google_id) {
                try {
                  const updateResult = await updateGoogleId(
                    existingUser.id,
                    account.providerAccountId,
                  );
                } catch (error) {
                  console.error("Error updating Google ID:", error);
                }
              }
            } else {
              // User doesn't exist, create a new one
              const nameParts = user.name?.split(" ") || ["User", ""];
              const firstName = nameParts[0];
              const lastName =
                nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

              await register(
                firstName,
                lastName,
                user.email,
                null, // Google users don't have a password initially
                account.providerAccountId, // Pass the Google ID
              );
              const newUser = await getAllPersons().then((users) =>
                users.find((u) => u.email === user.email),
              );

              if (newUser) {
                token.id = newUser.id;
                token.apiId = newUser.id;
                token.surname = newUser.surname;
                token.googleId = account.providerAccountId; // Store actual Google ID

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
                } else {
                  console.error("Error creating new user:", user.email);
                }
              }
            }

            // Get user permissions
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

          // Fetch permissions for any Google user (whether found via login or created)
          if (token.apiId) {
            try {
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
            } catch (error) {
              console.error("Error fetching Google user permissions:", error);
            }
          }
        } catch (error) {
          console.error("Error syncing Google user with API:", error);
        }
      }

      // Pass data from user object to token on sign-in
      if (user && account?.provider !== "google") {
        // Only process credentials sign-in here, not Google sign-in
        // Google sign-in is handled above
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
        // Use apiId as the primary identifier for all interactions with our API
        // DON'T use Google ID (token.sub) as the user's ID
        session.user.id = (token.apiId as string) || (token.id as string);
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

        // Add googleId to session if it exists
        if (token.googleId) {
          session.user.googleId = token.googleId as string;
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

    // If we have an apiToken (which should be our internal DB ID), use it directly
    if (session.user.apiToken) {
      try {
        const user = await getPerson(session.user.apiToken);
        if (user) {
          return Person.fromApiResponse(user);
        }
      } catch (error) {
        console.error("Error getting user by API token:", error);
      }
    }

    // Fallback to finding by email
    try {
      const apiUser = await getAllPersons().then((users) =>
        users.find((user) => user.email === session.user.email),
      );

      if (apiUser) {
        return Person.fromApiResponse(apiUser);
      }
    } catch (error) {
      console.error("Error finding user by email:", error);
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
