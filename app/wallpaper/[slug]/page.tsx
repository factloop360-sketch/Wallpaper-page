import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_WALLPAPERS } from "@/lib/wallpapers";
import LikeButton from "@/components/LikeButton";
import ProtectedDownloadButton from "@/components/ProtectedDownloadButton";

// --- Icons ---
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
);

const MaximizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
);

interface WallpaperPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WallpaperPage({ params }: WallpaperPageProps) {
  // Await the params object in Next.js 15 App Router
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Find the requested wallpaper using the shared data file
  const wallpaper = MOCK_WALLPAPERS.find((wp) => wp.slug === slug);

  if (!wallpaper) {
    notFound();
  }

  const relatedWallpapers = MOCK_WALLPAPERS.filter((wp) => wp.slug !== slug && wp.category === wallpaper.category).slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30 pb-24">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md py-1 pr-2"
          >
            <ArrowLeftIcon />
            Back to Discover
          </Link>
          
          <div className="flex items-center gap-3">
            <button 
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Share Wallpaper"
            >
              <ShareIcon />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          {/* Left Column: Image Preview */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] bg-zinc-200 dark:bg-zinc-900 rounded-2xl md:rounded-3xl overflow-hidden group border border-zinc-200 dark:border-white/5 shadow-sm">
              <Image
                src={wallpaper.src}
                alt={wallpaper.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="View Fullscreen"
                >
                  <MaximizeIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Wallpaper Info & Actions */}
          <div className="lg:col-span-4 flex flex-col pt-2 lg:pt-6">
            
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">
                {wallpaper.title}
              </h1>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm md:text-base">
                <span>By <span className="font-medium text-zinc-900 dark:text-zinc-200">{wallpaper.author}</span></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HeartIcon /> {wallpaper.likes}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-10">
             <ProtectedDownloadButton title={wallpaper.title} />
              
              <div className="grid grid-cols-2 gap-3">
                <LikeButton initialLikes={wallpaper.likes} />
                <div className="w-full flex items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 py-3.5 rounded-xl font-medium border border-zinc-200 dark:border-white/5 cursor-default">
                  {wallpaper.resolution.split(' ')[0]} {/* Display only e.g. "4K" */}
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {wallpaper.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tag=${tag.toLowerCase()}`}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-transparent dark:border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="w-full h-px bg-zinc-200 dark:bg-white/5 my-16 md:my-24" />

        {/* Related Wallpapers Section */}
        {relatedWallpapers.length > 0 && (
          <section className="animate-in fade-in duration-700 delay-300 fill-mode-both">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                More like this
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {relatedWallpapers.map((wp) => (
                <Link
                  key={wp.slug}
                  href={`/wallpaper/${wp.slug}`}
                  className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 block"
                >
                  <Image
                    src={wp.src}
                    alt={wp.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h3 className="text-white font-medium truncate">{wp.title}</h3>
                    <p className="text-zinc-300 text-xs mt-1">{wp.resolution.split(' ')[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}