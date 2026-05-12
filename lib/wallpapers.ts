// lib/wallpapers.ts

export interface Wallpaper {
  slug: string;
  src: string;
  title: string;
  author: string;
  likes: string;
  resolution: string;
  category: string;
  tags: string[]; // Added tags for the detail page
  isTrending?: boolean;
}

export const CATEGORIES = [
  "For You", "Trending", "Abstract", "Nature", "Minimalist", 
  "Architecture", "Space", "Automotive", "Cyberpunk", "Anime", "Dark", "Animals"
];

export const MOCK_WALLPAPERS: Wallpaper[] = [
  { slug: "liquid-abstract", category: "Abstract", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", title: "Liquid Abstract", author: "Milad Fakurian", likes: "12.4k", resolution: "4K (3840x2160)", tags: ["Abstract", "Liquid", "Dark", "Gradient", "3D"], isTrending: true },
  { slug: "canyon-river", category: "Nature", src: "https://images.unsplash.com/photo-1506744626753-eda8151a74a4?q=80&w=2564&auto=format&fit=crop", title: "Canyon River", author: "Robo O.", likes: "8.1k", resolution: "1440p (2560x1440)", tags: ["Nature", "Landscape", "River", "Mountains", "Earth"] },
  { slug: "deep-space", category: "Space", src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2564&auto=format&fit=crop", title: "Deep Space", author: "NASA", likes: "24.2k", resolution: "8K (7680x4320)", tags: ["Space", "Stars", "Galaxy", "Dark", "Astronomy"], isTrending: true },
  { slug: "code-minimal", category: "Minimalist", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2564&auto=format&fit=crop", title: "Code Minimal", author: "Chris Ried", likes: "5.6k", resolution: "4K", tags: ["Code", "Tech", "Minimal", "Dark", "Programming"] },
  { slug: "neon-nights", category: "Cyberpunk", src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop", title: "Neon Nights", author: "Sean Foley", likes: "18.9k", resolution: "4K (3840x2160)", tags: ["Cyberpunk", "Neon", "City", "Night", "Purple"], isTrending: true },
  { slug: "arctic-fox", category: "Animals", src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=2564&auto=format&fit=crop", title: "Arctic Fox", author: "Jonatan Pie", likes: "9.3k", resolution: "1440p", tags: ["Animals", "Wildlife", "Snow", "Winter", "Nature"] },
  { slug: "city-geometry", category: "Architecture", src: "https://images.unsplash.com/photo-1502657872623-08d5b4739b14?q=80&w=2564&auto=format&fit=crop", title: "City Geometry", author: "Mikhail V.", likes: "4.2k", resolution: "1080p", tags: ["Architecture", "City", "Buildings", "Geometry", "Urban"] },
  { slug: "dark-texture", category: "Dark", src: "https://images.unsplash.com/photo-1528642474498-1af0c17fac8c?q=80&w=2564&auto=format&fit=crop", title: "Dark Texture", author: "Paean", likes: "11.1k", resolution: "4K", tags: ["Dark", "Texture", "Abstract", "Black", "Minimal"] },
  { slug: "abstract-shapes", category: "Abstract", src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop", title: "Abstract Shapes", author: "Mo Eid", likes: "7.8k", resolution: "8K", tags: ["Abstract", "Shapes", "Colorful", "3D", "Render"], isTrending: true },
  { slug: "mountain-peak", category: "Nature", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2564&auto=format&fit=crop", title: "Mountain Peak", author: "Kalen Emsley", likes: "15.3k", resolution: "4K", tags: ["Nature", "Mountains", "Peak", "Landscape", "Outdoors"] },
  { slug: "purple-gradient", category: "Abstract", src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2564&auto=format&fit=crop", title: "Purple Gradient", author: "Milad Fakurian", likes: "6.4k", resolution: "1440p", tags: ["Abstract", "Purple", "Gradient", "Liquid", "Background"] },
  { slug: "minimalist-arch", category: "Architecture", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2564&auto=format&fit=crop", title: "Minimalist Arch", author: "Simone H.", likes: "3.9k", resolution: "1080p", tags: ["Architecture", "Minimalist", "Arch", "White", "Clean"] },
];