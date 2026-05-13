"use client";

import React, { useState } from "react";
import LoginModal from "./LoginModal";

interface ProtectedDownloadButtonProps {
  title: string;
  url: string;
}

export default function ProtectedDownloadButton({ title, url }: ProtectedDownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      alert(`Downloading high-resolution file for: ${title}`);
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <button 
        onClick={handleDownload}
        className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Siphon High-Res Asset
      </button>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogin={() => {
          setIsLoggedIn(true);
          setIsModalOpen(false);
          setTimeout(() => {
            alert(`Successfully logged in! Downloading: ${title}`);
            window.open(url, "_blank");
          }, 400);
        }} 
      />
    </>
  );
}