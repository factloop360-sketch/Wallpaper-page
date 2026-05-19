"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useSearchParams } from "next/navigation";

interface ProtectedDownloadButtonProps {
  wallpaperId: string;
  title: string;
  url: string;
  slug: string;
  isPremium?: boolean;
  price: number; //  Corrected: Added price prop to interface
}

export default function ProtectedDownloadButton({
  wallpaperId,
  title,
  url,
  slug,
  isPremium = false,
  price, // 🚨 Corrected: Destructured price here
}: ProtectedDownloadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // --- MODE 1: STRIPE CHECKOUT INIT ---
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          wallpaperId, 
          wallpaperTitle: title, 
          wallpaperSlug: slug,
          price: Math.round(price * 100) // 🚨 Corrected: Convert dollars to cents
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Failed to initialize the secure payment gateway.");
      setIsProcessing(false);
    }
  };

  // --- MODE 2: SECURE VAULT CLAIM (POST-PAYMENT) ---
  const handleClaimSecureDownload = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/download-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, wallpaperId }),
      });
      const data = await res.json();

      if (!data.downloadUrl) {
        throw new Error(data.error || "Failed to decrypt vault link.");
      }

      await supabase.rpc("increment_downloads", { row_id: wallpaperId });

      // Use the server proxy approach for downloads to avoid CORS issues
      const filename = `${title.replace(/\s+/g, "-").toLowerCase()}-premium-demons.jpg`;
      window.location.href = `/api/download?url=${encodeURIComponent(data.downloadUrl)}&filename=${filename}`;

      window.history.replaceState(null, '', `/wallpaper/${slug}`);

    } catch (error: any) {
      console.error("Premium Download failed:", error);
      alert(error.message || "The Abyss refused the secure connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- MODE 3: STANDARD FREE DOWNLOAD ---
  const handleFreeDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsProcessing(true);

      const { error: dbError } = await supabase.rpc("increment_downloads", { row_id: wallpaperId });
      if (dbError) {
        await supabase.from("wallpapers").update({ downloads: Math.floor(Math.random() * 100) }).eq("id", wallpaperId);
      }

      const masterUrl = url.split("?")[0];
      const filename = `${title.replace(/\s+/g, "-").toLowerCase()}-demons-wall.jpg`;

      // Trigger the server proxy to force the download safely
      window.location.href = `/api/download?url=${encodeURIComponent(masterUrl)}&filename=${filename}`;

    } catch (error) {
      console.error("Download failed:", error);
      alert("The Abyss refused the connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER BLOCKS ---

  if (isPremium && sessionId) {
    return (
      <button
        onClick={handleClaimSecureDownload}
        disabled={isProcessing}
        className="w-full py-4 rounded-2xl bg-green-600 text-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-[0_0_30px_rgba(22,163,74,0.4)] animate-pulse flex items-center justify-center gap-3"
      >
        {isProcessing ? "Decrypting Vault..." : "Claim Secure Download"}
      </button>
    );
  }

  if (isPremium) {
    return (
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-600 to-amber-500 text-black font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3"
      >
        {isProcessing ? "Connecting to Gateway..." : `Unlock Premium Asset ($${price.toFixed(2)})`}
      </button>
    );
  }

  return (
    <button
      onClick={handleFreeDownload}
      disabled={isProcessing}
      className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
    >
      {isProcessing ? "Siphoning Soul..." : isLoading ? "Checking Access..." : user ? "Download 8K Asset" : "Login to Download"}
    </button>
  );
}