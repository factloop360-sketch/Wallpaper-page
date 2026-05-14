"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This MUST match your Google Cloud and Supabase Redirect settings
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Login failed:", error.message);
      alert("The Abyss blocked your entry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black uppercase italic mb-8">Login to <span className="text-red-600">Demons</span></h1>
      <button 
        onClick={handleGoogleLogin}
        className="px-8 py-4 bg-white text-black font-black uppercase rounded-xl hover:bg-zinc-200 transition-all"
      >
        Continue with Google
      </button>
    </div>
  );
}