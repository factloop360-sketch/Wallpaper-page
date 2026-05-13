"use client";

import React, { useState,type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Hardcoded Admin Credentials
const ADMIN_EMAIL = "admin@abyss.com";
const ADMIN_SECRET = "Legion2026!";

export default function AdminLogin() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    //my code
    const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const ADMIN_SECRET =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // Artificial delay for a premium, heavy-processing feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_SECRET) {
      // Set session and redirect
      localStorage.setItem("admin_session", "authenticated");
      router.push("/admin");
    } else {
      setError("Invalid credentials. Access denied.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 selection:bg-red-500/30 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Left Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="group-hover:-translate-x-1 transition-transform">Return</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            System Override
          </h2>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Admin Designation
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-black/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-700"
                placeholder="admin@domain.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Security Clearance
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-black/50 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-700"
                placeholder="••••••••••••"
              />
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-sm text-xs font-black uppercase tracking-[0.2em] text-black bg-white hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Decrypting...
                </>
              ) : (
                "Initialize Access"
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Unsanctioned access will be logged.
        </p>
      </div>
    </div>
  );
}