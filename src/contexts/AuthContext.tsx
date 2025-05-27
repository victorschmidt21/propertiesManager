import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "@/database/auth";
import { UserAttributes } from "@/service/route/user/user";
import { Api } from "@/service/api";
import { Cookies } from "@/auth/cookies";

export type UserRole = "admin" | "owner";

interface AuthContextProps {
  user: UserAttributes | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserAttributes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = new Api();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        Cookies.set(firebaseUser.stsTokenManager.accessToken, 3, "invistaix");
        const responseUser = Cookies.get("user");
        const usarData: UserAttributes = JSON.parse(responseUser);
        setUser(usarData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idtoken = await result.user.getIdToken();
      Cookies.set(idtoken, 3, "invistaix");
      const reponseUser = await api.user.login();
      const jsonUser = JSON.stringify(reponseUser);
      Cookies.set(jsonUser, 3, "user");
      setUser(reponseUser);
    } catch (error: any) {
      console.log("Erro ao fazer login: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    await signOut(auth);
    Cookies.remove("invistaix");
    Cookies.remove("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
