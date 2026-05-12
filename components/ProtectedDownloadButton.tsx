"use client";

import React, { useState } from "react";
import LoginModal from "./LoginModal";

interface ProtectedDownloadButtonProps {
  title: string;
}

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

export default function ProtectedDownloadButton({ title }: ProtectedDownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock Auth State (In a real app, this would come from a context like next-auth or Supabase)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleDownloadClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      // Trigger mock download
      alert(`Downloading high-resolution file for: ${title}`);
    }
  };

  return (
    <>
      <button 
        onClick={handleDownloadClick}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#09090b]"
      >
        <DownloadIcon />
        Download Free
      </button>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogin={() => {
          setIsLoggedIn(true);
          setIsModalOpen(false);
          // Optional: Automatically trigger download after successful login
          setTimeout(() => alert(`Successfully logged in! Downloading: ${title}`), 400);
        }} 
      />
    </>
  );
}