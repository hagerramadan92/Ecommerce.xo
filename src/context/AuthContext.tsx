"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface AuthContextType {
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  fullName: string | null; 
  login: (
    name: string,
    email?: string,
    image?: string,
    fullName?: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

   
    if (status === "authenticated" && session?.user) {
      setUserName(
        session.user.name || localStorage.getItem("userName") || "مستخدم"
      );
      setUserEmail(
        session.user.email || localStorage.getItem("userEmail") || null
      );
      setUserImage(session.user.image || localStorage.getItem("userImage") || "");
      setFullName(localStorage.getItem("fullName") || session.user.name || "مستخدم");

      localStorage.setItem("userName", session.user.name || "مستخدم");
      if (session.user.email) localStorage.setItem("userEmail", session.user.email);
      if (session.user.image) localStorage.setItem("userImage", session.user.image);
      localStorage.setItem(
        "fullName",
        localStorage.getItem("fullName") || session.user.name || "مستخدم"
      );
    } 
  
    else {
      const storedName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("userEmail");
      const storedImage = localStorage.getItem("userImage");
      const storedFullName = localStorage.getItem("fullName");

      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
      if (storedImage) setUserImage(storedImage);
      if (storedFullName) setFullName(storedFullName);
    }
  }, [session, status]);

  const login = (
    name: string,
    email?: string,
    image?: string,
    fullNameParam?: string
  ) => {
    setUserName(name);
    setUserEmail(email || null);
    setUserImage(image || "");
    setFullName(fullNameParam || null);

    localStorage.setItem("userName", name);
    if (email) localStorage.setItem("userEmail", email);
    if (image) localStorage.setItem("userImage", image);
    if (fullNameParam) localStorage.setItem("fullName", fullNameParam);
  };

  const logout = () => {
    setUserName(null);
    setUserEmail(null);
    setUserImage(null);
    setFullName(null);
    localStorage.clear();
    nextAuthSignOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider
      value={{ userName, userEmail, userImage, fullName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
