"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AwaLogo from "@/components/AwaLogo";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await signup(name.trim(), email.trim(), password);

      if (!res.success || !res.user) {
        setErrorMsg(res.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      if (redirectTarget) {
        router.push(redirectTarget);
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error connecting to database server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AwaLogo size={42} showText={false} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Join the AWA cinematic prompt network
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Free instant access to 15+ public blueprints</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct registration into cloud database</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-semibold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {isLoading ? (
              <span>Registering in Supabase...</span>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Already have an account?{" "}
          <Link
            href={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : "/login"}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupScreen() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading registration...</div>}>
      <SignupForm />
    </Suspense>
  );
}
