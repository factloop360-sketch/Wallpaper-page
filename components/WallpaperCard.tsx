"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import LoginModal from "./LoginModal";
import { useAuth } from "@/components/AuthProvider";

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
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  const { user } = useAuth();

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const likedWallpapers = JSON.parse(localStorage.getItem("liked_souls") || "[]");

    if (likedWallpapers.includes(id)) {
      setIsLiked(true);
    }
  }, [id]);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(src);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download wallpaper.");
    }
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingLike) return;

    setIsLoadingLike(true);

    const likedWallpapers = JSON.parse(
      localStorage.getItem("liked_souls") || "[]"
    );

    if (isLiked) {
      setCurrentLikes((prev) => Math.max(prev - 1, 0));
      setIsLiked(false);

      const updatedLikes = likedWallpapers.filter(
        (likedId: string) => likedId !== id
      );

      localStorage.setItem("liked_souls", JSON.stringify(updatedLikes));

      await supabase.rpc("decrement_likes", {
        row_id: id,
      });

    } else {
      setCurrentLikes((prev) => prev + 1);
      setIsLiked(true);

      localStorage.setItem(
        "liked_souls",
        JSON.stringify([...likedWallpapers, id])
      );

      await supabase.rpc("increment_likes", {
        row_id: id,
      });
    }

    setIsLoadingLike(false);
  };

  return (
    <>
      <Link
        href={`/wallpaper/${slug}`}
        className="group relative block break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
      >
        <Image
          src={`${src}?width=500&quality=70`}
          alt={alt || title}
          width={width}
          height={height}
          unoptimized
          className="w-full h-auto transition-all duration-700"
        />

        <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-black/40">

          <div className="flex justify-between items-start">
            <span className="px-2.5 py-1 text-xs font-semibold text-zinc-100 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
              {resolution}
            </span>

            <button
              className={`p-2.5 backdrop-blur-md rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-pink-500/20 text-pink-500 border border-pink-500/50"
                  : "bg-black/40 text-white hover:text-pink-400"
              }`}
              disabled={isLoadingLike}
              onClick={handleLikeToggle}
            >
              <HeartIcon filled={isLiked} />
            </button>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-white font-medium text-base line-clamp-1">
                {title}
              </h3>

              <p className="text-zinc-300 text-xs mt-1">
                {author} • {currentLikes} likes
              </p>
            </div>

            <button
              className="p-2.5 bg-white text-black hover:bg-zinc-200 rounded-full transition-all"
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
      />
    </>
  );
}