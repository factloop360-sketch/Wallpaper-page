"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { CATEGORIES } from "@/lib/wallpapers";

type DeviceRatio = "phone" | "pc" | "ultrawide" | "tv";
type AdminTab = "upload" | "manage";

// --- Interfaces ---
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

interface Wallpaper {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  premium: boolean;
  watermark: boolean;
  resolution: string;
  image_url: string;
  downloads: number;
  views: number;
  created_at: string;
}

// --- Icons ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export default function AdminCommandCenter() {
  const supabase = createClient();
  const router = useRouter();
  
  // --- Core State ---
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("upload");

  // --- Upload State ---
  const [formData, setFormData] = useState<WallpaperUpload>({
    title: "", slug: "", description: "", category: CATEGORIES[2] || "Abstract",
    tags: [], premium: false, watermark: true,
    resolution: "Detecting...", fileSize: "0MB", fileType: "image",
  });
  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeRatio, setActiveRatio] = useState<DeviceRatio>("phone");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Manage Assets State ---
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  
  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Wallpaper | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit State
  const [editingWallpaper, setEditingWallpaper] = useState<Wallpaper | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<WallpaperUpload>>({});
  const [editTagInput, setEditTagInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // --- 1. Auth Check ---
  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session === "authenticated") {
      setTimeout(() => setIsAuthorized(true), 500); 
    } else {
      router.push("/admin-login");
    }
  }, [router]);

  // --- 2. Fetch Assets ---
  useEffect(() => {
    if (activeTab === "manage" && wallpapers.length === 0) {
      fetchAssets();
    }
  }, [activeTab]);

  const fetchAssets = async () => {
    setIsLoadingAssets(true);
    // Fetching all fields to populate the edit form correctly
    const { data, error } = await supabase
      .from('wallpapers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setWallpapers(data as Wallpaper[]);
    setIsLoadingAssets(false);
  };

  // --- 3. Delete Logic ---
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const urlParts = deleteTarget.image_url.split('/public/wallpapers/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage.from('wallpapers').remove([filePath]);
        if (storageError) console.error("Storage cleanup failed:", storageError);
      }

      const { error: dbError } = await supabase.from('wallpapers').delete().eq('id', deleteTarget.id);
      if (dbError) throw dbError;

      setWallpapers(prev => prev.filter(wp => wp.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error: any) {
      alert(`Deletion Failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 4. Edit Logic ---
  const openEditModal = (wp: Wallpaper) => {
    setEditingWallpaper(wp);
    setEditFormData({
      title: wp.title,
      slug: wp.slug,
      description: wp.description || "",
      category: wp.category || CATEGORIES[2],
      tags: wp.tags || [],
      premium: wp.premium || false,
      watermark: wp.watermark || false,
    });
  };

  // Auto-update slug when title changes in Edit Modal
  useEffect(() => {
    if (editFormData.title) {
      const slug = editFormData.title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
      setEditFormData(prev => ({ ...prev, slug }));
    }
  }, [editFormData.title]);

  const handleEditTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editTagInput.trim()) {
      e.preventDefault();
      const newTag = editTagInput.trim();
      const currentTags = editFormData.tags || [];
      if (!currentTags.includes(newTag)) {
        setEditFormData({ ...editFormData, tags: [...currentTags, newTag] });
      }
      setEditTagInput("");
    }
  };

  const handleEditTagRemove = (tagToRemove: string) => {
    const currentTags = editFormData.tags || [];
    setEditFormData({ ...editFormData, tags: currentTags.filter(t => t !== tagToRemove) });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWallpaper) return;
    setIsUpdating(true);

    try {
      const { error } = await supabase.from('wallpapers').update({
        title: editFormData.title,
        slug: editFormData.slug,
        description: editFormData.description,
        category: editFormData.category,
        tags: editFormData.tags,
        premium: editFormData.premium,
        watermark: editFormData.watermark
      }).eq('id', editingWallpaper.id);

      if (error) throw error;

      // Optimistically update the UI grid
      setWallpapers(prev => prev.map(w => w.id === editingWallpaper.id ? { ...w, ...editFormData } as Wallpaper : w));
      setEditingWallpaper(null);
    } catch (error: any) {
      alert(`Update Failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };


  // --- 5. Upload Handlers ---
  useEffect(() => {
    const slug = formData.title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.title]);

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

    const img = new window.Image();
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

      const { error: dbError } = await supabase.from('wallpapers').insert({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        premium: formData.premium,
        watermark: formData.watermark,
        resolution: formData.resolution,
        image_url: publicUrl,
        likes: 0, downloads: 0, views: 0
      });

      if (dbError) throw dbError;
      alert("Asset live in the Abyss!");
      
      setFormData({ title: "", slug: "", description: "", category: CATEGORIES[2] || "Abstract", tags: [], premium: false, watermark: true, resolution: "Detecting...", fileSize: "0MB", fileType: "image" });
      setPreviewUrl(null);
      setSelectedFile(null);
      fetchAssets();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin-login");
  };

  // --- Loading State ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-red-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">Decrypting Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/5 bg-black/50 p-6 flex flex-col hidden md:flex shrink-0 z-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden relative">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover opacity-80 grayscale" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-red-500">Overlord</h2>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">System Core</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "upload" ? "bg-white/10 text-white border border-white/10 shadow-lg" : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"}`}
          >
            Upload Studio
          </button>
          <button 
            onClick={() => setActiveTab("manage")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "manage" ? "bg-white/10 text-white border border-white/10 shadow-lg" : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"}`}
          >
            Manage Assets
          </button>
        </nav>

        <Link href="/" className="mt-auto mb-4 flex justify-center w-full py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
          View Live Site
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-900/50 bg-red-950/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40 transition-colors"
        >
          Terminate Session
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative h-screen w-full">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto p-6 lg:p-12 relative z-10">
          
          <header className="mb-12">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              {activeTab === "upload" ? "Curator Studio" : "Asset Vault"}
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              {activeTab === "upload" ? "Inject high-fidelity souls into the database." : "Manage, edit, and purge existing database records."}
            </p>
          </header>

          {/* TAB 1: UPLOAD STUDIO */}
          {activeTab === "upload" && (
            <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700">
              <div className="lg:col-span-7 space-y-6">
                <div onClick={() => fileInputRef.current?.click()} className="relative aspect-video rounded-3xl border-2 border-dashed border-zinc-800 hover:border-red-500/50 cursor-pointer overflow-hidden flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm transition-all shadow-inner">
                  {previewUrl ? <img src={previewUrl} className="w-full h-full object-contain bg-black" alt="preview" /> : <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Select High-Res Asset</div>}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Title</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title..." className="w-full bg-zinc-900/80 rounded-2xl px-6 py-4 border border-white/5 font-medium outline-none focus:border-red-500/50 text-white placeholder:text-zinc-700 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">URL Slug</label>
                    <input disabled value={formData.slug} className="w-full bg-zinc-900/30 rounded-2xl px-6 py-4 border border-transparent text-zinc-600 font-mono text-xs outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Tell the story behind this wallpaper..." className="w-full bg-zinc-900/80 rounded-2xl px-6 py-4 border border-white/5 min-h-[100px] resize-none outline-none focus:border-red-500/50 text-white placeholder:text-zinc-700 transition-colors" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Hashtags (Enter to add)</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-zinc-900/80 rounded-2xl min-h-[60px] border border-white/5 focus-within:border-red-500/50 transition-all">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-red-950/50 text-red-400 border border-red-900/50 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                        #{tag} <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">×</button>
                      </span>
                    ))}
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Add tag..." className="bg-transparent border-none focus:ring-0 outline-none text-xs flex-1 min-w-[120px] text-white placeholder:text-zinc-700" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-zinc-900/80 rounded-2xl px-6 py-4 border border-white/5 appearance-none cursor-pointer text-xs font-black uppercase tracking-widest outline-none focus:border-red-500/50 text-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <button type="button" onClick={() => setFormData(p => ({...p, premium: !p.premium}))} className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all outline-none ${formData.premium ? "bg-red-950/20 border-red-900/50 text-red-500" : "bg-zinc-900/80 border-white/5 text-zinc-500"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.premium ? "bg-red-500 border-red-500 text-black" : "border-zinc-700"}`}>{formData.premium && <CheckIcon />}</div>
                  </button>

                  <button type="button" onClick={() => setFormData(p => ({...p, watermark: !p.watermark}))} className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all outline-none ${formData.watermark ? "bg-red-950/20 border-red-900/50 text-red-500" : "bg-zinc-900/80 border-white/5 text-zinc-500"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Watermark</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.watermark ? "bg-red-500 border-red-500 text-black" : "border-zinc-700"}`}>{formData.watermark && <CheckIcon />}</div>
                  </button>
                </div>

                <button disabled={!selectedFile || isUploading} className="w-full py-5 bg-white text-black rounded-3xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-200 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 outline-none mt-4">
                  {isUploading ? "Injecting into DB..." : "Publish Wallpaper"}
                </button>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="flex gap-2 mb-8 bg-zinc-900/50 border border-white/5 p-2 rounded-2xl w-fit backdrop-blur-sm">
                  {(["phone", "pc", "ultrawide", "tv"] as const).map(r => (
                    <button key={r} type="button" onClick={() => setActiveRatio(r)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all outline-none ${activeRatio === r ? "bg-zinc-800 shadow-md text-white border border-white/10" : "text-zinc-500 hover:text-white border border-transparent"}`}>{r}</button>
                  ))}
                </div>
                
                <div className={`transition-all duration-700 bg-black overflow-hidden relative border-[8px] border-zinc-900 shadow-2xl ${
                  activeRatio === "phone" ? "w-[280px] aspect-[9/20] rounded-[3rem]" : 
                  activeRatio === "pc" ? "w-full aspect-[16/9] rounded-xl" : 
                  activeRatio === "ultrawide" ? "w-full aspect-[21/9] rounded-2xl" : "w-full aspect-[16/9] rounded-xl"
                }`}>
                   <div className="absolute inset-0 flex items-center justify-center">
                     {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Sim" /> : <div className="text-zinc-800 font-black text-2xl uppercase italic">No Signal</div>}
                   </div>
                   <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
                      <div className="flex gap-2 mb-3">
                        {formData.premium && <span className="text-[8px] bg-red-600 text-white px-2 py-1 rounded-sm font-black uppercase tracking-widest">PRO</span>}
                        {formData.watermark && <span className="text-[8px] bg-zinc-800 text-white border border-white/20 px-2 py-1 rounded-sm font-black uppercase tracking-widest">WM</span>}
                      </div>
                      <h3 className="text-2xl font-black italic truncate uppercase leading-none">{formData.title || "UNTITLED ASSET"}</h3>
                      <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mt-2">{formData.category} • {formData.resolution}</p>
                   </div>
                </div>
                <p className="mt-8 text-[9px] text-zinc-600 uppercase font-black tracking-[0.4em]">Live Device Simulation</p>
              </div>
            </form>
          )}

          {/* TAB 2: MANAGE ASSETS */}
          {activeTab === "manage" && (
            <div className="animate-in fade-in duration-700">
              
              <div className="flex justify-between items-center mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  Total Indexed: <span className="text-white">{wallpapers.length}</span>
                </p>
                <button onClick={fetchAssets} className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                  Refresh Sync
                </button>
              </div>

              {isLoadingAssets ? (
                <div className="py-24 text-center">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-zinc-800 border-t-red-600 rounded-full mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Scanning Database...</p>
                </div>
              ) : wallpapers.length === 0 ? (
                <div className="py-24 text-center border border-dashed border-white/5 rounded-[2rem] bg-zinc-900/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No assets found in the Abyss.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wallpapers.map(wp => (
                    <div key={wp.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm group shadow-xl flex flex-col">
                      
                      <div className="relative aspect-video bg-black overflow-hidden border-b border-white/5 shrink-0">
                        <img src={`${wp.image_url}?width=400&quality=60`} alt={wp.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700 ease-out" />
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[8px] font-black uppercase tracking-widest text-zinc-300">
                          {wp.category}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter truncate mb-1" title={wp.title}>
                          {wp.title}
                        </h3>
                        <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-4">
                          {wp.resolution} • {wp.downloads} DLs
                        </p>
                        
                        <div className="flex gap-2 mt-auto">
                          <Link href={`/wallpaper/${wp.slug}`} target="_blank" className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-center text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center">
                            View
                          </Link>
                          <button 
                            onClick={() => openEditModal(wp)}
                            className="px-4 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-xl text-zinc-300 transition-colors flex items-center justify-center group/btn"
                            title="Edit Metadata"
                          >
                            <span className="group-hover/btn:scale-110 transition-transform"><EditIcon /></span>
                          </button>
                          <button 
                            onClick={() => setDeleteTarget(wp)}
                            className="px-4 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 rounded-xl text-red-500 transition-colors flex items-center justify-center group/btn"
                            title="Delete Asset"
                          >
                            <span className="group-hover/btn:scale-110 transition-transform"><TrashIcon /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* EDIT MODAL OVERLAY */}
      {editingWallpaper && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#09090b] border border-white/10 rounded-[2rem] p-6 sm:p-8 max-w-3xl w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                Modify <span className="text-red-500">Metadata</span>
              </h2>
              <button onClick={() => setEditingWallpaper(null)} className="text-zinc-500 hover:text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={submitEdit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Title</label>
                  <input required value={editFormData.title || ""} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full bg-zinc-900/80 rounded-2xl px-5 py-3.5 border border-white/5 font-medium outline-none focus:border-red-500/50 text-white transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">URL Slug</label>
                  <input disabled value={editFormData.slug || ""} className="w-full bg-zinc-900/30 rounded-2xl px-5 py-3.5 border border-transparent text-zinc-600 font-mono text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Description</label>
                <textarea value={editFormData.description || ""} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full bg-zinc-900/80 rounded-2xl px-5 py-3.5 border border-white/5 min-h-[100px] resize-none outline-none focus:border-red-500/50 text-white transition-colors" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Hashtags (Enter to add)</label>
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/80 rounded-2xl min-h-[56px] border border-white/5 focus-within:border-red-500/50 transition-all">
                  {(editFormData.tags || []).map(tag => (
                    <span key={tag} className="bg-red-950/50 text-red-400 border border-red-900/50 px-3 py-1 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                      #{tag} <button type="button" onClick={() => handleEditTagRemove(tag)} className="hover:text-white">×</button>
                    </span>
                  ))}
                  <input value={editTagInput} onChange={e => setEditTagInput(e.target.value)} onKeyDown={handleEditTagAdd} placeholder="Add tag..." className="bg-transparent border-none focus:ring-0 outline-none text-xs flex-1 min-w-[120px] text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select value={editFormData.category || ""} onChange={e => setEditFormData({...editFormData, category: e.target.value})} className="bg-zinc-900/80 rounded-2xl px-5 py-3.5 border border-white/5 appearance-none cursor-pointer text-xs font-black uppercase tracking-widest outline-none focus:border-red-500/50 text-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <button type="button" onClick={() => setEditFormData(p => ({...p, premium: !p.premium}))} className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all outline-none ${editFormData.premium ? "bg-red-950/20 border-red-900/50 text-red-500" : "bg-zinc-900/80 border-white/5 text-zinc-500"}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${editFormData.premium ? "bg-red-500 border-red-500 text-black" : "border-zinc-700"}`}>{editFormData.premium && <CheckIcon />}</div>
                </button>

                <button type="button" onClick={() => setEditFormData(p => ({...p, watermark: !p.watermark}))} className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all outline-none ${editFormData.watermark ? "bg-red-950/20 border-red-900/50 text-red-500" : "bg-zinc-900/80 border-white/5 text-zinc-500"}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">Watermark</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${editFormData.watermark ? "bg-red-500 border-red-500 text-black" : "border-zinc-700"}`}>{editFormData.watermark && <CheckIcon />}</div>
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setEditingWallpaper(null)} disabled={isUpdating} className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50">
                  Discard Changes
                </button>
                <button type="submit" disabled={isUpdating} className="flex-[2] py-4 bg-white hover:bg-zinc-200 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center disabled:opacity-50">
                  {isUpdating ? "Overwriting..." : "Commit Update"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL OVERLAY (DELETE) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#09090b] border border-red-900/50 rounded-[2rem] p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-in zoom-in-95 slide-in-from-bottom-4">
            <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-900/50 flex items-center justify-center mx-auto mb-6 text-red-500">
              <TrashIcon />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-center mb-2">Confirm Purge</h2>
            <p className="text-zinc-400 text-xs text-center mb-8 leading-relaxed">
              You are about to permanently delete <strong className="text-white">&quot;{deleteTarget.title}&quot;</strong>. This will erase the record from the database and physically remove the file from the storage bucket.
            </p>
            <div className="flex gap-3">
              <button disabled={isDeleting} onClick={() => setDeleteTarget(null)} className="flex-1 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50">Cancel</button>
              <button disabled={isDeleting} onClick={confirmDelete} className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center disabled:opacity-50">
                {isDeleting ? "Purging..." : "Obliterate"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}