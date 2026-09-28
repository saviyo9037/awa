"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  Copy,
  Check,
  Zap,
  User,
  ArrowRight,
  ShieldCheck,
  Crown,
  Bookmark,
  Sliders,
  ExternalLink,
  Settings,
  CreditCard,
  Key,
  Search,
  Terminal,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Share2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, isPro, isAdmin, logout } = useAuth();
  
  // Tabs: 'saved' | 'subscription' | 'studio' | 'settings'
  const [activeTab, setActiveTab] = useState<"saved" | "subscription" | "studio" | "settings">("saved");
  
  // Data states
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Prompt Playground in Studio Tab
  const [testPrompt, setTestPrompt] = useState("Cinematic 3D glass isometric dashboard, glowing neon highlights, 8K resolution");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingPrompts(true);
    fetch("/api/templates?limit=12")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSavedPrompts(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingPrompts(false));
  }, []);

  const handleCopyPrompt = (e: React.MouseEvent, promptText: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setToastMessage("Blueprint prompt copied to clipboard! 📋");
    setTimeout(() => setCopiedId(null), 2000);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("awa_live_sk_948201948201948201948");
    setApiKeyCopied(true);
    setToastMessage("API Token copied! Keep this private. 🔒");
    setTimeout(() => setApiKeyCopied(false), 2000);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  const handleRunPlayground = () => {
    setIsGeneratingTest(true);
    setTimeout(() => {
      setGeneratedOutput(`${testPrompt} --ar ${aspectRatio} --v 6.1 --style raw --s 250 --quality 2`);
      setIsGeneratingTest(false);
      setToastMessage("Blueprint synthesized successfully! ✨");
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  // Filter saved blueprints
  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return savedPrompts;
    const q = searchQuery.toLowerCase();
    return savedPrompts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tool?.toLowerCase().includes(q) ||
        p.prompt?.toLowerCase().includes(q)
    );
  }, [savedPrompts, searchQuery]);

  if (!isLoading && !isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-white/10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Sign in to manage your creator profile, saved blueprints, and AI credits.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login?redirect=/profile"
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split("@")[0] || "Creator";
  const displayEmail = user?.email || "creator@awa.ai";
  const displayPlan = isPro ? (user?.subscriptionPlan === "lifetime" ? "Lifetime PRO" : "Yearly PRO") : "Starter Plan";
  const displayCredits = user?.credits ?? (isPro ? 10 : 5);
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-[120] bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 dark:border-slate-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Panoramic Hero Profile Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] bg-white/70 dark:bg-[#090b14]/70 backdrop-blur-xl">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Identity Avatar & Headline */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20">
                  <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#0b0c16] flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-blue-600 dark:text-cyan-300 font-sans">
                    {initial}
                  </div>
                </div>
                {isPro && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#07090e]">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                    {displayName}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase font-mono ${
                    isPro 
                      ? "bg-gradient-to-r from-pink-500/15 to-purple-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  }`}>
                    {isPro ? <Crown className="w-3 h-3 text-pink-500" /> : <Sparkles className="w-3 h-3 text-slate-400" />}
                    <span>{displayPlan}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Creator</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* Top Action Pills */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/workflow"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Launch Studio</span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm transition-all"
              >
                <span>{isPro ? "Manage Plan" : "Upgrade Plan"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-white dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 pt-8">
        
        {/* =====================================================================
            1. FOUR MODERN METRIC STAT CARDS
            ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: AI Generation Credits */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Credits Available
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
                  {displayCredits}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 10 Fast Credits</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  style={{ width: `${Math.min(100, (displayCredits / 10) * 100)}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Refills monthly</span>
              <Link href="/pricing" className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline">
                Top Up +
              </Link>
            </div>
          </div>

          {/* Card 2: Bookmarked Blueprints */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Bookmarked
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
                  {savedPrompts.length}
                </span>
                <span className="text-xs font-mono text-slate-400">Prompt Blueprints</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Saved for quick production reuse
              </p>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>1-Click Copy Enabled</span>
            </div>
          </div>

          {/* Card 3: Subscription Status */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Membership Tier
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans truncate">
                  {user?.subscriptionPlan === "lifetime"
                    ? "Lifetime PRO"
                    : user?.subscriptionPlan === "yearly"
                    ? "Yearly PRO"
                    : isPro
                    ? "PRO Tier"
                    : "Free Tier"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {isPro ? "Unlimited full prompts & commercial rights" : "Limited prompt parameters"}
              </p>
            </div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400">
              <Link href="/pricing" className="hover:underline flex items-center gap-1">
                <span>{isPro ? "Active Benefits →" : "Unlock Pro at ₹199 →"}</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Studio Pipeline Access */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Workflow Nodes
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
                  v6.1
                </span>
                <span className="text-xs font-mono text-slate-400">Engine Connected</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Midjourney, Runway, Claude &amp; FLUX
              </p>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Modal Ready</span>
            </div>
          </div>

        </div>

        {/* =====================================================================
            2. INTERACTIVE SUB-NAVIGATION TABS
            ===================================================================== */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "saved"
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Blueprints</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === "saved" ? "bg-white/20 dark:bg-black/20" : "bg-slate-200 dark:bg-white/10"
            }`}>
              {savedPrompts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "subscription"
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Plan &amp; Billing</span>
            {isPro && (
              <span className="w-2 h-2 rounded-full bg-pink-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "studio"
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Studio Playground</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "settings"
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>API &amp; Account</span>
          </button>
        </div>

        {/* =====================================================================
            TAB 1: SAVED BLUEPRINTS GALLERY
            ===================================================================== */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            
            {/* Gallery Toolbar: Search + Quick Category Counts */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter your saved prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 text-xs sm:text-sm outline-none focus:border-blue-500 shadow-sm transition-all"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 dark:text-slate-400">
                <span>Showing {filteredPrompts.length} of {savedPrompts.length} prompts</span>
              </div>
            </div>

            {/* Grid of Cards */}
            {isLoadingPrompts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : filteredPrompts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm">
                <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-[1.5]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No blueprints match your filter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search keywords or explore the full catalog to save new AI blueprints.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md mt-4"
                >
                  <span>Explore Blueprints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group relative flex flex-col rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-black/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tpl.img}
                        alt={tpl.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black/65 text-white backdrop-blur-md border border-white/15">
                          {tpl.tool || "Midjourney"}
                        </span>
                        {tpl.isPro && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            <span>PRO</span>
                          </span>
                        )}
                      </div>

                      {/* Floating Quick Action Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Link
                          href={`/template/${tpl.id}`}
                          className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5"
                        >
                          <span>Open Detail</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 capitalize">
                            {tpl.category}
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                            ★ Bookmarked
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                          {tpl.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {tpl.desc || tpl.prompt}
                        </p>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => handleCopyPrompt(e, tpl.prompt, tpl.id)}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            copiedId === tpl.id
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {copiedId === tpl.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/template/${tpl.id}`}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                          title="View Blueprint & Guidance"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* =====================================================================
            TAB 2: SUBSCRIPTION & PLAN BREAKDOWN
            ===================================================================== */}
        {activeTab === "subscription" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Active Membership Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Current Plan
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {user?.subscriptionPlan === "lifetime"
                        ? "AWA Pro Lifetime Founder"
                        : user?.subscriptionPlan === "yearly"
                        ? "AWA Pro Creator (Yearly)"
                        : isPro
                        ? "AWA Pro Creator"
                        : "Free Starter Account"}
                    </h3>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ● Active Status
                  </span>
                </div>

                {/* Features Included Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                    Included Benefits
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Unlimited PRO Blueprint Unlocks</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Commercial License for Client Work</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Full Parameters &amp; Model Flags</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Weekly New Blueprint Drops</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>1-Click Prompt Parameter Tuner</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Priority Support via WhatsApp &amp; Email</span>
                    </div>
                  </div>
                </div>

                {/* Billing Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/checkout?plan=yearly"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 text-center transition-all"
                  >
                    {isPro ? "Renew / Change Plan" : "Upgrade to Pro (₹199)"}
                  </Link>
                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs border border-slate-200 dark:border-white/10 text-center transition-all"
                  >
                    Compare All Plans
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Payment & Invoices */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                  Billing &amp; Payment Gateway
                </h4>
                
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Razorpay Gateway</span>
                      <span className="text-[11px] text-slate-500 font-mono block">UPI, Cards, NetBanking</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Encrypted
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2">
                  <p>• All transactions are secured with 256-bit bank grade encryption.</p>
                  <p>• Invoices and receipt confirmations are instantly dispatched to your email.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 3: STUDIO PLAYGROUND
            ===================================================================== */}
        {activeTab === "studio" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Blueprint Prompt Synthesizer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Test and synthesize parameter flags directly before executing in target AI models.
                </p>
              </div>

              <Link
                href="/workflow"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              >
                <span>Full Cyberpunk Workflow Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Test Prompt Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Base Concept
                </label>
                <textarea
                  rows={3}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Aspect Ratio
                  </label>
                  <div className="flex items-center gap-2">
                    {["16:9", "9:16", "1:1", "21:9"].map((ar) => (
                      <button
                        key={ar}
                        onClick={() => setAspectRatio(ar)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          aspectRatio === ar
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="self-end pt-2">
                  <button
                    onClick={handleRunPlayground}
                    disabled={isGeneratingTest}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingTest ? "Calibrating..." : "Calibrate & Synthesize"}</span>
                  </button>
                </div>
              </div>

              {generatedOutput && (
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                    <span className="text-cyan-400 font-bold">✓ SYNTHESIZED BLUEPRINT</span>
                    <button
                      onClick={(e) => handleCopyPrompt(e, generatedOutput, "playground-test")}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Output</span>
                    </button>
                  </div>
                  <p className="leading-relaxed select-all">{generatedOutput}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: ACCOUNT SETTINGS & API ACCESS
            ===================================================================== */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Account Details Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account Credentials
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={displayName}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Primary Email Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value={displayEmail}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Account Role
                  </label>
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    {user?.role || "Creator User"}
                  </span>
                </div>
              </div>
            </div>

            {/* API Access Key Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    API Developer Token
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    For programmatic prompt queries &amp; pipeline scripts.
                  </p>
                </div>
                <Key className="w-5 h-5 text-blue-500" />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Public Secret Key
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                    awa_live_sk_9482••••••••••••••
                  </span>
                  <button
                    onClick={handleCopyApiKey}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    {apiKeyCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{apiKeyCopied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>• Never disclose your API key in publicly accessible client-side code.</p>
                <p>• Rate limited to 100 requests per minute under standard usage.</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
