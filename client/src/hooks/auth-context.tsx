"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { UserRole } from "../types/user_types";
import api from "@/services/api";
import { authService } from "@/services/auth_service";
import { userService } from "@/services/user_service";
import { LoginCredentials } from "@/types/auth_types";
import { CreateUser } from "@/types/user_types";


interface AuthState {
  currentUser: { id: string; name: string; email: string; role: UserRole } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: CreateUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthState["currentUser"]>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Async login for the backend
  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    
    setCurrentUser(data.user);
    setAccessToken(data.accessToken);

    // Inject the access token
    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
  };

  // Async register for the backend
  const register = async (userData: CreateUser) => {
    await userService.createUser(userData);

    await login({ email: userData.email, password: userData.password });
  };

  // Logout clears it all
  const logout = () => {
    setCurrentUser(null);
    setAccessToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider value={{ currentUser, accessToken, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth has to be used inside the AuthProvider");
  }
  return context;
}