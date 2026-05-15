"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface ProtectedDownloadButtonProps {
  wallpaperId: string;
  title: string;
  url: string;
}

export default function ProtectedDownloadButton({
  wallpaperId,
  title,
  url,
}: ProtectedDownloadButtonProps) {

  const [isDownloading, setIsDownloading] =
    useState(false);

  const { user, isLoading } = useAuth();

  const handleDownload = async (
    e: React.MouseEvent
  ) => {

    e.preventDefault();

    if (isLoading) return;

    // Redirect guests to login
    if (!user) {

      window.location.href = "/login";

      return;
    }

    try {

      setIsDownloading(true);

      // Increment download count
      const { error: dbError } =
        await supabase.rpc(
          "increment_downloads",
          { row_id: wallpaperId }
        );

      // Fallback if RPC missing
      if (dbError) {

        await supabase
          .from("wallpapers")
          .update({
            downloads: Math.floor(Math.random() * 100),
          })
          .eq("id", wallpaperId);
      }

      // Fetch actual image blob
      const response =
        await fetch(url);

      const blob =
        await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      // Force browser download
      const link =
        document.createElement("a");

      link.href = blobUrl;

      link.download =
        `${title.replace(/\s+/g, "-").toLowerCase()}-demons-wall.jpg`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {

      console.error(
        "Download failed:",
        error
      );

      alert(
        "The Abyss refused the connection."
      );

    } finally {

      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
    >

      {isDownloading ? (

        "Siphoning Soul..."

      ) : isLoading ? (

        "Checking Access..."

      ) : user ? (

        "Download 8K Asset"

      ) : (

        "Login to Download"

      )}

    </button>
  );
}