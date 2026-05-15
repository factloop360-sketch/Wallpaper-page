import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Wallpaper Demons | Premium 8K Assets",
    template: "%s | Wallpaper Demons"
  },
  description: "The elite collection of 8K high-resolution wallpapers for phone and desktop.",
  keywords: ["8K Wallpapers", "Premium Wallpapers", "Dark Mode Wallpapers", "Desktop Backgrounds"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#09090b] text-white antialiased selection:bg-red-500/30`}>
        {/* Wrap the app in your AuthProvider to bring the Login/Logout buttons back to life */}
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}