"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { CATEGORIES } from "@/lib/wallpapers";

type DeviceRatio = "phone" | "pc" | "ultrawide" | "tv";

interface WallpaperUpload {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  premium: boolean;
  watermark: boolean;
  resolution: string;
  fileSize: string;
  fileType: "image" | "video";
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export default function AdminUploadPage() {
  const supabase = createClient();
  
  const [formData, setFormData] = useState<WallpaperUpload>({
    title: "", slug: "", description: "", category: CATEGORIES[2],
    tags: [], premium: false, watermark: true,
    resolution: "Detecting...", fileSize: "0MB", fileType: "image",
  });

  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeRatio, setActiveRatio] = useState<DeviceRatio>("phone");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const slug = formData.title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.title]);

  // --- Tag Logic ---
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    const img = new Image();
    img.onload = () => {
      setFormData(p => ({ ...p, fileSize: sizeFormatted, resolution: `${img.naturalWidth}x${img.naturalHeight}` }));
      setPreviewUrl(url);
    };
    img.src = url;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${formData.slug}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('wallpapers').upload(filePath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('wallpapers').getPublicUrl(filePath);

      // --- Database Insert (Fixed mapping) ---
      const { error: dbError } = await supabase.from('wallpapers').insert({
        title: formData.title,
        slug: formData.slug,
        description: formData.description, // FIXED
        category: formData.category,
        tags: formData.tags, // FIXED
        premium: formData.premium,
        watermark: formData.watermark,
        resolution: formData.resolution, // FIXED
        image_url: publicUrl,
        likes: 0, downloads: 0, views: 0
      });

      if (dbError) throw dbError;
      alert("Wallpaper Live!");
      
      // Reset
      setFormData({ title: "", slug: "", description: "", category: CATEGORIES[2], tags: [], premium: false, watermark: true, resolution: "Detecting...", fileSize: "0MB", fileType: "image" });
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <nav className="h-16 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
        <h1 className="font-black italic text-xl uppercase tracking-tighter text-indigo-500">Curator Studio</h1>
        <Link href="/" className="text-xs font-bold opacity-50 hover:opacity-100">Exit</Link>
      </nav>

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-6 lg:p-12">
        <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-6">
            <div onClick={() => fileInputRef.current?.click()} className="relative aspect-video rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-indigo-500 cursor-pointer overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/40 transition-all shadow-inner">
              {previewUrl ? <img src={previewUrl} className="w-full h-full object-contain bg-black" /> : <div className="text-zinc-400 font-bold">Select High-Res Asset</div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title..." className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-6 py-4 border-none font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">URL Slug</label>
                <input disabled value={formData.slug} className="w-full bg-zinc-200/50 dark:bg-zinc-800/30 rounded-2xl px-6 py-4 border-none text-zinc-500 font-mono text-xs" />
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Tell the story behind this wallpaper..." className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-6 py-4 border-none min-h-[100px] resize-none" />
            </div>

            {/* Hashtag Section */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Hashtags (Enter to add)</label>
              <div className="flex flex-wrap gap-2 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl min-h-[60px] border border-transparent focus-within:border-indigo-500/30 transition-all">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                    #{tag} <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-300">×</button>
                  </span>
                ))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Add tag..." className="bg-transparent border-none focus:ring-0 text-sm flex-1 min-w-[120px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-6 py-4 border-none appearance-none cursor-pointer font-medium">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button type="button" onClick={() => setFormData(p => ({...p, premium: !p.premium}))} className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${formData.premium ? "bg-indigo-500/10 border-indigo-500 text-indigo-500" : "bg-zinc-100 dark:bg-zinc-900 border-transparent text-zinc-500"}`}>
                <span className="text-xs font-bold uppercase tracking-widest">Premium</span>
                <div className={`w-4 h-4 rounded border-2 ${formData.premium ? "bg-indigo-500 border-indigo-500" : "border-zinc-400"}`}>{formData.premium && <CheckIcon />}</div>
              </button>

              <button type="button" onClick={() => setFormData(p => ({...p, watermark: !p.watermark}))} className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${formData.watermark ? "bg-indigo-500/10 border-indigo-500 text-indigo-500" : "bg-zinc-100 dark:bg-zinc-900 border-transparent text-zinc-500"}`}>
                <span className="text-xs font-bold uppercase tracking-widest">Watermark</span>
                <div className={`w-4 h-4 rounded border-2 ${formData.watermark ? "bg-indigo-500 border-indigo-500" : "border-zinc-400"}`}>{formData.watermark && <CheckIcon />}</div>
              </button>
            </div>

            <button disabled={!selectedFile || isUploading} className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30">
              {isUploading ? "Uploading to Supabase..." : "Publish Wallpaper"}
            </button>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="flex gap-2 mb-8 bg-zinc-200 dark:bg-zinc-900 p-2 rounded-2xl w-fit">
              {(["phone", "pc", "ultrawide", "tv"] as const).map(r => (
                <button key={r} type="button" onClick={() => setActiveRatio(r)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRatio === r ? "bg-white dark:bg-zinc-800 shadow-md" : "opacity-40 hover:opacity-60"}`}>{r}</button>
              ))}
            </div>
            
            <div className={`transition-all duration-700 bg-black overflow-hidden relative border-[10px] border-zinc-200 dark:border-zinc-800 shadow-2xl ${
              activeRatio === "phone" ? "w-[280px] aspect-[9/20] rounded-[3.5rem]" : 
              activeRatio === "pc" ? "w-full aspect-[16/9] rounded-xl" : 
              activeRatio === "ultrawide" ? "w-full aspect-[21/9] rounded-2xl" : 
              "w-full aspect-[16/9] rounded-xl"
            }`}>
               <div className="absolute inset-0 flex items-center justify-center">
                 {previewUrl && <img src={previewUrl} className="w-full h-full object-contain" />}
               </div>
               <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent text-white">
                  <div className="flex gap-2 mb-2">
                    {formData.premium && <span className="text-[8px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black uppercase">PRO</span>}
                    {formData.watermark && <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black uppercase">WM</span>}
                  </div>
                  <h3 className="text-xl font-black italic truncate uppercase leading-none">{formData.title || "UNTITLED"}</h3>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{formData.category} • {formData.resolution}</p>
               </div>
            </div>
            <p className="mt-8 text-[10px] text-zinc-500 uppercase font-black tracking-[0.4em] opacity-40">Live Device Simulation</p>
          </div>
        </form>
      </main>
    </div>
  );
}