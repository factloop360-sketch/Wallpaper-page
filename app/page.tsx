"use client";

import React, { useState, useMemo } from "react";
import WallpaperCard from "@/components/WallpaperCard";
import Navbar from "@/components/Navbar";
import { MOCK_WALLPAPERS, CATEGORIES } from "@/lib/wallpapers";

// --- Icons specific to the main page ---
const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

// --- Adaptive Layout Constants ---
const CONTAINER_PADDING = "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 min-[1920px]:px-24";
const CONTAINER_MAX_WIDTH = "max-w-[2400px] mx-auto";

export default function WallpaperPlatform() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWallpapers = useMemo(() => {
    return MOCK_WALLPAPERS.filter((wp) => {
      const matchesSearch = wp.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory === "Trending") {
        matchesCategory = !!wp.isTrending;
      } else if (activeCategory !== "For You") {
        matchesCategory = wp.category === activeCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const trendingWallpapers = MOCK_WALLPAPERS.filter((wp) => wp.isTrending);
  const showTrendingHero = activeCategory === "For You" && searchQuery.trim() === "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={CATEGORIES}
      />

      <main className={`${CONTAINER_MAX_WIDTH} ${CONTAINER_PADDING} py-6 sm:py-8 lg:py-12 pb-24 sm:pb-32`}>
        
        {showTrendingHero && (
          <section className="mb-12 sm:mb-16 lg:mb-24 animate-in fade-in duration-700 ease-out">
            <div className="flex items-center gap-3 mb-6 sm:mb-8 lg:mb-10">
              <FlameIcon />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              {trendingWallpapers.map((wp, i) => (
                <div 
                  key={`trending-${wp.slug}`} 
                  className="w-full animate-in fade-in slide-in-from-bottom-4 ease-out"
                  style={{ animationDuration: '600ms', animationDelay: `${i * 75}ms`, animationFillMode: 'backwards' }}
                >
                  <WallpaperCard {...wp} alt={`Trending Wallpaper showing ${wp.title}`} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {searchQuery ? `Search results for "${searchQuery}"` : (activeCategory === "For You" ? "Discover" : activeCategory)}
            </h2>
            <span className="text-sm sm:text-base text-zinc-500 font-medium pb-1">
              Showing {filteredWallpapers.length} {filteredWallpapers.length === 1 ? 'wallpaper' : 'wallpapers'}
            </span>
          </div>
          
          {filteredWallpapers.length === 0 ? (
            <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-500 ease-out">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-200 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-400 mb-6 shadow-inner">
                <SearchIcon />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white mb-3">No wallpapers found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-sm sm:text-base leading-relaxed">
                We couldn&apos;t find anything matching your current filters. Try searching for something else or changing categories.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("For You");
                }}
                className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 min-[1920px]:columns-7 min-[2560px]:columns-8 gap-4 sm:gap-6 lg:gap-8 space-y-4 sm:space-y-6 lg:space-y-8">
              {filteredWallpapers.map((wp, i) => (
                <div 
                  key={wp.slug} 
                  className="animate-in fade-in slide-in-from-bottom-8 ease-out"
                  style={{ animationDuration: '700ms', animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
                >
                  <WallpaperCard {...wp} alt={`Wallpaper showing ${wp.title}`} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}