"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState,type FormEvent } from "react";

export default function FilterBar({ currentCategory, currentSort }: { currentCategory: string, currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for the search input
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Universal function to update URL
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "latest" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Handle Search Submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    updateParams("q", searchQuery);
  };

  const sortOptions = [
    { id: "latest", label: "Latest" },
    { id: "trending", label: "Trending" },
    { id: "views", label: "Most Viewed" },
    { id: "downloads", label: "Most Downloaded" },
  ];

  return (
    <div className="flex flex-col xl:flex-row justify-between items-center gap-6 py-6 border-y border-white/5">
      
      {/* 1. Search Bar */}
      <form onSubmit={handleSearch} className="w-full xl:w-auto relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH THE ABYSS..."
          className="w-full xl:w-80 bg-zinc-900/50 border border-white/10 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:bg-zinc-900 transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>

      {/* 2. Sort Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {sortOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateParams("sort", opt.id)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              currentSort === opt.id 
                ? "bg-red-600 text-white shadow-xl shadow-red-900/20 scale-105" 
                : "bg-zinc-900 text-zinc-500 hover:text-white border border-white/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      
      {/* 3. Active Category */}
      <div className="hidden md:block text-zinc-600 font-black uppercase tracking-[0.3em] text-[9px]">
        Sector: <span className="text-zinc-200">{currentCategory}</span>
      </div>
    </div>
  );
}