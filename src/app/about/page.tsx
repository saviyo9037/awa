import Link from "next/link";
import { Sparkles, Terminal, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-4">
          <span>About AWA.AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight mb-6 font-sans">
          Building the blueprint catalog for the AI generation.
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
          AWA.AI is a curated repository of tested, high-fidelity prompt blueprints designed for creators, designers, and developers using Midjourney, Claude, and Runway.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Tested Quality</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every prompt in our catalog has been run across hundreds of seeds to guarantee production-ready visual quality.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Parametric Blueprints</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Adjust aspect ratios, lighting angles, color temperatures, and styling flags in real-time before copying.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Creator-First</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Designed for commercial use. Power your pitch decks, client moodboards, brand identities, and interface mockups.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl p-10 bg-slate-100 dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">Ready to level up your creations?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Get unlimited access to all 500+ production prompts today.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md transition-transform hover:scale-105"
        >
          Explore Pricing &amp; Plans →
        </Link>
      </div>

    </div>
  );
}
