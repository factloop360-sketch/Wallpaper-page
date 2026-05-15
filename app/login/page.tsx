"use client";

import React from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Dynamically detects if you are on localhost or vercel
        redirectTo: `${window.location.origin}/auth-success`,
      },
    });

    if (error) {
      console.error("Login failed:", error.message);
      alert("The Abyss blocked your entry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Cinematic Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in-95 duration-1000 ease-out">
        {/* Branding */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Access the <span className="text-red-600">Legion</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            Return to the Abyss
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
            Authenticate your identity to continue siphoning premium 8K assets.
          </p>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {/* Google Icon SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
               <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
               <path fill="#34A853" d="M12 23c3.11 0 5.71-1.03 7.62-2.79l-3.57-2.77c-.99.66-2.26 1.06-3.79 1.06-2.91 0-5.38-1.97-6.26-4.62H2.18v2.87C4.09 20.36 7.77 23 12 23z" />
               <path fill="#FBBC05" d="M5.74 13.88c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19V6.63H2.18C1.41 8.16 1 9.88 1 11.75c0 1.88.41 3.6 1.18 5.12l3.56-2.99z" />
               <path fill="#EA4335" d="M12 5.38c1.69 0 3.21.58 4.41 1.72l3.31-3.31C17.71 1.84 15.11 1 12 1 7.77 1 4.09 3.64 2.18 7.37l3.56 2.87c.88-2.65 3.35-4.62 6.26-4.62z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col gap-6 pt-4">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Need an identity? <Link href="/signup" className="text-white hover:text-red-500 transition-colors border-b border-red-500/30 pb-0.5">Join Here</Link>
          </p>
          
          <Link href="/" className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors group">
            <span className="group-hover:-translate-x-1 inline-block transition-transform">←</span> Return to the Abyss
          </Link>
        </div>
      </div>
    </div>
  );
}