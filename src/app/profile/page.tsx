"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/lib/auth-guard";
import {
  getPerson,
  updatePerson,
  setPassword,
  linkGoogleAccount,
} from "@/lib/api-client";
import { Person } from "@/models/Person";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    name: session?.user.name || "",
    surname: session?.user.surname || "",
    email: session?.user.email || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLinkGoogleModalOpen, setIsLinkGoogleModalOpen] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [linkGoogleFormData, setLinkGoogleFormData] = useState({
    googleEmail: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [linkGoogleError, setLinkGoogleError] = useState<string | null>(null);
  const [linkGoogleSuccess, setLinkGoogleSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLinkGoogleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinkGoogleFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const personData = await getPerson(session.user.id);
          if (personData) {
            console.log("Fetched user data:", personData);
            setUserInfo(Person.fromApiResponse(personData));
            setFormData({
              name: personData.name || "",
              surname: personData.surname || "",
              email: personData.email || "",
            });
            setIsGoogleUser(!!personData.google_id);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (session?.user?.id) {
        await updatePerson(session.user.id, {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
        });

        const updatedUser = await getPerson(session.user.id);

        if (updatedUser) {
          setUserInfo(Person.fromApiResponse(updatedUser));
          setSaveSuccess(true);
          setTimeout(() => {
            setIsEditModalOpen(false);
            setSaveSuccess(false);
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setSaveError(error.message || "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordFormData.password !== passwordFormData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Use the setPassword function for Google users (who don't have a password yet)
      if (session?.user?.email) {
        const result = await setPassword(
          session.user.email,
          passwordFormData.password,
        );

        if (result && result.status === "ok") {
          setPasswordSuccess(true);
          setTimeout(() => {
            setIsPasswordModalOpen(false);
            setPasswordSuccess(false);
            // Reset the form
            setPasswordFormData({
              password: "",
              confirmPassword: "",
            });
          }, 1500);
        } else {
          setPasswordError(
            result?.message || "Error al establecer la contraseña",
          );
        }
      }
    } catch (error: any) {
      console.error("Error setting password:", error);
      setPasswordError(error.message || "Error al establecer la contraseña");
    }
  };

  const handleLinkGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkGoogleError(null);
    setLinkGoogleSuccess(false);

    try {
      if (session?.user?.email) {
        const result = await linkGoogleAccount(
          session.user.email,
          linkGoogleFormData.googleEmail,
          linkGoogleFormData.password,
        );

        if (result && result.status === "ok") {
          setLinkGoogleSuccess(true);
          setTimeout(() => {
            setIsLinkGoogleModalOpen(false);
            setLinkGoogleSuccess(false);
            // Reset the form
            setLinkGoogleFormData({
              googleEmail: "",
              password: "",
            });

            // Reload the session to reflect the changes
            window.location.reload();
          }, 1500);
        } else {
          setLinkGoogleError(
            result?.message || "Error al vincular la cuenta de Google",
          );
        }
      }
    } catch (error: any) {
      console.error("Error linking Google account:", error);
      setLinkGoogleError(
        error.message || "Error al vincular la cuenta de Google",
      );
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-light-accent to-light-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
          Mi Perfil
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-light-secondary/30 border-t-light-accent dark:border-dark-secondary/30 dark:border-t-dark-accent shadow-md mb-4"></div>
              <p className="text-light-txt-secondary dark:text-dark-txt-secondary">
                Cargando datos del perfil...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-primary p-8 rounded-xl shadow-lg border border-light-secondary/10 dark:border-dark-secondary/10 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              {session?.user?.image ? (
                <div className="relative">
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={256}
                    height={256}
                    className="h-24 w-24 rounded-xl object-cover border-2 border-light-accent dark:border-dark-accent shadow-md"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const nextElement = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="h-24 w-24 rounded-xl bg-blue-500 flex items-center justify-center text-white font-medium text-3xl shadow-md border-2 border-light-accent dark:border-dark-accent"
                    style={{ display: "none" }}
                  >
                    {userInfo?.name?.charAt(0) ||
                      userInfo?.email?.charAt(0) ||
                      "U"}
                  </div>
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
                  {userInfo?.name?.charAt(0) ||
                    userInfo?.email?.charAt(0) ||
                    "U"}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary">
                  {userInfo?.name ?? "Unknown"}
                  {userInfo?.surname ?? "Unknown"}
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
                  {userInfo?.email}
                </p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent">
                  {userInfo?.googleId || session?.user?.image ? (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 text-[#4285F4]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google Account
                    </div>
                  ) : (
                    "Email Account"
                  )}
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
                Información de la Cuenta
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
                    Nombre
                  </dt>
                  <dd className="text-light-txt-primary dark:text-dark-txt-primary font-medium text-lg">
                    {userInfo?.name ?? "Unknown"}
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
                    Apellido
                  </dt>
                  <dd className="text-light-txt-primary dark:text-dark-txt-primary font-medium text-lg">
                    {userInfo?.surname ?? "Unknown"}
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
                      {userInfo?.email ?? "Not provided"}
                    </span>
                    {userInfo?.email ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        no verificado
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
                    ID de Cuenta
                  </dt>
                  <dd className="font-mono text-sm text-light-txt-secondary dark:text-dark-txt-secondary bg-light-background/80 dark:bg-dark-secondary/20 p-2 rounded overflow-x-auto">
                    {session?.user?.apiToken ??
                      session?.user?.id ??
                      "No disponible"}
                  </dd>
                </div>

                {/* Google ID Display */}
                {userInfo?.googleId && (
                  <div className="p-4 bg-white dark:bg-dark-primary/50 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 border border-light-secondary/10 dark:border-dark-secondary/10">
                    <dt className="flex items-center gap-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-2">
                      <svg
                        className="w-4 h-4 text-[#4285F4]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google ID
                    </dt>
                    <dd className="font-mono text-sm text-light-txt-secondary dark:text-dark-txt-secondary bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded overflow-x-auto border border-blue-200/30 dark:border-blue-700/30">
                      {userInfo.googleId}
                    </dd>
                  </div>
                )}

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
                    Método de Autenticación
                  </dt>
                  <dd className="mt-2 flex items-center text-light-txt-primary dark:text-dark-txt-primary">
                    {userInfo?.googleId || session?.user?.image ? (
                      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-[#4285F4]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Google</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Vinculada
                            </span>
                          </div>
                          <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary">
                            {userInfo?.googleId
                              ? "Tu cuenta de Google está vinculada y verificada"
                              : "Cuenta autenticada con Google"}
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
                          <span className="font-medium">Email/Contraseña</span>
                          <p className="text-xs text-light-txt-secondary dark:text-dark-txt-secondary">
                            Puedes iniciar sesión usando tu email y contraseña
                          </p>
                        </div>
                      </div>
                    )}
                  </dd>
                </div>
              </div>

              <div className="mt-8 flex flex-row flex-wrap justify-end gap-2">
                {isGoogleUser ? (
                  // Google user options
                  <>
                    {/* Add a set password button for Google users without a password */}
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {userInfo?.password_hash
                        ? "Cambiar contraseña"
                        : "Establecer contraseña"}
                    </button>
                  </>
                ) : (
                  // Regular user options
                  <>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Cerrar sesión
                    </button>
                    <Link
                      href="/change-password"
                      className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Cambiar contraseña
                    </Link>
                    <button
                      onClick={() =>
                        signIn("google", {
                          callbackUrl: `${window.location.origin}/profile`,
                        })
                      }
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-row items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="w-5 h-5"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Vincular con Google
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Actualizar Perfil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal Dialog */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-primary rounded-xl shadow-2xl w-full max-w-xl transform transition-all overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary">
                  Editar Perfil
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {saveError && (
                  <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                    <p>{saveError}</p>
                  </div>
                )}

                {saveSuccess && (
                  <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                    <p>¡Perfil actualizado con éxito!</p>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Nombre"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="surname"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Apellido"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Email"
                    readOnly={!!session?.user?.image}
                  />
                  {session?.user?.image && (
                    <p className="mt-1 text-xs text-light-txt-secondary dark:text-dark-txt-secondary">
                      Email no editable para cuentas de Google
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-dark-secondary text-light-txt-primary dark:text-dark-txt-primary hover:bg-gray-300 dark:hover:bg-dark-secondary/80 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Guardando...
                      </span>
                    ) : (
                      "Guardar cambios"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal Dialog */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-primary rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary">
                  Cambiar Contraseña
                </h2>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-6">
                {passwordError && (
                  <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                    <p>{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                    <p>¡Contraseña actualizada con éxito!</p>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={passwordFormData.password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Nueva Contraseña"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Confirmar Nueva Contraseña"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-dark-secondary text-light-txt-primary dark:text-dark-txt-primary hover:bg-gray-300 dark:hover:bg-dark-secondary/80 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Guardar Nueva Contraseña
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Link Google Account Modal Dialog */}
        {isLinkGoogleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-primary rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-light-txt-primary dark:text-dark-txt-primary">
                  Vincular Cuenta de Google
                </h2>
                <button
                  onClick={() => setIsLinkGoogleModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleLinkGoogleSubmit} className="p-6">
                {linkGoogleError && (
                  <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                    <p>{linkGoogleError}</p>
                  </div>
                )}

                {linkGoogleSuccess && (
                  <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                    <p>¡Cuenta de Google vinculada con éxito!</p>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="googleEmail"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Email de Google
                  </label>
                  <input
                    type="email"
                    id="googleEmail"
                    name="googleEmail"
                    value={linkGoogleFormData.googleEmail}
                    onChange={handleLinkGoogleChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Email de Google"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-light-txt-secondary dark:text-dark-txt-secondary mb-2"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={linkGoogleFormData.password}
                    onChange={handleLinkGoogleChange}
                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-white dark:bg-dark-secondary/20 text-light-txt-primary dark:text-dark-txt-primary focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/20 dark:focus:ring-dark-accent/20 outline-none transition-all"
                    placeholder="Contraseña"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsLinkGoogleModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-dark-secondary text-light-txt-primary dark:text-dark-txt-primary hover:bg-gray-300 dark:hover:bg-dark-secondary/80 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-light-accent text-white hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Vincular Cuenta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/20">
            <h4 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Información sobre la autenticación
            </h4>

            {isGoogleUser ? (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Has iniciado sesión con Google. Ahora puedes establecer una
                contraseña opcional para tu cuenta, lo que te permitirá iniciar
                sesión también con tu email y contraseña.
              </p>
            ) : (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Si tienes una cuenta de Google, puedes vincularla a tu cuenta
                actual. Esto te permitirá iniciar sesión con ambos métodos.
              </p>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
