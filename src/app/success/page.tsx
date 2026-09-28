"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown <= 0) { router.push("/"); return; }
    const timer = setInterval(() => setCountdown(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="text-center max-w-[440px] bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl shadow-xl dark:shadow-2xl" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Payment Successful</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Your AWA Pro membership is now unlocked.</p>
        <p className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-8 px-3 py-1.5 rounded-full bg-cyan-500/10 inline-block">
          +5 AI Customization Credits Ready
        </p>

        <div>
          <Link href="/" className="btn-glow !py-3 !px-8 !text-sm w-full block">
            Start Exploring Prompts →
          </Link>
          <p className="text-slate-400 text-xs mt-4 font-mono">Redirecting to catalog in {countdown}s</p>
        </div>
      </div>
    </div>
  );
}
