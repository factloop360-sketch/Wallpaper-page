"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import MasonryGrid from "@/components/MasonryGrid";

interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  image_url: string;
  preview_url?: string; 
  vault_key?: string;   
  category: string;
  resolution: string;
  likes: number;
  views: number;
  downloads: number;
  author: string;
  created_at: string;
  premium?: boolean;
  watermark?: boolean;
  price: number;
}

interface HydratedGalleryProps {
  category: string;
  sort: string;
  search: string;
}

const ITEMS_PER_PAGE = 16;

export default function HydratedGallery({ category, sort, search }: HydratedGalleryProps) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchBatch = useCallback(async (pageNum: number, clearExisting = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 🚨 DB QUERY FIX: Explicitly fetching preview_url and vault_key to pass to the UI
      let query = supabase.from("wallpapers").select(
  "id, slug, title, preview_url, vault_key, category, resolution, likes, views, downloads, author, created_at, premium, watermark, price"
      );

      if (search) query = query.ilike("title", `%${search}%`);
      if (category !== "all") query = query.ilike("category", category);

      const fromRange = pageNum * ITEMS_PER_PAGE;
      const toRange = fromRange + ITEMS_PER_PAGE - 1;

      switch (sort) {
        case "trending":
          query = query.order("likes", { ascending: false }).order("views", { ascending: false });
          break;
        case "views":
          query = query.order("views", { ascending: false });
          break;
        case "downloads":
          query = query.order("downloads", { ascending: false });
          break;
        case "latest":
          query = query.order("created_at", { ascending: false });
          break;
        case "random":
        default:
          query = query.order("created_at", { ascending: true });
          break;
      }

      query = query.range(fromRange, toRange);
      const { data, error } = await query;

      if (error) throw error;

      const fetchedItems = (data as Wallpaper[]) || [];
      if (fetchedItems.length < ITEMS_PER_PAGE) setHasMore(false);

      setWallpapers(prev => {
        const combined = clearExisting ? fetchedItems : [...prev, ...fetchedItems];
        if (sort === "random" && clearExisting) return combined.sort(() => Math.random() - 0.5);
        return combined;
      });

      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load batch pipeline:", err);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  },[category, sort, search]);

  useEffect(() => {
    setWallpapers([]);
    setPage(0);
    setHasMore(true);
    setIsInitialLoad(true);
    fetchBatch(0, true);
  }, [category, sort, search, fetchBatch]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget || !hasMore || isLoading || isInitialLoad) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) fetchBatch(page + 1);
      }, { threshold: 0.1, rootMargin: "200px" } 
    );

    observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [page, hasMore, isLoading, isInitialLoad, fetchBatch]);

  if (isInitialLoad) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full bg-zinc-900/30 aspect-square rounded-[2rem] border border-white/5" />
        ))}
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <div className="py-40 text-center border border-white/5 rounded-[2rem] bg-zinc-900/20 backdrop-blur-md">
        <h2 className="text-zinc-500 font-black uppercase italic text-3xl tracking-[0.2em]">The Abyss is Empty</h2>
        <p className="text-zinc-600 text-xs mt-4 font-bold uppercase tracking-[0.3em]">No assets match your search requirements.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="animate-in fade-in duration-500">
        <MasonryGrid wallpapers={wallpapers} />
      </div>

      {hasMore && (
        <div ref={observerTarget} className="w-full py-12 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-red-600 animate-spin rounded-full" />
        </div>
      )}
    </div>
  );
}