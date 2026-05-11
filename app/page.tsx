'use client';

import React, { useState } from 'react';

// --- Types ---
interface Wallpaper {
  id: string;
  src: string;
  title: string;
  author: string;
  likes: string;
  isTrending?: boolean;
}

// --- Mock Data ---
const CATEGORIES = [
  'For You',
  'Trending',
  'Abstract',
  'Nature',
  'Minimalist',
  'Architecture',
  'Space',
  'Automotive',
  'Cyberpunk',
  'Anime',
  'Dark',
  'Animals',
];

const MOCK_WALLPAPERS: Wallpaper[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    title: 'Liquid Abstract',
    author: 'Milad Fakurian',
    likes: '12.4k',
    isTrending: true,
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1506744626753-eda8151a74a4?q=80&w=2000&auto=format&fit=crop',
    title: 'Canyon River',
    author: 'Robo O.',
    likes: '8.1k',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop',
    title: 'Deep Space',
    author: 'NASA',
    likes: '24.2k',
    isTrending: true,
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop',
    title: 'Code Minimal',
    author: 'Chris Ried',
    likes: '5.6k',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
    title: 'Neon Nights',
    author: 'Sean Foley',
    likes: '18.9k',
    isTrending: true,
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=2000&auto=format&fit=crop',
    title: 'Arctic Fox',
    author: 'Jonatan Pie',
    likes: '9.3k',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1502657872623-08d5b4739b14?q=80&w=2000&auto=format&fit=crop',
    title: 'City Geometry',
    author: 'Mikhail V.',
    likes: '4.2k',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1528642474498-1af0c17fac8c?q=80&w=2000&auto=format&fit=crop',
    title: 'Dark Texture',
    author: 'Paean',
    likes: '11.1k',
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop',
    title: 'Abstract Shapes',
    author: 'Mo Eid',
    likes: '7.8k',
    isTrending: true,
  },
  {
    id: '10',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop',
    title: 'Mountain Peak',
    author: 'Kalen Emsley',
    likes: '15.3k',
  },
  {
    id: '11',
    src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop',
    title: 'Purple Gradient',
    author: 'Milad Fakurian',
    likes: '6.4k',
  },
  {
    id: '12',
    src: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop',
    title: 'Minimalist Arch',
    author: 'Simone H.',
    likes: '3.9k',
  },
];

// --- Icons (Inline SVGs to keep component self-contained) ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FlameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// --- Main Page Component ---
export default function WallpaperPlatform() {
  const [activeCategory, setActiveCategory] = useState('For You');
  const trendingWallpapers = MOCK_WALLPAPERS.filter((wp) => wp.isTrending);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">W</span>
            </div>
            <span className="hidden md:block">Wallspace</span>
          </div>

          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-400 transition-colors">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search high-resolution wallpapers..."
              className="w-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500/50 focus:bg-zinc-900 focus:outline-none rounded-full py-2.5 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Explore
            </button>
            <button className="hidden md:flex text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Studio
            </button>
            <button className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
              <span className="text-sm font-medium">U</span>
            </button>
            <button className="md:hidden text-zinc-400 hover:text-white">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 pb-24">
        {/* Trending Section */}
        {activeCategory === 'For You' && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FlameIcon />
              <h2 className="text-2xl font-semibold tracking-tight">
                Trending Now
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingWallpapers.map((wp) => (
                <div
                  key={`trending-${wp.id}`}
                  className="group relative aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900"
                >
                  <img
                    src={wp.src}
                    alt={wp.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h3 className="text-white font-medium text-lg leading-tight">
                        {wp.title}
                      </h3>
                      <p className="text-zinc-300 text-sm mt-1">{wp.author}</p>
                    </div>
                    <button className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
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
            <h2 className="text-2xl font-semibold tracking-tight">
              {activeCategory === 'For You' ? 'Discover' : activeCategory}
            </h2>
            <span className="text-sm text-zinc-500 font-medium">
              {MOCK_WALLPAPERS.length} Wallpapers
            </span>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
            {MOCK_WALLPAPERS.map((wp) => (
              <div
                key={wp.id}
                className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900 cursor-zoom-in"
              >
                {/* 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Using standard <img> for plug-and-play capability without needing next.config.js modifications. 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        In production, switch to next/image if image optimization domain whitelisting is configured. 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */}
                <img
                  src={wp.src}
                  alt={wp.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Interactive Elements */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-end">
                    <button className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 hover:text-pink-500 transition-all">
                      <HeartIcon />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium truncate max-w-[150px] sm:max-w-[180px]">
                        {wp.title}
                      </p>
                      <p className="text-zinc-300 text-xs mt-0.5">
                        {wp.likes} likes
                      </p>
                    </div>
                    <button className="p-2.5 bg-white text-black hover:bg-zinc-200 rounded-full transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                      <DownloadIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Global Styles for removing scrollbar visually while keeping functionality */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            .no-scrollbar::-webkit-scrollbar {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      display: none;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      .no-scrollbar {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                -ms-overflow-style: none;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          scrollbar-width: none;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        `,
        }}
      />
    </div>
  );
}
