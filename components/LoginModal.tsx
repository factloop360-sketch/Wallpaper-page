"use client";

import React, { useState } from "react";
import { signInWithGoogle } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void; // FIX: Added this to match the WallpaperCard usage
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // If your auth flow is client-side only, you would call onLogin() here.
      // Since Supabase usually redirects, the page will refresh anyway.
      onLogin(); 
    } catch (err: any) {
      setError(err.message || "Failed to connect to Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={!isLoading ? onClose : undefined}
      />

      <div 
        className={`relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {!isLoading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20 mb-6">
            <span className="text-white text-3xl font-black italic tracking-tighter uppercase">D</span>
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
            Enter the Abyss
          </h2>
          <p className="text-zinc-500 text-sm font-medium">
            Sign in to download 4K assets and join the legion of Wallpaper Demons.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              "Summoning..."
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>
          
          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
            Protected by Supabase Hellfire
          </p>
        </div>
      </div>
    </div>
  );
}