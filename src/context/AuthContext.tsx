"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface AuthContextType {
  authToken: string | null;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  fullName: string | null;
  login: (
    token: string,
    name: string,
    email?: string,
    image?: string,
    fullName?: string
  ) => void;
  logout: () => void;
  setAuthFromApi: (data: {
    token: string;
    name: string;
    email?: string;
    image?: string;
    fullName?: string;
  }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // ----------------------------
  // ⬇️ استرجاع بيانات المستخدم
  // ----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("auth_token");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedImage = localStorage.getItem("userImage");
    const storedFullName = localStorage.getItem("fullName");

    if (storedToken) setAuthToken(storedToken);
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedImage) setUserImage(storedImage);
    if (storedFullName) setFullName(storedFullName);

    if (status === "authenticated" && session?.user) {
      const name = session.user.name || storedName || "مستخدم";
      const email = session.user.email || storedEmail || null;
      const image = session.user.image || storedImage || "";
      const full = storedFullName || session.user.name || "مستخدم";

      setUserName(name);
      setUserEmail(email);
      setUserImage(image);
      setFullName(full);

      localStorage.setItem("userName", name);
      if (email) localStorage.setItem("userEmail", email);
      if (image) localStorage.setItem("userImage", image);
      localStorage.setItem("fullName", full);
    }
  }, [session, status]);

  // ----------------------------
  // ⬇️ **مزامنة المفضلة عند تسجيل الدخول**
  // ----------------------------
  useEffect(() => {
    if (!authToken) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          "https://ecommecekhaled.renix4tech.com/api/v1/favorites",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
          const ids = data.data.map((item: any) => item.id);
          localStorage.setItem("favorites", JSON.stringify(ids));
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    fetchFavorites();
  }, [authToken]); // ⬅️ لما التوكن يتغير (يعني لما تعملي Login)

  // ----------------------------
  // ⬇️ تسجيل الدخول
  // ----------------------------
  const login = (
    token: string,
    name: string,
    email?: string,
    image?: string,
    fullNameParam?: string
  ) => {
    setAuthToken(token);
    setUserName(name);
    setUserEmail(email || null);
    setUserImage(image || "");
    setFullName(fullNameParam || name);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("userName", name);
    if (email) localStorage.setItem("userEmail", email);
    if (image) localStorage.setItem("userImage", image);
    localStorage.setItem("fullName", fullNameParam || name);
  };

  // ⬇️ تحديث بيانات الدخول من API خارجي
  const setAuthFromApi = (data: {
    token: string;
    name: string;
    email?: string;
    image?: string;
    fullName?: string;
  }) => {
    login(data.token, data.name, data.email, data.image, data.fullName);
  };

  // ----------------------------
  // ⬇️ تسجيل الخروج
  // ----------------------------
  const logout = () => {
    setAuthToken(null);
    setUserName(null);
    setUserEmail(null);
    setUserImage(null);
    setFullName(null);
    localStorage.clear();
    nextAuthSignOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        userName,
        userEmail,
        userImage,
        fullName,
        login,
        logout,
        setAuthFromApi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
