"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiMutate, ApiError } from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string, passwordConfirmation: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string, passwordConfirmation: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/user", { credentials: "include", headers: { Accept: "application/json" } });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiMutate<User>("/login", { method: "POST", body: JSON.stringify({ email, password }) });
    setUser(data);
    return data;
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string, passwordConfirmation: string) => {
      const data = await apiMutate<User>("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password, password_confirmation: passwordConfirmation }),
      });
      setUser(data);
      return data;
    },
    [],
  );

  const logout = useCallback(async () => {
    await apiMutate<void>("/logout", { method: "POST" });
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await apiMutate<void>("/password/forgot", { method: "POST", body: JSON.stringify({ email }) });
  }, []);

  const resetPassword = useCallback(
    async (email: string, code: string, password: string, passwordConfirmation: string) => {
      await apiMutate<void>("/password/reset", {
        method: "POST",
        body: JSON.stringify({ email, code, password, password_confirmation: passwordConfirmation }),
      });
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refresh, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
