"use client";

import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/workflow")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[fadeIn_0.5s_ease-out]">
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        title={`Click to switch to ${theme === "dark" ? "Light / White" : "Dark"} Mode`}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#12111d]/95 backdrop-blur-xl border border-slate-300 dark:border-cyan-400/40 text-slate-800 dark:text-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,229,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
      >
        <div className="relative w-6 h-6 rounded-full flex items-center justify-center bg-amber-100 dark:bg-zinc-800/80 text-amber-600 dark:text-cyan-400 shadow-inner group-hover:rotate-12 transition-transform duration-300">
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/30" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-800 fill-slate-800/20" />
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold tracking-wide uppercase font-sans">
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </span>
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 -mt-0.5">
            Active: {theme === "dark" ? "Dark Mode 🌙" : "White Mode ☀️"}
          </span>
        </div>
      </button>
    </div>
  );
}
