import React from "react";
import WallpaperCard from "./WallpaperCard";

export interface Wallpaper {
  id: string;
  slug: string;

  title: string;

  preview_url?: string;

  vault_key?: string;

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

export default function MasonryGrid({
  wallpapers,
}: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6 animate-in fade-in duration-1000 delay-300">
      {wallpapers.map((wp) => (
        <div
          key={wp.id}
          className="break-inside-avoid"
        >
          <WallpaperCard
            id={wp.id}
            slug={wp.slug}

            // lightweight preview ONLY
            preview_Url={wp.preview_url}

            // secure original download
            vault_Key={wp.vault_key}

            // legacy prop no longer used
            src={wp.preview_url || ""}

            title={wp.title}

            author={wp.author || "Demon Creator"}

            likes={wp.likes || 0}

            resolution={wp.resolution || "ULTRA"}

            premium={wp.premium}

            watermark={wp.watermark}

            price={wp.price}
          />
        </div>
      ))}
    </div>
  );
}