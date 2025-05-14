"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/lib/auth-guard";
import { getPerson, updatePerson } from "@/lib/api-client";
import { Person } from "@/models/Person";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.apiToken) {
        try {
          const apiUser = await getPerson(session.user.apiToken);
          if (apiUser) {
            const personData = Person.fromApiResponse(apiUser);
            setUserData(personData);
            setFormData({
              name: personData.name || "",
              surname: personData.surname || "",
              email: personData.email || ""
            });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      if (session?.user?.apiToken) {
        const updatedUser = await updatePerson(session.user.apiToken, {
          name: formData.name,
          surname: formData.surname,
          email: formData.email
        });
        
        if (updatedUser) {
          setUserData(Person.fromApiResponse(updatedUser));
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
                    Apellido
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
                            Tu cuenta de Google está vinculada y segura
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

              <div className="mt-8 flex justify-end">
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
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      </div>
    </AuthGuard>
  );
}
