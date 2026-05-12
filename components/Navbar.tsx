"use client";

import React from "react";
import Link from "next/link";

export interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

// --- Premium Thin Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

// --- Layout Constants ---
const CONTAINER_PADDING = "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 min-[1920px]:px-24";
const CONTAINER_MAX_WIDTH = "max-w-[2400px] mx-auto";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
}: NavbarProps) {
  
  return (
    <div className="sticky top-0 z-50 flex flex-col bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-2xl border-b border-zinc-200/60 dark:border-white/[0.08] transition-colors duration-300">
      
      {/* Top Tier: Logo, Centered Search, and Auth */}
      <header className={`${CONTAINER_MAX_WIDTH} w-full ${CONTAINER_PADDING} h-16 sm:h-20 flex items-center justify-between gap-4 lg:gap-8`}>
        
        {/* 1. Left: Logo Area */}
        <div className="flex-1 flex items-center justify-start">
          <Link 
            href="/" 
            className="group flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("For You");
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
              <span className="text-white text-sm sm:text-base font-bold tracking-tighter">W</span>
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors">
              Wallspace
            </span>
          </Link>
        </div>

        {/* 2. Center: Search Bar (Grows on desktop, centered) */}
        <div className="flex-[2] max-w-2xl hidden md:block">
          <form onSubmit={(e) => e.preventDefault()} className="relative group">
            <label htmlFor="desktop-search" className="sr-only">Search wallpapers</label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
              <SearchIcon />
            </div>
            <input
              id="desktop-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search high-resolution wallpapers..."
              className="w-full bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#09090b] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 transition-all shadow-inner"
            />
          </form>
        </div>

        {/* 3. Right: Navigation & Auth */}
        <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3 shrink-0">
          
          {/* Mobile Search Trigger (Only shows on small screens) */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <SearchIcon />
          </button>

          <div className="hidden lg:flex items-center gap-1 mr-2">
            <button className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-3 py-2">Explore</button>
            <button className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-3 py-2">Studio</button>
          </div>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4 lg:pl-5">
            <button className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
              Log in
            </button>
            <button className="text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all px-4 py-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm">
              Sign up
            </button>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <UserIcon />
          </button>
        </div>
      </header>

      {/* Bottom Tier: Category Tabs */}
      <nav className={`${CONTAINER_MAX_WIDTH} w-full ${CONTAINER_PADDING} py-2 sm:py-3 relative border-t border-zinc-200/40 dark:border-white/5`}>
        {/* Soft edge gradients for scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/90 dark:from-[#09090b]/90 to-transparent pointer-events-none z-10 hidden sm:block" />
        
        <div className="flex overflow-x-auto gap-2 pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-0" role="tablist">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery(""); // Clear search when changing tabs
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
                    : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white/90 dark:from-[#09090b]/90 to-transparent pointer-events-none z-10" />
      </nav>
    </div>
  );
}