"use client";

import { useEffect } from "react";

export default function AuthSuccessPage() {

  useEffect(() => {

    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 1500);

    return () => clearTimeout(timeout);

  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">

      <div className="text-center space-y-4">

        <h1 className="text-3xl font-black uppercase">
          Authentication Successful
        </h1>

        <p className="text-zinc-500">
          Redirecting to the abyss...
        </p>

      </div>

    </div>
  );
}