"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Zap, Lock, ArrowUpRight, Sparkles, HelpCircle } from "lucide-react";
import AwaLogo from "@/components/AwaLogo";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/workflow")) {
    return null;
  }

  return (
    <footer className="w-full bg-white dark:bg-[#07070a] border-t border-slate-200 dark:border-white/10 pt-16 pb-24 sm:pb-20 text-slate-600 dark:text-zinc-400 transition-colors duration-300">
      <div className="max-w-[1450px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Brand & Mission Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center group">
              <AwaLogo size={30} textSize="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The premier AI prompt catalog. Handcrafted, syntax-verified blueprints and live parameter tuning for creative professionals, developers, and agency teams.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[11px] font-medium text-blue-700 dark:text-blue-400">
                <Sparkles className="w-3 h-3" />
                <span>Weekly Prompt Drops</span>
              </div>
            </div>
          </div>

          {/* Quick Links / Explore */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-mono">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  All Prompt Blueprints
                </Link>
              </li>
              <li>
                <Link href="/workflow" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  <span>Workflow Studio</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  AWA Journal &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  Contact &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Canonical Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-mono">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/?category=landing-pages" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  🚀 Landing Pages &amp; Heroes
                </Link>
              </li>
              <li>
                <Link href="/?category=cyber-tech" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  ⚡ Cyber &amp; Tech Interfaces
                </Link>
              </li>
              <li>
                <Link href="/?category=ecommerce" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  🛍️ E-Commerce &amp; 3D Renders
                </Link>
              </li>
              <li>
                <Link href="/?category=portfolios" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  🎨 Portfolios &amp; Art
                </Link>
              </li>
              <li>
                <Link href="/?category=mobile-apps" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  📱 Mobile &amp; App Blueprints
                </Link>
              </li>
              <li>
                <Link href="/?category=saas-dashboards" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors">
                  📊 SaaS &amp; Web Dashboards
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Customer Guarantee */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-mono">
              Customer Guarantee
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 space-y-3 text-xs shadow-sm">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium">Commercial Usage Rights</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium">Instant 1-Click Copy</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-medium">256-bit Encrypted Checkout</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] text-xs">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need help? Contact Support</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} AWA.AI. Handcrafted for creative professionals worldwide.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Contact &amp; Support
            </Link>
            <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              License Terms
            </Link>
            <Link href="/api-docs" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              API Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
