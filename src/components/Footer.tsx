"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AwaLogo from "@/components/AwaLogo";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/workflow")) {
    return null;
  }

  return (
    <footer className="w-full bg-slate-100 dark:bg-[#050508] border-t border-slate-200 dark:border-white/10 pt-16 pb-12 text-slate-600 dark:text-zinc-400 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-3 group">
              <AwaLogo size={28} textSize="md" />
            </Link>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xs">
              The premier AI prompt catalog. Handcrafted, syntax-verified prompts and live parameter tools for creative professionals.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  All Prompt Blueprints
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  AWA Journal &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Canonical Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/?category=landing-pages" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  🚀 Landing Pages &amp; Heroes
                </Link>
              </li>
              <li>
                <Link href="/?category=cyber-tech" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  ⚡ Cyber &amp; Tech Interfaces
                </Link>
              </li>
              <li>
                <Link href="/?category=ecommerce" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  🛍️ E-Commerce &amp; 3D
                </Link>
              </li>
              <li>
                <Link href="/?category=portfolios" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  🎨 Portfolios &amp; Art
                </Link>
              </li>
              <li>
                <Link href="/?category=mobile-apps" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  📱 Mobile &amp; App UIs
                </Link>
              </li>
              <li>
                <Link href="/?category=saas-dashboards" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  📊 SaaS &amp; Dashboards
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Customer Guarantee</h4>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 space-y-2 text-xs shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <span>🛡️</span>
                <span>Commercial Usage Rights</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <span>⚡</span>
                <span>Instant 1-Click Copy</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <span>🔒</span>
                <span>Secure Payments via Razorpay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} AWA.AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 dark:hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 dark:hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 dark:hover:text-zinc-300 cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
