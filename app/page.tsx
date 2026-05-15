import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import MasonryGrid from "@/components/MasonryGrid";
import Navbar from "@/components/Navbar";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
}

interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  image_url: string;
  category: string;
  resolution: string;
  likes: number;
  views: number;
  downloads: number;
  author: string;
  created_at: string;
  is_premium?: boolean;
  has_watermark?: boolean;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category || "all";
  const sort = params.sort || "random";
  const search = params.q || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 pb-24 pt-[140px] selection:bg-red-500/30 relative overflow-hidden">
      
      {/* Navbar is self-contained explicitly on the Home view */}
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-600/5 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="max-w-[2560px] mx-auto relative z-10">
        <Suspense fallback={<GridSkeleton />}>
          <DynamicContent category={category} sort={sort} search={search} />
        </Suspense>
      </div>
    </main>
  );
}

async function DynamicContent({ category, sort, search }: { category: string, sort: string, search: string }) {
  const supabase = await createClient();
  let query = supabase.from("wallpapers").select("*");

  if (search) query = query.ilike("title", `%${search}%`);
  if (category !== "all") query = query.ilike("category", category);

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
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      query = query.gte("created_at", startOfDay.toISOString()).order("created_at", { ascending: false });
      break;
    case "random":
    default:
      query = query.limit(200);
      break;
  }

  const { data: wallpapers, error } = await query;
  let finalWallpapers = (wallpapers as Wallpaper[]) || [];

  if (sort === "random") {
    finalWallpapers = finalWallpapers.sort(() => Math.random() - 0.5);
  }

  if (error || finalWallpapers.length === 0) {
    return (
      <div className="py-40 text-center border border-white/5 rounded-[2rem] bg-zinc-900/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h2 className="text-zinc-500 font-black uppercase italic text-3xl tracking-[0.2em]">The Abyss is Empty</h2>
        <p className="text-zinc-600 text-xs mt-4 font-bold uppercase tracking-[0.3em]">No assets match your filters.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-12 duration-[1500ms] ease-out">
      <MasonryGrid wallpapers={finalWallpapers} />
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse">
      {[...Array(16)].map((_, i) => (
        <div key={i} className={`w-full bg-zinc-900/30 rounded-[2rem] border border-white/5 ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}></div>
      ))}
    </div>
  );
}