import {type MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wallpaperdemons.com";

  // Fetch all your active wallpaper slugs from the database
  const { data: wallpapers } = await supabase
    .from("wallpapers")
    .select("slug, updated_at");

  // Create the dynamic URLs for every individual wallpaper
  const wallpaperUrls = (wallpapers || []).map((wp) => ({
    url: `${baseUrl}/wallpaper/${wp.slug}`,
    lastModified: wp.updated_at || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Define your static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    // Add other static pages here if you make them (e.g., /about, /contact)
  ];

  return [...staticRoutes, ...wallpaperUrls];
}