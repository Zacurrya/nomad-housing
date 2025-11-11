"use client";
import { useAuthUI } from "../context/AuthUIContext";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";

type HeartBtnProps = {
    isFavorite: boolean;
    setIsFavoriteAction: (v: boolean) => void;
    listingId: string;
};

type Particle = {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    velocityX: number;
    velocityY: number;
};

export default function HeartBtn({ isFavorite, setIsFavoriteAction, listingId }: HeartBtnProps) {
    const { isAuthenticated, openLogin, userId } = useAuthUI();
    const [particles, setParticles] = useState<Particle[]>([]);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const createCelebration = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            });
        }

        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
        const newParticles: Particle[] = [];
        const numberOfParticles = 15;
        for (let i = 0; i < numberOfParticles; i++) {
            const angle = (i * 25 - 90) * (Math.PI / 180);
            const speed = 1.5 + Math.random() * 1;
            newParticles.push({
                id: Date.now() + i,
                x: 0,
                y: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
            });
        }
        
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
    };

    const handleToggleFavourite = async () => {
        if (!isAuthenticated) {
            openLogin("favourite");
            return;
        }

        if (!userId) {
            console.error("User ID not available");
            return;
        }

        try {
            if (isFavorite) {
                await fetch("/api/favourites", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, listingId }),
                });
                setIsFavoriteAction(false);
            } else {
                await fetch("/api/favourites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, listingId }),
                });
                setIsFavoriteAction(true);
                createCelebration();
            }
        } catch (error) {
            console.error("Error toggling favourite:", error);
        }
    };

    return (
        <>
            {typeof window !== 'undefined' && particles.length > 0 && createPortal(
                <div className="fixed inset-0 pointer-events-none z-20">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute pointer-events-none animate-[celebration_1s_ease-out_forwards]"
                            style={{
                                left: `${buttonPosition.x}px`,
                                top: `${buttonPosition.y}px`,
                                transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
                                '--particle-x': `${particle.velocityX * 50}px`,
                                '--particle-y': `${particle.velocityY * 50}px`,
                            } as React.CSSProperties}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: particle.color }}
                            />
                        </div>
                    ))}
                </div>,
                document.body
            )}
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavourite();
                }}
                aria-pressed={isFavorite}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 z-30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  className={`size-5 transition-colors ${isFavorite ? "fill-red-500 stroke-red-500" : "fill-transparent stroke-slate-950 stroke-2"}`}>
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
            </button>
        </>
    )
}