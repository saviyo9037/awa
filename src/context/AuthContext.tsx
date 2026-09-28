"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isPro: boolean;
  subscriptionPlan: string;
  credits: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isPro: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  isAdmin: false,
  isPro: false,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user state from backend database (/api/auth/me) with localStorage fallback
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          if (typeof window !== "undefined") {
            localStorage.setItem("awa_user", JSON.stringify(json.data));
            localStorage.setItem("awa_logged_in", "true");
            localStorage.setItem("awa_is_pro", json.data.isPro ? "true" : "false");
            localStorage.setItem("awa_user_role", json.data.role || "user");
          }
          setIsLoading(false);
          return;
        }
      }

      // If backend returns 401 or not authenticated, check local cache
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("awa_user");
        const isLoggedInFlag = localStorage.getItem("awa_logged_in") === "true";
        if (stored && isLoggedInFlag) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setIsLoading(false);
            return;
          } catch {}
        }
      }

      setUser(null);
    } catch (err) {
      console.warn("Auth check note:", err);
      // Fallback to local storage if offline
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("awa_user");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {}
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to custom auth events
    const handleAuthChange = () => {
      refreshUser();
    };

    window.addEventListener("awa_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("awa_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refreshUser]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: pass }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Authentication failed" };
      }

      setUser(data.data);
      if (typeof window !== "undefined") {
        localStorage.setItem("awa_user", JSON.stringify(data.data));
        localStorage.setItem("awa_logged_in", "true");
        localStorage.setItem("awa_is_pro", data.data.isPro ? "true" : "false");
        localStorage.setItem("awa_user_role", data.data.role || "user");
        window.dispatchEvent(new Event("awa_auth_changed"));
      }

      return { success: true, user: data.data };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network connection error" };
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pass }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Registration failed" };
      }

      setUser(data.data);
      if (typeof window !== "undefined") {
        localStorage.setItem("awa_user", JSON.stringify(data.data));
        localStorage.setItem("awa_logged_in", "true");
        localStorage.setItem("awa_is_pro", data.data.isPro ? "true" : "false");
        localStorage.setItem("awa_user_role", data.data.role || "user");
        window.dispatchEvent(new Event("awa_auth_changed"));
      }

      return { success: true, user: data.data };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network connection error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("awa_user");
      localStorage.removeItem("awa_logged_in");
      localStorage.removeItem("awa_is_pro");
      localStorage.removeItem("awa_user_role");
      window.dispatchEvent(new Event("awa_auth_changed"));
    }
  };

  const isAdmin = user?.role === "admin";
  const isPro = Boolean(user?.isPro || isAdmin || user?.role === "pro_subscriber");
  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        isAdmin,
        isPro,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
