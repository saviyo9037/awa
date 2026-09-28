import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const POSTS = [
  {
    id: "1",
    title: "Mastering Midjourney v6.1 Lighting & Camera Parameters",
    excerpt: "How to use shutter angles, 85mm prime lenses, and volumetric mist to create cinematic visual identities.",
    date: "Sep 20, 2026",
    category: "Tutorial",
    readTime: "5 min read",
    img: "/cyber_portrait.jpg",
  },
  {
    id: "2",
    title: "Why Most AI Generated Websites Look Generic (And How to Fix It)",
    excerpt: "Breaking away from default SaaS templates by introducing asymmetry, editorial typography, and obsidian palettes.",
    date: "Sep 15, 2026",
    category: "Design",
    readTime: "7 min read",
    img: "/cyber_dashboard.jpg",
  },
  {
    id: "3",
    title: "The Prompt Engineering Guide for Claude 3.7 Sonnet",
    excerpt: "Leveraging structured XML tags and system instructions for reliable multi-step frontend code generation.",
    date: "Sep 10, 2026",
    category: "Engineering",
    readTime: "6 min read",
    img: "/holographic_3d.jpg",
  },
  {
    id: "4",
    title: "v0 & Tailwind v4: Accelerating Production Prototypes",
    excerpt: "A deep dive into generating full-stack responsive web capsules directly from natural language specifications.",
    date: "Sep 05, 2026",
    category: "Frontend",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "FLUX.1 vs Midjourney: An Objective Generative Benchmark",
    excerpt: "Comparing typography fidelity, hands, architectural perspective, and raw photorealism across 500 benchmark seeds.",
    date: "Aug 28, 2026",
    category: "Research",
    readTime: "9 min read",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "The Psychology of Dark Mode Obsidian Glassmorphism",
    excerpt: "Why high-contrast editorial dark themes reduce cognitive friction and elevate perceived software value.",
    date: "Aug 20, 2026",
    category: "UI/UX",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-4">
          <span>AWA Journal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight mb-4 font-sans">
          Insights &amp; Blueprints
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Articles, guides, and breakdown studies on creative AI prompting.
        </p>
      </div>

      {/* Post List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c12] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full h-[220px] overflow-hidden bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                {post.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-3 font-mono">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-semibold mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  Read article <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
