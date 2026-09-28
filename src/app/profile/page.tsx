"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Database, Layers, Eye, Copy, Zap, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, isPro, isAdmin, logout } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/templates?limit=3")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSavedPrompts(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const [stats, setStats] = useState<{
    templatesCount?: number;
    totalViews?: number;
    totalCopies?: number;
    usersCount?: number;
  } | null>(null);

  useEffect(() => {
    // Fetch database statistics
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStats(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  if (!isLoading && !isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 shadow-xl text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Sign In Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please sign in to view your profile, saved blueprints, and credit balance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login?redirect=/profile"
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-xs transition-colors flex items-center justify-center"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split("@")[0] || "AWA Member";
  const displayEmail = user?.email || "user@awa.ai";
  const displayPlan = isPro ? (user?.subscriptionPlan === "lifetime" ? "Lifetime Pro" : "Yearly Pro") : "Free Plan";
  const displayCredits = user?.credits ?? (isPro ? 10 : 5);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-[40px] text-slate-900 dark:text-slate-100 transition-colors duration-300" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Creator Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your subscription, credits, and bookmarked blueprints.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Account Active</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl mb-4 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20 uppercase">
              {displayName.charAt(0)}
            </div>
            <h2 className="text-lg font-bold mb-0.5">{displayName}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-5 font-mono">{displayEmail}</p>
            
            <div className="bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl mb-5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 text-xs uppercase tracking-wider">
                  {displayPlan}
                </span>
                <span className="text-[0.65rem] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 py-0.5 px-2 rounded-full font-bold">Active</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Credits: {displayCredits} AI Generation Credits
              </p>
            </div>
            
            <div className="space-y-2">
              {isAdmin && (
                <Link href="/admin" className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </Link>
              )}
              <Link href="/pricing" className="btn-outline w-full justify-center !py-2.5 !text-xs !rounded-xl flex items-center gap-1.5">
                <span>⚡</span>
                <span>{isPro ? "Upgrade / Change Plan" : "Upgrade to Pro"}</span>
              </Link>
              <button 
                className="w-full justify-center py-2.5 text-xs rounded-xl font-medium text-red-500 border border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Admin Database Metrics Widget (Only for admins) */}
          {isAdmin && stats && (
            <div className="bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Database className="w-3.5 h-3.5 text-cyan-500" />
                <span>Admin DB Overview</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04]">
                  <p className="text-[10px] text-slate-400">Active Templates</p>
                  <p className="text-base font-bold text-cyan-600 dark:text-cyan-400">{stats.templatesCount ?? 31}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04]">
                  <p className="text-[10px] text-slate-400">Total Copies</p>
                  <p className="text-base font-bold text-pink-500">{stats.totalCopies ?? 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bookmarked Prompts</h2>
            <span className="text-xs text-slate-400">{savedPrompts.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedPrompts.map(tpl => (
              <Link 
                href={`/template/${tpl.id}`} 
                key={tpl.id} 
                className="group flex flex-col bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="relative w-full h-[160px] overflow-hidden bg-slate-100 dark:bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tpl.img} alt={tpl.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-cyan-300 backdrop-blur-md">
                    {tpl.tool}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2 line-clamp-1">
                    {tpl.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-amber-500 font-semibold flex items-center gap-1">★ Saved</span>
                    <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">View prompt →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
