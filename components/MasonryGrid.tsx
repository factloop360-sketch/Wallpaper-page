import React from "react";
import WallpaperCard from "./WallpaperCard";

export interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  image_url: string; 
  category: string;
  resolution: string;
  likes: number;
  views: number;
  downloads: number;
  author: string;
  premium?: boolean;
  watermark?: boolean;
  price: number | null;
}

interface MasonryGridProps {
  wallpapers: Wallpaper[];
}

export default function MasonryGrid({ wallpapers }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6 animate-in fade-in duration-1000 delay-300">
      {wallpapers.map((wp) => (
        <div key={wp.id} className="break-inside-avoid">
          <WallpaperCard 
            id={wp.id}
            slug={wp.slug}
            src={wp.image_url} 
            title={wp.title}
            author={wp.author || "Demon Creator"}
            likes={wp.likes || 0}
            resolution={wp.resolution || "ULTRA"}
            premium={wp.premium}     //  ADDED: Explicitly pass premium status
            watermark={wp.watermark} //  ADDED: Explicitly pass watermark status
            price={wp.price}         //  ADDED: Explicitly pass dynamic price
          />
        </div>
      ))}
    </div>
  );
}