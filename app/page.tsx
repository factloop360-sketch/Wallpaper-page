import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import MasonryGrid from "@/components/MasonryGrid";
import FilterBar from "@/components/FilterBar";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // 1. Await Next.js 15 parameters and initialize Supabase
  const params = await searchParams;
  const supabase = await createClient();
  
  // 2. Extract Filter, Sort, and Search parameters from the URL
  const category = params.category || "all";
  const sort = params.sort || "latest";
  const search = params.q || "";

  // 3. Initialize the base Supabase Query
  let query = supabase.from("wallpapers").select("*");

  // 4. Apply Search Filter
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  // 5. Apply Category Filter
  if (category !== "all") {
    query = query.eq("category", category);
  }

  // 6. Apply Dynamic Sorting Logic
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
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // 7. Execute the database query
  const { data: wallpapers, error } = await query;

  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 pb-24 selection:bg-red-500/30 relative">
      
      {/* Top Navigation Bar for Auth */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-end gap-4 max-w-[1800px] mx-auto">
        <Link 
          href="/login" 
          className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5"
        >
          Join Legion
        </Link>
      </nav>

      {/* Modern, Compact Hero Section */}
      <header className="max-w-[1800px] mx-auto pt-24 pb-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-8 duration-1000">
        
        {/* Scaled-down Logo with rounded corners */}
        <div className="relative w-20 h-20 md:w-28 md:h-28 mb-6 drop-shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform duration-700 rounded-2xl overflow-hidden">
          <Image
            src="/logo.jpg" 
            alt="Wallpaper Demons Logo"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Scaled-down Typography */}
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-3">
          Wallpaper <span className="text-red-600">Demons</span>
        </h1>
        
        <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[10px]">
          Premium 8K Assets for the Elite
        </p>
      </header>

      {/* Control Center: Search, Filter, Sort */}
      <div className="max-w-[1800px] mx-auto mb-12">
        {/* Note: Ensure the alias @/components/ works, or change to ../components/ if your tsconfig is still acting up */}
        <FilterBar currentCategory={category} currentSort={sort} />
      </div>

      {/* Masonry Grid */}
      <div className="max-w-[1800px] mx-auto">
        {wallpapers && wallpapers.length > 0 ? (
          <MasonryGrid wallpapers={wallpapers} />
        ) : (
          <div className="py-32 text-center border border-white/5 rounded-[2rem] bg-zinc-900/30 backdrop-blur-sm">
            <h2 className="text-zinc-600 font-black uppercase italic text-2xl tracking-widest">
              The Abyss is Empty
            </h2>
            <p className="text-zinc-500 text-xs mt-2 font-bold uppercase tracking-[0.2em]">
              No assets match your search or filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}