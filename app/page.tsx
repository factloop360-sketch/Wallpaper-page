"use client";

import React, { useState } from "react";
import Image from "next/image";
import WallpaperCard from "./components/WallpaperCard";

// --- Types ---
interface Wallpaper {
  id: string;
  src: string;
  title: string;
  author: string;
  likes: string;
  resolution: string;
  isTrending?: boolean;
}

// --- Mock Data ---
const CATEGORIES = [
  "For You",
  "Trending",
  "Abstract",
  "Nature",
  "Minimalist",
  "Architecture",
  "Space",
  "Automotive",
  "Cyberpunk",
  "Anime",
  "Dark",
  "Animals",
];

const MOCK_WALLPAPERS: Wallpaper[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop", title: "Liquid Abstract", author: "Milad Fakurian", likes: "12.4k", resolution: "4K", isTrending: true },
  { id: "2", src: "https://images.unsplash.com/photo-1506744626753-eda8151a74a4?q=80&w=1200&auto=format&fit=crop", title: "Canyon River", author: "Robo O.", likes: "8.1k", resolution: "1080p" },
  { id: "3", src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop", title: "Deep Space", author: "NASA", likes: "24.2k", resolution: "8K", isTrending: true },
  { id: "4", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop", title: "Code Minimal", author: "Chris Ried", likes: "5.6k", resolution: "4K" },
  { id: "5", src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop", title: "Neon Nights", author: "Sean Foley", likes: "18.9k", resolution: "4K", isTrending: true },
  { id: "6", src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop", title: "Arctic Fox", author: "Jonatan Pie", likes: "9.3k", resolution: "1440p" },
  { id: "7", src: "https://images.unsplash.com/photo-1502657872623-08d5b4739b14?q=80&w=1200&auto=format&fit=crop", title: "City Geometry", author: "Mikhail V.", likes: "4.2k", resolution: "1080p" },
  { id: "8", src: "https://images.unsplash.com/photo-1528642474498-1af0c17fac8c?q=80&w=1200&auto=format&fit=crop", title: "Dark Texture", author: "Paean", likes: "11.1k", resolution: "4K" },
  { id: "9", src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop", title: "Abstract Shapes", author: "Mo Eid", likes: "7.8k", resolution: "8K", isTrending: true },
  { id: "10", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop", title: "Mountain Peak", author: "Kalen Emsley", likes: "15.3k", resolution: "4K" },
  { id: "11", src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop", title: "Purple Gradient", author: "Milad Fakurian", likes: "6.4k", resolution: "1440p" },
  { id: "12", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop", title: "Minimalist Arch", author: "Simone H.", likes: "3.9k", resolution: "1080p" },
];

// --- Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// --- Main Page Component ---
export default function WallpaperPlatform() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const trendingWallpapers = MOCK_WALLPAPERS.filter((wp) => wp.isTrending);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic here
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center" aria-hidden="true">
              <span className="text-white text-sm">W</span>
            </div>
            <span className="hidden md:block">Wallspace</span>
          </div>

          <form 
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl relative group"
          >
            <label htmlFor="search-input" className="sr-only">Search high-resolution wallpapers</label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
              <SearchIcon />
            </div>
            <input
              id="search-input"
              type="search"
              placeholder="Search high-resolution wallpapers..."
              className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-full py-2.5 pl-12 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 transition-all shadow-inner"
            />
          </form>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1">
              Explore
            </button>
            <button className="hidden md:flex text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1">
              Studio
            </button>
            <button 
              className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="User Profile"
            >
              <span className="text-sm font-medium" aria-hidden="true">U</span>
            </button>
            <button 
              className="md:hidden p-2 -mr-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
              aria-label="Open Menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mb-2" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 md:py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent dark:border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 pb-24">
        {/* Trending Section */}
        {activeCategory === "For You" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FlameIcon />
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingWallpapers.map((wp) => (
                <div
                  key={`trending-${wp.id}`}
                  tabIndex={0}
                  className="group relative aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                >
                  <Image
                    src={wp.src}
                    alt={wp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 group-focus-within:opacity-80 transition-opacity duration-300" aria-hidden="true" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h3 className="text-white font-medium text-lg leading-tight">{wp.title}</h3>
                      <p className="text-zinc-300 text-sm mt-1">{wp.author}</p>
                    </div>
                    <button 
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label={`Download ${wp.title} by ${wp.author}`}
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Masonry Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {activeCategory === "For You" ? "Discover" : activeCategory}
            </h2>
            <span className="text-sm text-zinc-500 font-medium">{MOCK_WALLPAPERS.length} Wallpapers</span>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
            {MOCK_WALLPAPERS.map((wp) => (
              <WallpaperCard
                key={wp.id}
                src={wp.src}
                title={wp.title}
                author={wp.author}
                likes={wp.likes}
                resolution={wp.resolution}
                alt={`Wallpaper showing ${wp.title}`}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}