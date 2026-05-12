"use client";

import React, { useState } from "react";

interface LikeButtonProps {
  initialLikes: string;
}

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-all duration-300">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export default function LikeButton({ initialLikes }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <button 
      onClick={() => setIsLiked(!isLiked)}
      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
        isLiked 
          ? "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-500 border border-pink-200 dark:border-pink-500/30 shadow-sm" 
          : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/5"
      }`}
    >
      <HeartIcon filled={isLiked} />
      {isLiked ? "Saved" : "Save"}
    </button>
  );
}