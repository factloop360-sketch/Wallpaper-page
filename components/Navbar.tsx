"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[]; 
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
}: NavbarProps) {
  const navItems = ["Home", "Trending", ...categories.filter(c => c !== "Home" && c !== "Trending")];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[2560px] mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-8">
          
          <button 
            onClick={() => {
              setActiveCategory("Home");
              setSearchQuery("");
            }} 
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-white/10">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">
                Wallpaper <span className="text-red-600">Demons</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-40 text-white">
                The Abyss Awaits
              </span>
            </div>
          </button>

          <div className="flex-1 max-w-2xl hidden md:block">
            <input
              type="text"
              placeholder="Search the legion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 py-2.5 px-6 rounded-xl text-sm focus:ring-1 focus:ring-red-600/50 outline-none text-white"
            />
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
              Log In
            </Link>
            <Link href="/signup" className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
          {navItems.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                  : "bg-white/5 text-zinc-500 hover:bg-white/10"
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