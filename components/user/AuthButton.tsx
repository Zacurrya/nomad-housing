"use client";
import { useAuthUI } from "../context/AuthUIContext";
import { useState, useRef } from "react";
import AccountDropDown from "./AccountDropDown";

export default function AuthButton() {
    const { openLogin, isAuthenticated, isLoading } = useAuthUI();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        if (!isAuthenticated) {
            openLogin();
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleClick}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md hover:bg-white/10 text-sm"
                suppressHydrationWarning
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                </svg>
                <span className="font-medium pt-0.5" suppressHydrationWarning>{isLoading ? "Login" : (isAuthenticated ? "Account" : "Login")}</span>
            </button>
            
            {isAuthenticated && (
                <AccountDropDown
                    isOpen={isDropdownOpen}
                    onCloseAction={() => setIsDropdownOpen(false)}
                    buttonRef={buttonRef}
                />
            )}
        </div>
    );
}