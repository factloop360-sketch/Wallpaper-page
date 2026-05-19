import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HydratedGallery from "@/components/HydratedGallery";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category || "all";
  const sort = params.sort || "random";
  const search = params.q || "";

  // Unique layout dynamic key forces Suspense reload when search parameters shift
  const stateKey = `${category}-${sort}-${search}`;

  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 pb-24 pt-[140px] selection:bg-red-500/30 relative overflow-hidden">
      
      {/* Navbar is self-contained explicitly on the Home view */}
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-600/5 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="max-w-[2560px] mx-auto relative z-10">
        <Suspense key={stateKey} fallback={<GridSkeleton />}>
          <DynamicContent category={category} sort={sort} search={search} />
        </Suspense>
      </div>
    </main>
  );
}

async function DynamicContent({ category, sort, search }: { category: string, sort: string, search: string }) {
  // We forward parameters straight into our client pipeline handler
  return <HydratedGallery category={category} sort={sort} search={search} />;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse">
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`w-full bg-zinc-900/30 rounded-[2rem] border border-white/5 ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}></div>
      ))}
    </div>
  );
}