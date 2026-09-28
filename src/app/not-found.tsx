import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-3xl border border-page-border bg-page-surface/90 backdrop-blur-xl p-10 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-6 border border-indigo-500/20">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 mb-4">
          404 Error • Coordinate Not Found
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-3">Layer Lost in Space</h1>
        <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
          The requested blueprint or URL does not exist or has been relocated within the AWA network.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25"
          >
            <Home className="w-4 h-4" />
            Explore Blueprints
          </Link>
          <Link
            href="/#catalog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-page-border bg-page-surface hover:bg-zinc-800 text-page-text font-medium text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
