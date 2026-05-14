"use client";

import { useEffect } from "react";

export default function AuthSuccessPage() {
  useEffect(() => {
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
      Loading session...
    </div>
  );
}