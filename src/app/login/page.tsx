"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AwaLogo from "@/components/AwaLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);

      if (!res.success || !res.user) {
        setErrorMsg(res.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      const redirectTarget = searchParams.get("redirect");
      if (redirectTarget) {
        router.push(redirectTarget);
      } else if (res.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error connecting to database server.");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 py-12 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AwaLogo size={42} showText={false} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Sign in to access your curated AI blueprints
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
              <span className="text-[11px] text-slate-400 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-semibold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>Connecting to database...</span>
            ) : (
              <>
                <span>Sign in to AWA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials for Reviewers */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 text-center">
            Quick Database Logins
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@awa.ai", "admin123")}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-[11px] font-medium text-left flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Role</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("creator@awa.ai", "awa2026")}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-[11px] font-medium text-left flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Creator</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href={searchParams.get("redirect") ? `/signup?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/signup"}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginScreen() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-slate-500 font-mono text-xs">Loading authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}
