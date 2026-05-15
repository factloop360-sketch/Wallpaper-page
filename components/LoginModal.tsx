"use client";

import React from "react";
import { signInWithGoogle } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
      alert("The Abyss rejected your soul.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#09090b] p-8 shadow-2xl shadow-black relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="space-y-6 text-center">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tight text-white">
              Enter The Abyss
            </h2>

            <p className="text-zinc-500 text-sm mt-3">
              Login to unlock elite 8K assets.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all duration-300"
          >
            Continue With Google
          </button>
        </div>
      </div>
    </div>
  );
}