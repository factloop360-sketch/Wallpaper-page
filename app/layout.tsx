import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: Allow importing global CSS without type declarations.
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

// Your Global SEO & Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: "Wallpaper Demons | Premium 8K Assets",
    template: "%s | Wallpaper Demons"
  },
  description: "The elite collection of 8K high-resolution wallpapers for phone and desktop.",
  keywords: ["8K Wallpapers", "Premium Wallpapers", "Dark Mode Wallpapers", "Desktop Backgrounds", "Wallpaper Demons"],
  openGraph: {
    title: "Wallpaper Demons",
    description: "Premium 8K Assets for the Elite",
    url: "https://wallpaperdemons.com", // Replace with your actual domain when you launch
    siteName: "Wallpaper Demons",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallpaper Demons",
    creator: "@wallpaperdemons",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* 
        This body tag is CRUCIAL. It applies your premium dark background (#09090b), 
        white text, and that custom red highlight color (selection:bg-red-500/30) 
        to every single page on your site automatically. 
      */}
      <body className={`${inter.className} bg-[#09090b] text-white antialiased selection:bg-red-500/30`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}