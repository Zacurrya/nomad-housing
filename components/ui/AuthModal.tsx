"use client";
import { useAuthUI } from "../context/AuthUIContext";
import { useState } from "react";

export default function AuthModal() {
  const { isLoginOpen, closeLogin, loginReason, setAuthenticated, setUserId } = useAuthUI();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoginOpen) return null;

  const getDescription = () => {
    if (mode === "login") return "Sign in to access your account.";
    
    switch (loginReason) {
      case "favourite":
        return "Create an account to save your favourites and more.";
      case "upload":
        return "Create an account to list your property.";
      default:
        return "Create an account to get started.";
    }
  };

  if (!isLoginOpen) return null;

  const handleBackdrop = () => closeLogin();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body = mode === "signup" 
        ? { email, password, name }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || `${mode === "signup" ? "Signup" : "Login"} failed`);
        return;
      }
      
      // Store user ID and mark authenticated
      setUserId(data.user.id);
      setAuthenticated(true);
      closeLogin();
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Trigger Google OAuth flow
    // For now mock authentication
    setAuthenticated(true);
    closeLogin();
  };

  return (
    <div
      className="fixed inset-0 z-1000 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdrop}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-base font-semibold text-gray-900">
            {mode === "signup" ? "Create Account" : "Sign In"}
          </h3>
          <button
            onClick={closeLogin}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">
            {getDescription()}
          </p>
          
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540] focus:border-transparent"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#0a2540] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#093e5a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (mode === "signup" ? "Creating account..." : "Signing in...") : (mode === "signup" ? "Create Account" : "Sign In")}
            </button>
          </form>

          <div className="text-center text-xs text-gray-600">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#0a2540] font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#0a2540] font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.559,6.053,29.027,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.559,6.053,29.027,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c4.957,0,9.409-1.897,12.787-4.993l-5.897-4.986C29.791,35.418,27.027,36.5,24,36.5c-5.202,0-9.623-3.317-11.283-7.946l-6.542,5.036C9.584,39.556,16.24,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.083,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.545,5.033C36.663,39.663,44,35.5,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
