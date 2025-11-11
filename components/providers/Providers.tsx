"use client";
import { CurrencyProvider } from "../context/CurrencyContext";
import { AuthUIProvider } from "../context/AuthUIContext";
import AuthModal from "../ui/AuthModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthUIProvider>
      <CurrencyProvider>
        {children}
        <AuthModal />
      </CurrencyProvider>
    </AuthUIProvider>
  );
}
