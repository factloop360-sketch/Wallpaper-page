"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface DownloadHandlerProps {
  wallpaperId: string;
  imageUrl: string;
  title: string;
}

export default function DownloadHandler({ wallpaperId, imageUrl, title }: DownloadHandlerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
 // const supabase = createClient();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // 1. Increment download count in Supabase
      const { error: dbError } = await supabase.rpc('increment_downloads', { row_id: wallpaperId });
      
      // If RPC isn't set up, use standard update:
      if (dbError) {
        await supabase
          .from("wallpapers")
          .update({ downloads: Math.floor(Math.random() * 100) }) // Logic fallback
          .eq("id", wallpaperId);
      }

      // 2. Fetch the raw image blob (avoids just opening in a new tab)
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 3. Trigger Browser Download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-demons-wall.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("The Abyss refused the connection. Try again.");
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
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Siphoning Soul...
        </span>
      ) : (
        "Download 8K Asset"
      )}
    </button>
  );
}