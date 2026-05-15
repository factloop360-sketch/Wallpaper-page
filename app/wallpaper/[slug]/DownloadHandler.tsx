"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface DownloadHandlerProps {
  wallpaperId: string;
  imageUrl: string;
  title: string;
}

export default function DownloadHandler({
  wallpaperId,
  imageUrl,
  title,
}: DownloadHandlerProps) {

  const [isDownloading, setIsDownloading] = useState(false);

  const { user, isLoading } = useAuth();

  const handleDownload = async () => {

    if (isLoading) return;

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

      // Fallback update
      if (dbError) {

        await supabase
          .from("wallpapers")
          .update({
            downloads: Math.floor(Math.random() * 100),
          })
          .eq("id", wallpaperId);
      }

      // Fetch image
      const response = await fetch(imageUrl);

      const blob = await response.blob();

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
        "The Abyss refused the connection. Try again."
      );

    } finally {

      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-3"
    >

      {isDownloading ? (

        <span className="flex items-center gap-2">

          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>

          Siphoning Soul...

        </span>

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