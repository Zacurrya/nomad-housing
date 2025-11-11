"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LoginReason = "favourite" | "upload" | "default";

interface AuthUIContextValue {
  isLoginOpen: boolean;
  openLogin: (reason?: LoginReason) => void;
  closeLogin: () => void;
  loginReason: LoginReason;
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  isLoading: boolean;
}

const AuthUIContext = createContext<AuthUIContextValue | undefined>(undefined);

export function AuthUIProvider({ children }: { children: React.ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState<LoginReason>("default");
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const openLogin = useCallback((reason: LoginReason = "default") => {
    setLoginReason(reason);
    setIsLoginOpen(true);
  }, []);
  
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  // Restore session on mount
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAuthenticated(true);
          setUserId(data.user.id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to restore session:", err);
        setIsLoading(false);
      });
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLoginOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ isLoginOpen, openLogin, closeLogin, loginReason, isAuthenticated, setAuthenticated, userId, setUserId, isLoading }),
    [isLoginOpen, openLogin, closeLogin, loginReason, isAuthenticated, userId, isLoading]
  );

  return <AuthUIContext.Provider value={value}>{children}</AuthUIContext.Provider>;
}

export function useAuthUI() {
  const ctx = useContext(AuthUIContext);
  if (!ctx) throw new Error("useAuthUI must be used within AuthUIProvider");
  return ctx;
}
