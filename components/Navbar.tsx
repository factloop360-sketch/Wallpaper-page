"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '@/utils/supabase/client';


const DEFAULT_CATEGORIES = ["Abstract", "Anime", "Dark", "Nature", "Cars", "Space", "Gaming"];

function NavbarContent({ categories }: { categories: string[] }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryParam = searchParams.get("category");
  const currentSortParam = searchParams.get("sort");
  
  let activeCategory = "Home";
  if (currentSortParam === "trending") activeCategory = "Trending";
  else if (currentSortParam === "latest") activeCategory = "Latest";
  else if (currentCategoryParam && currentCategoryParam !== "all") activeCategory = currentCategoryParam;

  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setLocalSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleNavClick = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (item === "Home") {
      params.delete("category");
      params.delete("sort");
      params.delete("q");
      setLocalSearchQuery(""); 
    } else if (item === "Trending") {
      params.delete("category");
      params.set("sort", "trending");
    } else if (item === "Latest") {
      params.delete("category");
      params.set("sort", "latest");
    } else {
      params.set("category", item);
      params.delete("sort"); 
    }

    router.push(`/?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localSearchQuery.trim()) params.set("q", localSearchQuery);
    else params.delete("q");
    router.push(`/?${params.toString()}`);
  };

  const navItems = ["Home", "Trending", "Latest", ...categories.filter(c => !["Home", "Trending", "Latest"].includes(c))];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="max-w-[2560px] mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-8">
          
          <button onClick={() => handleNavClick("Home")} className="flex items-center gap-3 group transition-all hover:opacity-80 active:scale-95">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-white/10 shadow-[0_0_15px_rgba(220,38,38,0.15)] group-hover:border-red-500/30 transition-colors">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">
                Wallpaper <span className="text-red-600">Demons</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-40 text-white group-hover:text-red-400 transition-colors">
                The Abyss Awaits
              </span>
            </div>
          </button>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search the legion... (Press Enter)"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/40 border border-white/10 py-3 px-6 rounded-2xl text-sm focus:ring-2 focus:ring-red-600/50 focus:border-transparent focus:bg-zinc-900/80 outline-none text-white transition-all placeholder:text-zinc-600"
              />
            </div>
          </form>

          <div className="flex items-center gap-6">
            {isLoading ? (
              <div className="w-24 h-8 bg-white/5 animate-pulse rounded-xl"></div>
            ) : user ? (
              <>
                <span className="text-[11px] font-bold tracking-widest text-zinc-400 hidden sm:block">
                  {user.email?.split('@')[0]}
                </span>
                <button onClick={handleLogout} className="bg-white/5 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600/20 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 active:scale-95">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Log In</Link>
                <Link href="/signup" className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all active:scale-95">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
          {navItems.map((cat) => (
            <button
              key={cat}
              onClick={() => handleNavClick(cat)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                activeCategory === cat ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar({ categories = DEFAULT_CATEGORIES }: { categories?: string[] }) {
  return (
    <Suspense fallback={<div className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/5" />}>
      <NavbarContent categories={categories} />
    </Suspense>
  );
}