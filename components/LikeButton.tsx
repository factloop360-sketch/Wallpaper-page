"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

interface LikeButtonProps {
  wallpaperId: string;
  initialLikes: number;
}

export default function LikeButton({ wallpaperId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 // const supabase = createClient();

  useEffect(() => {
    const likedWallpapers = JSON.parse(localStorage.getItem("liked_souls") || "[]");
    if (likedWallpapers.includes(wallpaperId)) {
      setIsLiked(true);
    }
  }, [wallpaperId]);

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    
    // Only block if currently processing a request
    if (isLoading) return;

    setIsLoading(true);
    const likedWallpapers = JSON.parse(localStorage.getItem("liked_souls") || "[]");

    if (isLiked) {
      // --- UNLIKE LOGIC ---
      setLikes((prev) => Math.max(prev - 1, 0)); // Instant visual update
      setIsLiked(false);

      // Remove from local storage
      const updatedLikes = likedWallpapers.filter((id: string) => id !== wallpaperId);
      localStorage.setItem("liked_souls", JSON.stringify(updatedLikes));

      // Update Database
      const { error } = await supabase.rpc("decrement_likes", { row_id: wallpaperId });

      if (error) {
        console.error("Failed to release soul:", error);
        // Revert on failure
        setLikes((prev) => prev + 1);
        setIsLiked(true);
        localStorage.setItem("liked_souls", JSON.stringify([...updatedLikes, wallpaperId]));
      }

    } else {
      // --- LIKE LOGIC ---
      setLikes((prev) => prev + 1); // Instant visual update
      setIsLiked(true);

      // Add to local storage
      localStorage.setItem("liked_souls", JSON.stringify([...likedWallpapers, wallpaperId]));

      // Update Database
      const { error } = await supabase.rpc("increment_likes", { row_id: wallpaperId });

      if (error) {
        console.error("Failed to siphon soul:", error);
        // Revert on failure
        setLikes((prev) => Math.max(prev - 1, 0));
        setIsLiked(false);
        const revertedLikes = likedWallpapers.filter((id: string) => id !== wallpaperId);
        localStorage.setItem("liked_souls", JSON.stringify(revertedLikes));
      }
    }
    
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading} // Removed the isLiked lock!
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 ${
        isLiked 
          ? "bg-red-600/10 border-red-600/50 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
          : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" height="14" 
        viewBox="0 0 24 24" 
        fill={isLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={isLiked ? "scale-110 transition-transform" : ""}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span className="text-[11px] font-black uppercase tracking-widest">{likes}</span>
    </button>
  );
}