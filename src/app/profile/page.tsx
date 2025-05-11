"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/lib/auth-guard";
import { getPerson } from "@/lib/api-client";
import { Person } from "@/models/Person";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.apiToken) {
        try {
          const apiUser = await getPerson(session.user.apiToken);
          if (apiUser) {
            setUserData(Person.fromApiResponse(apiUser));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [session]);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
          My Profile
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md mb-4"></div>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
                Loading profile data...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-primary p-8 rounded-xl shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              {session?.user?.image ? (
                <div className="relative">
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-24 w-24 rounded-xl object-cover border-2 border-light-accent dark:border-dark-accent shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white dark:border-dark-primary flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover flex items-center justify-center text-white font-medium text-3xl shadow-md">
                  {session?.user?.name?.charAt(0) ||
                    session?.user?.email?.charAt(0) ||
                    "U"}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary">
                  {session?.user?.name ?? "Unknown"}
                  {session?.user?.surname ?? "Unknown"}
                </h2>
                <p className="text-light-txt-secondary dark:text-dark-txt-secondary flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {session?.user?.email}
                </p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent">
                  {session?.user?.image ? "Google Account" : "Email Account"}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-light-secondary/20 dark:border-dark-secondary/20 pt-6">
              <h3 className="text-xl font-bold mb-6 text-light-accent dark:text-dark-accent flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-dark-primary/50 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 border border-light-secondary/10 dark:border-dark-secondary/10">
                  <dt className="flex items-center gap-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Name
                  </dt>
                  <dd className="text-light-txt-primary dark:text-dark-txt-primary font-medium text-lg">
                    {session?.user?.name ?? "Unknown"}
                  </dd>
                </div>

                <div className="p-4 bg-white dark:bg-dark-primary/50 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 border border-light-secondary/10 dark:border-dark-secondary/10">
                  <dt className="flex items-center gap-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Surname
                  </dt>
                  <dd className="text-light-txt-primary dark:text-dark-txt-primary font-medium text-lg">
                    {session?.user?.surname ?? "Unknown"}
                  </dd>
                </div>

                <div className="p-4 bg-white dark:bg-dark-primary/50 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 border border-light-secondary/10 dark:border-dark-secondary/10">
                  <dt className="flex items-center gap-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email
                  </dt>
                  <dd className="text-light-txt-primary dark:text-dark-txt-primary font-medium text-lg flex items-center">
                    <span className="mr-2">
                      {session?.user?.email ?? "Not provided"}
                    </span>
                    {session?.user?.email ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        not verified
                      </span>
                    )}
                  </dd>
                </div>

                <div className="p-4 bg-white dark:bg-dark-primary/50 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 border border-light-secondary/10 dark:border-dark-secondary/10">
                  <dt className="flex items-center gap-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Account ID
                  </dt>
                  <dd className="font-mono text-sm text-light-txt-secondary dark:text-dark-txt-secondary bg-light-background/80 dark:bg-dark-secondary/20 p-2 rounded overflow-x-auto">
                    {session?.user?.apiToken ??
                      session?.user?.id ??
                      "Not available"}
                  </dd>
                </div>

                <div className="md:col-span-2 p-4 bg-white dark:bg-dark-primary/50 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 border border-light-secondary/10 dark:border-dark-secondary/10">
                  <dt className="flex items-center gap-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Authentication Method
                  </dt>
                  <dd className="mt-2 flex items-center text-light-txt-primary dark:text-dark-txt-primary">
                    {session?.user?.image ? (
                      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-[#4285F4]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-2.78 1.15a2.98 2.98 0 0 0-1.66-1.66l1.15-2.78c1.63.7 2.99 2.06 3.29 3.29zM12 15c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm-2.79-8.51L8.06 9.27c-.75.33-1.28 1-1.4 1.84h-2.7c.28-2.67 2.11-4.97 4.67-5.96.38 1.18 1.59 1.59 1.59 1.59-.32-.77-.45-1.7-.01-2.25z" />
                        </svg>
                        <div>
                          <span className="font-medium">Google</span>
                          <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary">
                            Your Google account is linked and secured
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/30 px-4 py-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-light-accent dark:text-dark-accent"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                        </svg>
                        <div>
                          <span className="font-medium">Email/Password</span>
                          <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary">
                            You can log in using your email and password
                          </p>
                        </div>
                      </div>
                    )}
                  </dd>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
