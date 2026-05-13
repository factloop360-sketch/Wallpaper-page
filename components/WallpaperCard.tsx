"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import LoginModal from "./LoginModal";

export interface WallpaperCardProps {
  id: string;
  slug: string;
  src: string;
  title: string;
  author: string;
  likes: number;
  resolution: string;
  width?: number;
  height?: number;
  alt?: string;
}

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-all duration-300">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export default function WallpaperCard({
  id,
  slug,
  src,
  title,
  author,
  likes,
  resolution,
  width = 800,
  height = 1000,
  alt,
}: WallpaperCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const likedWallpapers = JSON.parse(localStorage.getItem("liked_souls") || "[]");
    if (likedWallpapers.includes(id)) {
      setIsLiked(true);
    }
  }, [id]);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      alert(`Downloading high-resolution file for: ${title}`);
      window.open(src, "_blank");
    }
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only block if currently loading
    if (isLoadingLike) return;

    setIsLoadingLike(true);
    const likedWallpapers = JSON.parse(localStorage.getItem("liked_souls") || "[]");

    if (isLiked) {
      // --- UNLIKE LOGIC ---
      setCurrentLikes((prev) => Math.max(prev - 1, 0));
      setIsLiked(false);

      const updatedLikes = likedWallpapers.filter((likedId: string) => likedId !== id);
      localStorage.setItem("liked_souls", JSON.stringify(updatedLikes));

      const { error } = await supabase.rpc("decrement_likes", { row_id: id });

      if (error) {
        console.error("Failed to release soul:", error);
        setCurrentLikes((prev) => prev + 1);
        setIsLiked(true);
        localStorage.setItem("liked_souls", JSON.stringify([...updatedLikes, id]));
      }
    } else {
      // --- LIKE LOGIC ---
      setCurrentLikes((prev) => prev + 1);
      setIsLiked(true);

      localStorage.setItem("liked_souls", JSON.stringify([...likedWallpapers, id]));

      const { error } = await supabase.rpc("increment_likes", { row_id: id });

      if (error) {
        console.error("Failed to siphon soul:", error);
        setCurrentLikes((prev) => Math.max(prev - 1, 0));
        setIsLiked(false);
        const revertedLikes = likedWallpapers.filter((likedId: string) => likedId !== id);
        localStorage.setItem("liked_souls", JSON.stringify(revertedLikes));
      }
    }
    
    setIsLoadingLike(false);
  };

  return (
    <>
      <Link 
        href={`/wallpaper/${slug}`}
        className={`group relative block break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          !isLoaded ? "bg-zinc-200 dark:bg-zinc-800 animate-pulse" : "bg-zinc-100 dark:bg-zinc-900"
        }`}
      >
        <Image
          src={`${src}?width=500&quality=70`}
          alt={alt || title}
          width={width}
          height={height}
          unoptimized 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ width: "100%", height: "auto" }}
          onLoad={() => setIsLoaded(true)}
          className={`transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
            isLoaded 
              ? "opacity-100 blur-0 scale-100 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]" 
              : "opacity-0 blur-md scale-105"
          }`}
        />
        
        <div className={`absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 pointer-events-none ${isLoaded ? 'group-hover:opacity-100 group-focus-visible:opacity-100' : ''}`} aria-hidden="true" />
        <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none ${isLoaded ? 'group-hover:opacity-100 group-focus-visible:opacity-100' : ''}`} aria-hidden="true" />
        
        <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 ease-out z-10">
          
          <div className="flex justify-between items-start translate-y-[-10px] group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <span className="px-2.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wide text-zinc-100 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
              {resolution}
            </span>
            <button 
              className={`p-2.5 backdrop-blur-md rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 hover:scale-110 active:scale-75 disabled:opacity-50 disabled:hover:scale-100 ${
                isLiked 
                  ? "bg-pink-500/20 text-pink-500 border border-pink-500/50" 
                  : "bg-black/40 text-white hover:bg-black/60 hover:text-pink-400 border border-transparent"
              }`}
              aria-label={isLiked ? `Unlike ${title}` : `Like ${title}`}
              disabled={isLoadingLike} // FIXED: Removed the isLiked trap!
              onClick={handleLikeToggle}
            >
              <HeartIcon filled={isLiked} />
            </button>
          </div>

          <div className="flex items-end justify-between gap-3 translate-y-[10px] group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <div>
              <h3 className="text-white font-medium text-base sm:text-lg leading-tight line-clamp-1 drop-shadow-md">{title}</h3>
              <p className="text-zinc-300 text-xs mt-1 drop-shadow-md">{author} • {currentLikes} likes</p>
            </div>
            <button 
              className="p-2.5 bg-white text-black hover:bg-zinc-200 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0 scale-95 hover:scale-105 active:scale-90"
              aria-label={`Download ${title}`}
              onClick={handleDownloadClick} 
            >
              <DownloadIcon />
            </button>
          </div>
        </div>
      </Link>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogin={() => {
          setIsLoggedIn(true);
          setIsModalOpen(false);
          setTimeout(() => {
            alert(`Successfully logged in! Downloading: ${title}`);
            window.open(src, "_blank");
          }, 400);
        }} 
      />
    </>
  );
}