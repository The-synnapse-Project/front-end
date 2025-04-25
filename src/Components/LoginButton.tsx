import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function LoginButton() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (session) {
    return (
      <div className="relative">
        <div
          className="flex items-center space-x-2 cursor-pointer px-3 py-2 text-light-txt-primary hover:text-light-txt-primary hover:bg-light-secondary/10 dark:text-dark-txt-primary dark:hover:bg-dark-secondary/20 dark:hover:text-dark-txt-primary rounded-md transition-colors duration-200"
          onClick={toggleDropdown}
        >
          {session.user?.image ? (
            <>
              <img
                src={session.user.image}
                alt="Profile"
                className="h-8 w-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  setIsDropdownOpen(isDropdownOpen);
                }}
              />
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center text-light-txt-primary">
              {session.user?.name?.charAt(0) ||
                session.user?.email?.charAt(0) ||
                "U"}
            </div>
          )}
          <span className="hidden md:inline-block">
            {session.user?.name || session.user?.email || "User"}
          </span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-light-primary dark:bg-dark-primary ring-1 ring-black ring-opacity-5 dark:ring-dark-secondary/20 z-40 transition-colors duration-200">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-light-txt-primary dark:text-dark-txt-primary border-b border-light-secondary/20 dark:border-dark-secondary/20 transition-colors duration-200">
                Signed in as{" "}
                <span className="font-medium">{session.user?.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 text-sm text-light-txt-primary hover:bg-light-secondary/10 dark:text-dark-txt-primary dark:hover:bg-dark-secondary/20 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => signIn("google")}
        className="bg-light-secondary text-light-txt-primary hover:bg-light-secondary/90 dark:bg-dark-secondary dark:text-dark-txt-primary dark:hover:bg-dark-secondary/90 px-4 py-2 rounded-md text-sm font-medium"
      >
        Sign in
      </button>
    </div>
  );
}
