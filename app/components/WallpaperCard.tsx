import Image from "next/image";

export interface WallpaperCardProps {
  src: string;
  title: string;
  resolution: string;
  author?: string;
  likes?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function WallpaperCard({
  src,
  title,
  resolution,
  author,
  likes,
  width = 800,
  height = 1000, // Default aspect ratio for masonry grid
  alt,
}: WallpaperCardProps) {
  return (
    <div 
      className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
      tabIndex={0}
    >
      <Image
        src={src}
        alt={alt || title}
        width={width}
        height={height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{ width: "100%", height: "auto" }}
        className="transition-transform duration-700 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
        loading="lazy"
      />
      
      {/* Overlays for contrast and aesthetics */}
      <div 
        className="absolute inset-0 bg-black/10 dark:bg-black/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* Interactive Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
        <h3 className="text-white font-medium text-base sm:text-lg leading-tight line-clamp-2">
          {title}
        </h3>
        <span className="flex-shrink-0 px-2.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wide text-zinc-100 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
          {resolution}
        </span>
      </div>
    </div>
  );
}
