import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type Metadata, type ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; 
import LikeButton from "@/components/LikeButton";
import ProtectedDownloadButton from "@/components/ProtectedDownloadButton";

interface WallpaperPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: WallpaperPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: wallpaper } = await supabase
    .from("wallpapers")
    .select("title, description, image_url, category, tags")
    .eq("slug", slug)
    .single();

  if (!wallpaper) return { title: "Asset Not Found | Wallpaper Demons" };

  const ogImage = `${wallpaper.image_url}?width=1200&height=630&quality=80`;

  return {
    title: `${wallpaper.title} | ${wallpaper.category} 8K Wallpaper`,
    description: wallpaper.description || `Download high-resolution ${wallpaper.title} 8K wallpaper for phone and PC.`,
    keywords: [...(wallpaper.tags || []), wallpaper.category, "8K Wallpaper", "Wallpaper Demons"],
    openGraph: {
      title: wallpaper.title,
      description: wallpaper.description || "Premium 8K Asset",
      url: `https://wallpaperdemons.com/wallpaper/${slug}`,
      siteName: "Wallpaper Demons",
      images: [{ url: ogImage }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: wallpaper.title,
      description: wallpaper.description || "Premium 8K Asset",
      images: [ogImage],
    },
  };
}

export default async function WallpaperPage({ params }: WallpaperPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: wallpaper, error } = await supabase
    .from("wallpapers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !wallpaper) {
    notFound();
  }

  // OPTIMIZATION 1: Fire-and-forget RPC. 
  supabase.rpc('increment_views', { row_id: wallpaper.id }).then();

  // OPTIMIZATION 2: Separate Display Resolutions
  const optimizedPreviewUrl = `${wallpaper.image_url}?width=1600&format=webp&quality=85`;
  const microscopicBlurUrl = `${wallpaper.image_url}?width=200&format=webp&quality=50`;

  const { data: related } = await supabase
    .from("wallpapers")
    .select("*")
    .ilike("category", wallpaper.category)
    .neq("id", wallpaper.id)
    .limit(4);

  const applyWatermark = wallpaper.has_watermark && !user;
  
  // We can leave this here in case you want to use hasPurchased for UI logic later!
  let hasPurchased = false;
  if (wallpaper.is_premium && user) {
    const { data: order } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("wallpaper_id", wallpaper.id)
      .maybeSingle(); 
    
    if (order) hasPurchased = true;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": wallpaper.title,
    "description": wallpaper.description || `High resolution ${wallpaper.category} wallpaper`,
    "contentUrl": wallpaper.image_url,
    "thumbnailUrl": optimizedPreviewUrl,
    "author": {
      "@type": "Person",
      "name": wallpaper.author || "Demon Creator"
    },
    "keywords": wallpaper.tags?.join(", ")
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-red-500/30 pb-24 relative overflow-hidden">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image 
          src={microscopicBlurUrl} 
          alt="Ambient Background Glow" 
          fill 
          className="object-cover blur-[120px] opacity-20 scale-125 saturate-150" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/40 via-[#09090b]/80 to-[#09090b]"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all group active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="group-hover:translate-x-1 transition-transform">Back to the Legion</span>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1800px] mx-auto px-6 pt-[120px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative w-full aspect-[16/10] bg-zinc-950/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center group">
              <Image
                src={optimizedPreviewUrl}
                alt={wallpaper.title}
                fill
                priority
                unoptimized 
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain transition-transform duration-[1500ms] ease-out group-hover:scale-102"
              />

              {applyWatermark && (
                <div className="absolute inset-0 z-20 pointer-events-none select-none flex flex-col items-center justify-center bg-black/10 overflow-hidden">
                  <div className="w-[150%] h-[150%] flex flex-col justify-center items-center gap-24 opacity-[0.04] text-white font-black tracking-[0.6em] text-2xl md:text-4xl uppercase select-none rotate-[-25deg] mix-blend-screen">
                    <div>WALLPAPER DEMONS • PREVIEW MODE</div>
                    <div>WALLPAPER DEMONS • PREVIEW MODE</div>
                    <div>WALLPAPER DEMONS • PREVIEW MODE</div>
                  </div>
                </div>
              )}
            </div>
            
            {wallpaper.description && (
              <div className="p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-xl">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Asset Intel
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed">{wallpaper.description}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="mb-10">
              <div className="flex gap-2 mb-4">
                <span className="text-red-500 font-black uppercase tracking-[0.5em] text-[10px] block drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  {wallpaper.category || "Elite Asset"}
                </span>
                {wallpaper.is_premium && (
                  <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                    PREMIUM
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-4 drop-shadow-2xl">
                {wallpaper.title}
              </h1>
              <div className="flex items-center gap-4 text-zinc-500 font-bold text-sm">
                <span>Forged by <span className="text-zinc-200">{wallpaper.author || "Demon Creator"}</span></span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600/50" />
                <span className="tracking-widest">{wallpaper.resolution || "8K RAW"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-12">
              
            // dynamic price button
                <ProtectedDownloadButton
                  wallpaperId={wallpaper.id}
                  title={wallpaper.title}
                  url={wallpaper.image_url}
                  slug={wallpaper.slug}
                  isPremium={wallpaper.is_premium}
                  price={wallpaper.price || 1.99} // Use the dynamic DB price, default to 1.99
                />
              
              <div className="grid grid-cols-2 gap-4">
                <LikeButton wallpaperId={wallpaper.id} initialLikes={wallpaper.likes || 0} />
                <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-400">
                  {wallpaper.resolution?.split(' ')[0] || "ULTRA"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md shadow-2xl">
              <div className="text-center group">
                <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Total Views</p>
                <p className="text-white font-black italic text-3xl">{(wallpaper.views || 0) + 1}</p>
              </div>
              <div className="text-center border-l border-white/5 group">
                <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Siphoned</p>
                <p className="text-white font-black italic text-3xl">{wallpaper.downloads || 0}</p>
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
          <div className="mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-12 border-b border-white/10 pb-4">
              Other Related Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((wp) => (
                <Link key={wp.id} href={`/wallpaper/${wp.slug}`} className="group space-y-4 block">
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-xl group-hover:border-white/20 transition-colors group-hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                    <Image 
                      src={`${wp.image_url}?width=500&quality=70&format=webp`}
                      alt={wp.title} 
                      fill 
                      unoptimized 
                      className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110" 
                    />
                  </div>
                  <h3 className="font-black italic uppercase text-sm tracking-tighter text-zinc-300 group-hover:text-red-500 transition-colors px-2">{wp.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}