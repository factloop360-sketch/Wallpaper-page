import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; 
import LikeButton from "@/components/LikeButton";
import ProtectedDownloadButton from "@/components/ProtectedDownloadButton";

interface WallpaperPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WallpaperPage({ params }: WallpaperPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = await createClient();

  const { data: wallpaper, error } = await supabase
    .from("wallpapers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !wallpaper) {
    notFound();
  }

  // Increment views on load
  await supabase.rpc('increment_views', { row_id: wallpaper.id });

  // Fast loading preview URL
  const optimizedPreviewUrl = `${wallpaper.image_url}?width=1600&format=webp&quality=85`;

  const { data: related } = await supabase
    .from("wallpapers")
    .select("*")
    .eq("category", wallpaper.category)
    .neq("id", wallpaper.id)
    .limit(4);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-red-500/30 pb-24">
      
      <nav className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="group-hover:translate-x-1 transition-transform">Back to the Legion</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative w-full aspect-[16/10] bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl shadow-black flex items-center justify-center">
              <Image
                src={optimizedPreviewUrl}
                alt={wallpaper.title}
                fill
                priority
                unoptimized // FIXED: Required for custom Supabase URLs
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            
            <div className="mb-10">
              <span className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">
                {wallpaper.category || "Elite Asset"}
              </span>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-4">
                {wallpaper.title}
              </h1>
              <div className="flex items-center gap-4 text-zinc-500 font-bold text-sm">
                <span>By <span className="text-zinc-200">{wallpaper.author || "Demon Creator"}</span></span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span>{wallpaper.resolution || "8K RAW"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-12">
              <ProtectedDownloadButton 
                title={wallpaper.title} 
                url={wallpaper.image_url} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <LikeButton wallpaperId={wallpaper.id} initialLikes={wallpaper.likes || 0} />
                
                <div className="flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-400">
                  {wallpaper.resolution?.split(' ')[0] || "ULTRA"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Total Views</p>
                <p className="text-white font-black italic text-2xl">{(wallpaper.views || 0) + 1}</p>
              </div>
              <div className="text-center border-l border-white/5">
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Siphoned</p>
                <p className="text-white font-black italic text-2xl">{wallpaper.downloads || 0}</p>
              </div>
            </div>

            {wallpaper.tags && wallpaper.tags.length > 0 && (
              <div className="mt-12 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Soul Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {wallpaper.tags.map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-32 animate-in fade-in duration-1000 delay-500">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-12">Other Legion Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((wp) => (
                <Link key={wp.id} href={`/wallpaper/${wp.slug}`} className="group space-y-4">
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-lg">
                    <Image 
                      src={`${wp.image_url}?width=500&quality=70`}
                      alt={wp.title} 
                      fill 
                      unoptimized // FIXED
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <h3 className="font-black italic uppercase text-sm tracking-tighter group-hover:text-red-600 transition-colors">{wp.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}