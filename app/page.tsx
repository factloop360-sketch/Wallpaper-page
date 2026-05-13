import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import MasonryGrid from "@/components/MasonryGrid";
import FilterBar from "@/components/FilterBar";
import WallpaperCard from "@/components/WallpaperCard";

// --- Types ---
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
}

// --- Main Page Component ---
export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  
  const category = params.category || "all";
  const sort = params.sort || "latest";
  const search = params.q || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 pb-24 selection:bg-red-500/30 relative">
      
      {/* Top Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-end gap-4 max-w-[1800px] mx-auto">
        <Link 
          href="/admin-login" 
          className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
        >
          Overlord
        </Link>
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

      {/* Hero Section */}
      <header className="max-w-[1800px] mx-auto pt-24 pb-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="relative w-20 h-20 md:w-28 md:h-28 mb-6 drop-shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform duration-700 rounded-2xl overflow-hidden">
          <Image
            src="/logo.jpg" 
            alt="Wallpaper Demons Logo"
            fill
            priority
            className="object-cover"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-3">
          Wallpaper <span className="text-red-600">Demons</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[10px]">
          Premium 8K Assets for the Elite
        </p>
      </header>

      {/* Control Center */}
      <div className="max-w-[1800px] mx-auto mb-12">
        <FilterBar currentCategory={category} currentSort={sort} />
      </div>

      {/* Dynamic Content Area with Premium Loading State */}
      <div className="max-w-[1800px] mx-auto">
        <Suspense fallback={<DashboardSkeleton />}>
          <DynamicContent category={category} sort={sort} search={search} />
        </Suspense>
      </div>
    </main>
  );
}

// --- Data Fetching & Layout Component ---
async function DynamicContent({ category, sort, search }: { category: string, sort: string, search: string }) {
  const supabase = await createClient();
  
  // Determine if the user is actively filtering/searching
  const isFiltering = search !== "" || category !== "all" || sort !== "latest";

  if (isFiltering) {
    // FILTER MODE: Render standard Masonry Grid for specific searches
    let query = supabase.from("wallpapers").select("*");

    if (search) query = query.ilike("title", `%${search}%`);
    if (category !== "all") query = query.eq("category", category);

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

    const { data: wallpapers } = await query.limit(48);

    if (!wallpapers || wallpapers.length === 0) {
      return (
        <div className="py-32 text-center border border-white/5 rounded-[2rem] bg-zinc-900/30 backdrop-blur-sm animate-in fade-in">
          <h2 className="text-zinc-600 font-black uppercase italic text-2xl tracking-widest">The Abyss is Empty</h2>
          <p className="text-zinc-500 text-xs mt-2 font-bold uppercase tracking-[0.2em]">No assets match your search or filters.</p>
        </div>
      );
    }

    return <MasonryGrid wallpapers={wallpapers as Wallpaper[]} />;
  }

  // DASHBOARD MODE: Fetch top ranking sections concurrently for maximum speed
  const [
    { data: trending },
    { data: viewed },
    { data: downloaded },
    { data: latest }
  ] = await Promise.all([
    supabase.from("wallpapers").select("*").order("likes", { ascending: false }).order("views", { ascending: false }).limit(4),
    supabase.from("wallpapers").select("*").order("views", { ascending: false }).limit(4),
    supabase.from("wallpapers").select("*").order("downloads", { ascending: false }).limit(4),
    supabase.from("wallpapers").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      <Section title="🔥 Trending Souls" items={trending as Wallpaper[]} seeMoreHref="?sort=trending" />
      <Section title="👁️ Most Viewed" items={viewed as Wallpaper[]} seeMoreHref="?sort=views" />
      <Section title="⬇️ Most Siphoned" items={downloaded as Wallpaper[]} seeMoreHref="?sort=downloads" />
      
      {/* Latest section gets a larger grid footprint */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">✨ Newly Forged</h2>
          <Link href="?sort=latest" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            View All
          </Link>
        </div>
        <MasonryGrid wallpapers={(latest as Wallpaper[]) || []} />
      </section>
    </div>
  );
}

// --- Reusable Horizontal Rail Component ---
function Section({ title, items, seeMoreHref }: { title: string, items: Wallpaper[], seeMoreHref: string }) {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h2>
        <Link href={seeMoreHref} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          View All
        </Link>
      </div>
      
      {/* Standard CSS Grid tailored for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((wp) => (
          <div key={wp.id} className="w-full">
            <WallpaperCard 
              id={wp.id}
              slug={wp.slug}
              src={wp.image_url} 
              title={wp.title}
              author={wp.author || "Demon Creator"}
              likes={wp.likes || 0}
              resolution={wp.resolution || "ULTRA"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Premium Loading State Skeleton ---
function DashboardSkeleton() {
  return (
    <div className="space-y-24 w-full">
      {[1, 2, 3].map((section) => (
        <div key={section} className="animate-pulse">
          <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
            <div className="h-8 w-48 bg-zinc-900 rounded-lg"></div>
            <div className="h-4 w-16 bg-zinc-900 rounded-md"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="w-full aspect-[4/5] bg-zinc-900/50 rounded-2xl border border-white/5"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}