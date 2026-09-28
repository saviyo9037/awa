"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Sparkles,
  Copy,
  Check,
  ArrowUpRight,
  Wand2,
  X,
  Layout,
  Cpu,
  ShoppingBag,
  Palette,
  Smartphone,
  BarChart3,
  Layers,
  FolderTree,
  Lock,
  Crown,
} from "lucide-react";

interface CategoryPill {
  id: string;
  label: string;
  slug?: string;
  rawId?: string;
  desc?: string;
  icon?: string;
}

const CATEGORY_META: Record<string, { label: string; desc: string; icon: any }> = {};

function getCategoryIconComponent(catIdOrIcon?: string) {
  const str = (catIdOrIcon || "").toLowerCase().trim();
  if (/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(str)) {
    return <span className="text-2xl">{catIdOrIcon}</span>;
  }
  if (str.includes("image") || str.includes("palette") || str.includes("art")) {
    return <Palette className="w-5 h-5 text-indigo-500" />;
  }
  if (str.includes("video") || str.includes("film") || str.includes("motion") || str.includes("wand")) {
    return <Wand2 className="w-5 h-5 text-purple-500" />;
  }
  if (str.includes("web") || str.includes("layout") || str.includes("site") || str.includes("landing")) {
    return <Layout className="w-5 h-5 text-cyan-500" />;
  }
  if (str.includes("slide") || str.includes("presentation") || str.includes("deck") || str.includes("layers")) {
    return <Layers className="w-5 h-5 text-amber-500" />;
  }
  return <Sparkles className="w-5 h-5 text-indigo-500" />;
}

