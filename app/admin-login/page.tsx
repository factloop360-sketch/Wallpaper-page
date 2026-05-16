"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

// Simple Google Icon SVG
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <path fill="#EA4335" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
  </svg>
);

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Smart Session Detection ---
  // If the user lands on this page but already has a valid session, push them straight to the dashboard.
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push("/admin");
      }
    };
    
    checkExistingSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    // Triggers the Google OAuth flow
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Sends the user to your server-side callback to establish the cookie, then to /admin
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (authError) {
      setError(authError.message);
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
          
          {error && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-sm text-xs font-black uppercase tracking-[0.2em] text-black bg-white hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <GoogleIcon />
                Sign in with Google
              </>
            )}
          </button>
        </div>
        
        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Unsanctioned access will be logged.
        </p>
      </div>
    </div>
  );
}