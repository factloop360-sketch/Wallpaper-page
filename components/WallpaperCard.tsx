"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  memo,
} from "react";

import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthProvider";
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
  premium?: boolean;
  watermark?: boolean;
  price?: number | null;
}

const HeartIcon = ({
  filled,
}: {
  filled?: boolean;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="transition-all duration-300"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

function WallpaperCard({
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
  premium = false,
  watermark = false,
  price = null,
}: WallpaperCardProps) {

  const router = useRouter();
  const { user } = useAuth();

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [currentLikes, setCurrentLikes] =
    useState(likes);

  const [isLiked, setIsLiked] =
    useState(false);

  const [isLoadingLike, setIsLoadingLike] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  useEffect(() => {

    const likedWallpapers =
      JSON.parse(
        localStorage.getItem(
          "liked_souls"
        ) || "[]"
      );

    if (likedWallpapers.includes(id)) {
      setIsLiked(true);
    }

  }, [id]);

  // REAL DOWNLOAD
  const triggerBinaryDownload =
    async () => {

      try {

        const masterUrl =
          src.split("?")[0];

        const response =
          await fetch(
            `/api/download?url=${encodeURIComponent(masterUrl)}&filename=${encodeURIComponent(
              `${title
                .toLowerCase()
                .replace(/\s+/g, "-")}.jpg`
            )}`
          );

        if (!response.ok) {
          throw new Error(
            "Download failed"
          );
        }

        const blob =
          await response.blob();

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement("a");

        link.href = blobUrl;

        link.download =
          `${title
            .toLowerCase()
            .replace(/\s+/g, "-")}.jpg`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(
          blobUrl
        );

      } catch (error) {

        console.error(
          "Download failed:",
          error
        );

        window.open(src, "_blank");
      }
    };

  const handleDownloadClick =
    async (
      e: React.MouseEvent
    ) => {

      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      // LOGIN REQUIRED
      if (!user) {

        setIsModalOpen(true);

        return;
      }

      // PREMIUM WALLPAPER
      if (Boolean(premium)) {

        router.push(
          `/wallpaper/${slug}`
        );

        return;
      }

      // FREE WALLPAPER DOWNLOAD
      await triggerBinaryDownload();
    };

  const handleLikeToggle = async (
    e: React.MouseEvent
  ) => {

    e.preventDefault();
    e.stopPropagation();

    if (isLoadingLike) return;

    setIsLoadingLike(true);

    const likedWallpapers =
      JSON.parse(
        localStorage.getItem(
          "liked_souls"
        ) || "[]"
      );

    if (isLiked) {

      setCurrentLikes((prev) =>
        Math.max(prev - 1, 0)
      );

      setIsLiked(false);

      const updatedLikes =
        likedWallpapers.filter(
          (likedId: string) =>
            likedId !== id
        );

      localStorage.setItem(
        "liked_souls",
        JSON.stringify(updatedLikes)
      );

      await supabase.rpc(
        "decrement_likes",
        { row_id: id }
      );

    } else {

      setCurrentLikes(
        (prev) => prev + 1
      );

      setIsLiked(true);

      localStorage.setItem(
        "liked_souls",
        JSON.stringify([
          ...likedWallpapers,
          id,
        ])
      );

      await supabase.rpc(
        "increment_likes",
        { row_id: id }
      );
    }

    setIsLoadingLike(false);
  };

  return (
    <>
      <Link
        href={`/wallpaper/${slug}`}
        prefetch={false}
        className="group relative block break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300"
      >

        {/* IMAGE */}
        <Image
          src={`${src}?width=500`}
          alt={alt || title}
          width={width}
          height={height}
          priority={false}
          loading="lazy"
          quality={60}
          unoptimized
          sizes="(max-width:640px) 100vw,
                 (max-width:1024px) 50vw,
                 33vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          onLoad={() =>
            setIsLoaded(true)
          }
          className={`transition-all duration-500 ${
            isLoaded
              ? "opacity-100 scale-100"
              : "opacity-0 scale-[1.02]"
          }`}
        />

        {/* LOADING */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-zinc-800" />
        )}

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between pointer-events-none">

          <div className="flex gap-2 flex-wrap">

            <span className="px-2 py-1 text-[10px] font-semibold tracking-wide text-white bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
              {resolution}
            </span>

            {premium === true && (
              <span className="px-2 py-1 text-[10px] font-black tracking-widest text-amber-300 bg-amber-500/15 backdrop-blur-sm rounded-full border border-amber-500/20">
                PRO
              </span>
            )}

            {price && (
              <span className="px-2 py-1 text-[10px] font-black tracking-widest text-yellow-200 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                ${price}
              </span>
            )}

            {watermark === true && (
              <span className="px-2 py-1 text-[10px] font-black tracking-widest text-red-300 bg-red-500/15 backdrop-blur-sm rounded-full border border-red-500/20">
                WM
              </span>
            )}

          </div>

          {/* LIKE BUTTON */}
          <button
            className={`pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full backdrop-blur-md ${
              isLiked
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                : "bg-black/40 text-white"
            }`}
            onClick={handleLikeToggle}
          >
            <HeartIcon
              filled={isLiked}
            />
          </button>

        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* BOTTOM */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-20">

          <div>

            <h3 className="text-white text-base sm:text-lg font-semibold leading-tight drop-shadow-md line-clamp-1">
              {title}
            </h3>

            <p className="text-zinc-300 text-xs mt-1">
              {author} • {currentLikes} likes
            </p>

          </div>

          {/* DOWNLOAD */}
          <button
            className="p-2.5 bg-white text-black rounded-full hover:bg-zinc-200 transition-all pointer-events-auto"
            onClick={
              handleDownloadClick
            }
          >
            <DownloadIcon />
          </button>

        </div>
      </Link>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onLogin={() => {

          setIsModalOpen(false);

          setTimeout(() => {

            if (premium === true) {

              router.push(
                `/wallpaper/${slug}`
              );

            } else {

              triggerBinaryDownload();
            }

          }, 300);
        }}
      />
    </>
  );
}

export default memo(WallpaperCard);