export default function HomePage() {
  const router = useRouter();
  const { user, isLoggedIn, isPro, isAdmin } = useAuth();
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [categoryList, setCategoryList] = useState<CategoryPill[]>([
    { id: "all", label: "All Blueprints" },
    { id: "image", label: "Image", slug: "image", desc: "Portraits, 3D renders, and digital art prompts", icon: "🎨" },
    { id: "video", label: "Video", slug: "video", desc: "Cinematic motion vectors and AI video generators", icon: "🎬" },
    { id: "website", label: "Website", slug: "website", desc: "Landing pages, UI kits, and web layouts", icon: "💻" },
    { id: "slides", label: "Slides", slug: "slides", desc: "Keynotes, pitch decks, and presentations", icon: "📊" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, any[]>>({});
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Read URL search params on mount (e.g. /?category=cyber-tech)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setActiveCategory(cat);
        setTimeout(() => {
          document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  // Fetch dynamic categories from DB to keep Admin & User catalog unified
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const remoteCats: CategoryPill[] = json.data.map((c: any) => ({
            id: c.slug || c.id,
            label: c.name || c.label,
            slug: c.slug,
            rawId: c.id,
            desc: c.description,
            icon: c.icon,
          }));
          setCategoryList([
            { id: "all", label: "All Blueprints" },
            ...remoteCats,
          ]);
        }
      })
      .catch((err) => console.log("Using cached categories:", err));

    fetch("/api/categories/subcategories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSubcategoriesMap(json.data);
        }
      })
      .catch((err) => console.log("Subcategories fetch error:", err));
  }, []);

  // Fetch live templates from DB on mount
  useEffect(() => {
    setIsLoadingTemplates(true);
    fetch("/api/templates")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setTemplateList(json.data);
        }
      })
      .catch((err) => console.log("Template fetch error:", err))
      .finally(() => setIsLoadingTemplates(false));
  }, []);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isTemplateInCategory = (tpl: any, catId: string, catSlug?: string, catRawId?: string) => {
    if (catId === "all") return true;
    if (tpl.category === catId || tpl.category_id === catId) return true;
    if (catSlug && (tpl.category === catSlug || tpl.category_id === catSlug)) return true;
    if (catRawId && (tpl.category === catRawId || tpl.category_id === catRawId)) return true;

    // Cross-compatibility aliases
    if ((catId === "landing-pages" || catSlug === "landing-pages" || catRawId === "cat-1") && 
        (tpl.category === "website" || tpl.category_id === "cat-1" || tpl.category === "landing-pages")) return true;
    if ((catId === "cyber-tech" || catSlug === "cyber-tech" || catRawId === "cat-2") && 
        (tpl.category === "image" || tpl.category_id === "cat-2" || tpl.category === "cyber-tech")) return true;
    if ((catId === "ecommerce" || catSlug === "ecommerce" || catRawId === "cat-3") && 
        (tpl.category === "ecommerce" || tpl.category_id === "cat-3")) return true;
    if ((catId === "portfolios" || catSlug === "portfolios" || catRawId === "cat-4") && 
        (tpl.category === "poster" || tpl.category_id === "cat-4" || tpl.category === "portfolios")) return true;
    if ((catId === "mobile-apps" || catSlug === "mobile-apps" || catRawId === "cat-5") && 
        (tpl.category === "mobile" || tpl.category_id === "cat-5" || tpl.category === "mobile-apps")) return true;
    if ((catId === "saas-dashboards" || catSlug === "saas-dashboards" || catRawId === "cat-6") && 
        (tpl.category === "presentation" || tpl.category_id === "cat-6" || tpl.category === "saas-dashboards")) return true;

    return false;
  };

  const handleCopyPrompt = (e: React.MouseEvent, tpl: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if blueprint is PRO and user doesn't have active subscription / admin privilege
    if (tpl.isPro && !isPro && !isAdmin) {
      if (!isLoggedIn) {
        setToastMessage(`🔒 "${tpl.title}" is a PRO blueprint. Sign in or register to unlock.`);
        setTimeout(() => router.push(`/login?redirect=${encodeURIComponent("/checkout?plan=yearly")}`), 1200);
      } else {
        setToastMessage(`🔒 "${tpl.title}" requires AWA PRO. Redirecting to checkout...`);
        setTimeout(() => router.push("/checkout?plan=yearly"), 1200);
      }
      return;
    }

    navigator.clipboard.writeText(tpl.prompt);
    setCopiedId(tpl.id);
    setToastMessage(`Copied prompt: "${tpl.title}"`);
    
    // Call backend API to track copy in DB
    fetch(`/api/templates/${tpl.id}/copy`, { method: "POST" }).catch(() => {});

    setTimeout(() => setCopiedId(null), 2000);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/prompts/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrompt: "A cinematic, ultra-modern website landing page, dark obsidian background #09090b, liquid glassmorphic cards, luminous cyan lighting accents, 8k resolution, minimalist editorial Swiss typography",
          tweak: aiQuestion.trim(),
          aspectRatio: "16:9",
          stylize: "250",
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.customizedPrompt) {
        setAiAnswer(`Generated Blueprint:\n\n${data.data.customizedPrompt}`);
      } else {
        setAiAnswer(`Suggested Blueprint for "${aiQuestion}":\n\nA cinematic, ultra-modern creative site for ${aiQuestion}, dark obsidian background #09090b, liquid glassmorphic cards, luminous cyan lighting accents, 8k resolution, minimalist editorial Swiss typography --ar 16:9 --v 6.0`);
      }
    } catch {
      setAiAnswer(`Suggested Blueprint for "${aiQuestion}":\n\nA cinematic, ultra-modern creative site for ${aiQuestion}, dark obsidian background #09090b, liquid glassmorphic cards, luminous cyan lighting accents, 8k resolution, minimalist editorial Swiss typography --ar 16:9 --v 6.0`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter templates
  const filteredTemplates = templateList.filter(tpl => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tpl.title.toLowerCase().includes(q) ||
      tpl.desc.toLowerCase().includes(q) ||
      (Array.isArray(tpl.tags) && tpl.tags.some((t: string) => t.toLowerCase().includes(q)));

    const currentCat = categoryList.find(c => c.id === activeCategory);
    const matchesCategory = isTemplateInCategory(
      tpl,
      activeCategory,
      currentCat?.slug,
      currentCat?.rawId
    );

    const matchesSubcategory =
      activeSubcategory === "all" ||
      tpl.subcategory?.toLowerCase() === activeSubcategory.toLowerCase() ||
      (Array.isArray(tpl.tags) &&
        tpl.tags.some(
          (t: string) =>
            t.toLowerCase() === activeSubcategory.toLowerCase() ||
            t.toLowerCase() === `sub:${activeSubcategory.toLowerCase()}`
        ));

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Showcase templates (Website & Cinematic focus matching reference)
  const immersiveShowcase = templateList.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative pb-28">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[120] bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 dark:border-slate-200 animate-bounce">
          <Check className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          HERO SECTION: PANORAMIC CAPSULE CONTAINER (EXACT GETLAYERS LAYOUT)
          ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-5 sm:pt-7">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-slate-300/80 dark:border-white/10 bg-[#0a0a0f] text-white min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20 shadow-2xl">
          
          {/* Background Cinematic Atmosphere & Video */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60 dark:opacity-70 contrast-125 brightness-110 saturate-125 scale-105"
            >
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video>
            {/* Atmospheric Smoke & Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
          </div>

          {/* Centered Capsule Content */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 dark:bg-black/60 border border-white/20 backdrop-blur-xl text-xs font-medium text-slate-200 mb-6 shadow-lg">
              <span>Trusted by 1,000+ creators</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-4 leading-[1.15] font-sans">
              Cinematic AI sites, made easy
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mb-8 leading-relaxed font-light">
              Copy a prompt, paste it into your AI, and launch a site that doesn&apos;t look AI-made.
            </p>

            {/* Primary Pill Button */}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 hover:bg-black text-white border border-white/30 hover:border-white/60 shadow-xl backdrop-blur-xl text-sm font-semibold transition-all duration-300 group hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Get unlimited access</span>
              <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: "IMMERSIVE WEBSITE PROMPTS" (WIDE SHOWCASE CARDS)
          ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-8 pt-16 sm:pt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 mb-3">
              New templates arrive weekly
            </div>
            <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-slate-900 dark:text-white font-sans">
              Immersive website prompts
            </h2>
          </div>
          
          <button
            onClick={() => {
              setActiveCategory("website");
              const el = document.getElementById("catalog-grid");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            <span>All Templates</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* 4 Wide Panoramic Showcase Cards (GetLayers Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {isLoadingTemplates ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-[300px] rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 animate-pulse" />
            ))
          ) : (
            immersiveShowcase.map((tpl) => (
            <Link
              href={`/template/${tpl.id}`}
              key={tpl.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c12] shadow-sm hover:shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Preview Container */}
              <div className="relative w-full h-[240px] overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.img}
                  alt={tpl.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlaid Headline inside Card */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
                      {tpl.tool}
                    </span>
                    {tpl.isPro && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500 text-white shadow-sm">
                        PRO
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors drop-shadow-md">
                      {tpl.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 flex items-center justify-between bg-white dark:bg-[#0c0c12] border-t border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 flex-1 pr-2">
                  {tpl.desc}
                </p>
                <button
                  onClick={(e) => handleCopyPrompt(e, tpl)}
                  title="Copy Prompt"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copiedId === tpl.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </Link>
          ))
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: COMPLETE PROMPT LIBRARY & SEARCH CONTROLS
          ========================================================================= */}
      <section id="catalog-grid" className="max-w-[1500px] mx-auto px-4 sm:px-8 pt-20">
        
        {/* Controls Bar: Search & Category Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-white/10">
          
          {/* Category Tabs with dynamic live counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categoryList.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? templateList.length
                  : templateList.filter((tpl) => isTemplateInCategory(tpl, cat.id, cat.slug, cat.rawId)).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubcategory("all");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.1]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                        : "bg-slate-200/80 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Omni Search Input */}
          <div className="relative w-full lg:w-[320px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="omni-search-input"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts (press '/' to focus)..."
              className="w-full pl-10 pr-10 py-2 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-slate-400 dark:focus:border-white/30 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Real-World Category Editorial Header Banner with Integrated Subcategories */}
        {activeCategory !== "all" && (() => {
          const currentCatObj = categoryList.find((c) => c.id === activeCategory);
          if (!currentCatObj) return null;
          const relevantSubs =
            subcategoriesMap[activeCategory] ||
            (currentCatObj?.slug ? subcategoriesMap[currentCatObj.slug] : []) ||
            (currentCatObj?.rawId ? subcategoriesMap[currentCatObj.rawId] : []) ||
            [];

          return (
            <div className="mt-6 mb-2 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-xl animate-in fade-in duration-300 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20">
                    {getCategoryIconComponent(currentCatObj.icon || currentCatObj.slug || currentCatObj.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {currentCatObj.label}
                      </h2>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                        {filteredTemplates.length} Blueprints
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                      {currentCatObj.desc || "Discover hand-curated, production-grade prompt blueprints."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveSubcategory("all");
                  }}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-white/10 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset to All</span>
                </button>
              </div>

              {/* Subcategories Selector Bar Inside the Category Banner Card */}
              {relevantSubs.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 pr-1">
                    Subcategories:
                  </span>
                  <button
                    onClick={() => setActiveSubcategory("all")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeSubcategory === "all"
                        ? "bg-indigo-600 text-white font-semibold shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10"
                    }`}
                  >
                    All {currentCatObj.label}
                  </button>
                  {relevantSubs.map((sub: any) => {
                    const isSubActive = activeSubcategory.toLowerCase() === sub.name.toLowerCase();
                    return (
                      <button
                        key={sub.id || sub.slug || sub.name}
                        onClick={() => setActiveSubcategory(sub.name)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                          isSubActive
                            ? "bg-indigo-600 text-white font-semibold shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10"
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* Results Count */}
        <div className="flex items-center justify-between py-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filteredTemplates.length} verified prompt blueprints</span>
          {activeCategory !== "all" && (
            <button
              onClick={() => setActiveCategory("all")}
              className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {isLoadingTemplates ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-[280px] rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 animate-pulse" />
            ))
          ) : filteredTemplates.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold">No blueprints found</p>
              <p className="text-xs text-slate-400 mt-1">Try selecting another category or refining your search query.</p>
            </div>
          ) : (
            filteredTemplates.map((tpl) => (
              <Link
                href={`/template/${tpl.id}`}
                key={tpl.id}
              className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c12] shadow-sm hover:shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-[200px] overflow-hidden bg-slate-100 dark:bg-black/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.img}
                  alt={tpl.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  {tpl.subcategory && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-600/90 text-white backdrop-blur-md">
                      {tpl.subcategory}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
                    {tpl.tool}
                  </span>
                  {tpl.isPro && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500 text-white">
                      PRO
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tpl.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                    Inspect Blueprint →
                  </span>
                  <button
                    onClick={(e) => handleCopyPrompt(e, tpl)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      tpl.isPro && !isPro
                        ? "text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                    title={tpl.isPro && !isPro ? "PRO Blueprint — Unlock with AWA Pro" : "Copy Prompt"}
                  >
                    {tpl.isPro && !isPro ? (
                      <Lock className="w-3.5 h-3.5 text-pink-500" />
                    ) : copiedId === tpl.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))
          )}
        </div>
      </section>

      {/* =========================================================================
          FLOATING ACTION PILL: "✨ ASK AI FOR GUIDES" (EXACT GETLAYERS FEATURE)
          ========================================================================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/90 hover:bg-black text-white border border-white/20 shadow-2xl backdrop-blur-xl text-xs font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Ask AI for guides</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAiModalOpen(false);
                setAiAnswer(null);
                setAiQuestion("");
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Wand2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold">Ask AI for Prompt Guides</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Type what you want to create (e.g. &quot;SaaS architecture hero&quot; or &quot;Cyberpunk motorcycle portrait&quot;).
            </p>

            <form onSubmit={handleAskAi} className="space-y-4">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="E.g. A sleek portfolio website for a visual director..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 dark:focus:border-cyan-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs transition-all hover:opacity-90 cursor-pointer"
              >
                {isGenerating ? "Generating Blueprint..." : "Generate AI Prompt"}
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-5 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {aiAnswer}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
