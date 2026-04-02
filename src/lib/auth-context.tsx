"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import api from "./api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  business_name?: string;
  verification_level?: string;
  status?: string;
  location?: string;
  watchlist?: string[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("gw_user");
    const token = localStorage.getItem("gw_token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post("/auth/login", { email, password });
    const { token, user: userData } = data;
    localStorage.setItem("gw_token", token);
    localStorage.setItem("gw_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData: any) => {
    const data = await api.post("/auth/register", formData);
    const { token, user: userData } = data;
    localStorage.setItem("gw_token", token);
    localStorage.setItem("gw_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gw_token");
    localStorage.removeItem("gw_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
