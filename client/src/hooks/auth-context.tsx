"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { UserRole } from "../types/user_types"

interface AuthState {
  currentUser: { email: string; role: UserRole } | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthState["currentUser"]>(null);

  const login = (email: string, password: string, role: UserRole) => {
    setCurrentUser({ email, role });
  };

  const register = (name: string, email: string, password: string) => {
    setCurrentUser({ email, role: "user" });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}