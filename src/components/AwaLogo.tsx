import React from "react";

interface AwaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
}

export default function AwaLogo({
  className = "",
  size = 32,
  showText = true,
  textSize = "md",
}: AwaLogoProps) {
  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 
        AWA Bespoke Geometric Monogram:
        Features 3 precision-folded facets forming an interlocking A - W - A symbol.
        Bilateral symmetry, cyber-editorial aesthetic, radiant gradient fills.
      */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(0,229,255,0.35)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Cyan to Violet gradient for Left A-Wing */}
            <linearGradient id="awa-grad-left" x1="4" y1="30" x2="16" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Violet to Magenta gradient for Center W-Fold */}
            <linearGradient id="awa-grad-center" x1="12" y1="14" x2="24" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Magenta to Hot Pink gradient for Right A-Wing */}
            <linearGradient id="awa-grad-right" x1="20" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ff007f" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="awa-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00e5ff" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Left "A" Faceted Tower */}
          <path
            d="M 5 29 L 13 7 L 17 7 L 14 16 L 9.5 29 Z"
            fill="url(#awa-grad-left)"
          />

          {/* Center "W" Interlocking Dynamic Chevron */}
          <path
            d="M 12 11 L 18 26 L 24 11 L 21 11 L 18 19 L 15 11 Z"
            fill="url(#awa-grad-center)"
          />

          {/* Right "A" Faceted Tower (Symmetric Mirror) */}
          <path
            d="M 31 29 L 23 7 L 19 7 L 22 16 L 26.5 29 Z"
            fill="url(#awa-grad-right)"
          />

          {/* Interlocking Horizontal Bridge Bar that unifies the A-W-A mark */}
          <path
            d="M 8.5 21 L 27.5 21 L 26.5 23.5 L 9.5 23.5 Z"
            fill="url(#awa-grad-center)"
            opacity="0.9"
          />

          {/* Top Apex Energy Core (Micro geometric accent) */}
          <circle cx="18" cy="7" r="1.5" fill="#00e5ff" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex items-baseline tracking-tight font-sans">
          <span className={`font-black uppercase tracking-wider text-slate-900 dark:text-white ${textClasses[textSize]}`}>
            AWA
          </span>
          <span className={`font-black text-cyan-500 dark:text-cyan-400 ml-0.5 ${textClasses[textSize]}`}>
            .AI
          </span>
        </div>
      )}
    </div>
  );
}
