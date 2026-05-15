"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

interface ProtectedDownloadButtonProps {
  title: string;
  url: string;
}

export default function ProtectedDownloadButton({
  title,
  url,
}: ProtectedDownloadButtonProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleDownload = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>

      {isLoading
        ? "Checking Access..."
        : user
        ? "Download 8K Asset"
        : "Login to Download"}
    </button>
  );
}