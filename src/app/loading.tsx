export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/20 animate-ping" />
        <div className="absolute inset-0 rounded-2xl border-2 border-t-indigo-500 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-xl bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 backdrop-blur-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium tracking-wide uppercase text-zinc-500 animate-pulse font-mono">
        Loading AWA Engine...
      </p>
    </div>
  );
}
