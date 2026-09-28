"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-red-500/20 bg-page-surface/80 backdrop-blur-xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-400 mb-6 font-sans">
          An unexpected system state occurred while loading this layer. Our engineering monitors have received the telemetry.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/25"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-page-border bg-page-surface hover:bg-zinc-800 text-page-text font-medium text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
