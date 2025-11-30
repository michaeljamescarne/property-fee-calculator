/**
 * Auth Provider
 * Global authentication state management
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile } from "@/types/database";
import type { AuthState } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (user: UserProfile) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include", // Ensure cookies are sent
        cache: "no-store", // Don't cache the session check
      });
      const data = await response.json();

      if (data.authenticated && data.user) {
        setState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (user: UserProfile) => {
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    // Refresh session from server to ensure cookie is synced
    await checkSession();
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshUser = async () => {
    await checkSession();
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
