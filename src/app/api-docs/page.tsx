import Link from "next/link";

export default function ApiDocs() {
  return (
    <div className="container mx-auto px-[5%] py-[50px] max-w-[1400px] animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="text-center mb-[50px]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
          API v1.0 · REST Endpoints
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          AWA <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">Developer API</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Integrate our curated library of production-tested prompts directly into your AI workflows, applications, and agents.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 max-w-[1200px] mx-auto">
        {/* Sidebar */}
        <aside className="lg:border-r border-slate-200 dark:border-white/10 lg:pr-6">
          <div className="sticky top-[90px] space-y-6">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Overview</p>
              <ul className="space-y-1 text-sm font-medium">
                <li><a href="#intro" className="block px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold">Introduction</a></li>
                <li><a href="#auth" className="block px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">Authentication</a></li>
                <li><a href="#rate-limits" className="block px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">Rate Limits</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Endpoints</p>
              <ul className="space-y-1 text-sm font-mono">
                <li><a href="#get-prompts" className="block px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">GET /v1/prompts</a></li>
                <li><a href="#get-prompt-id" className="block px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">GET /v1/prompts/:id</a></li>
                <li><a href="#post-generate" className="block px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">POST /v1/prompts/mutate</a></li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <Link href="/pricing" className="btn-glow !text-xs !py-2 w-full text-center">
                Get API Key
              </Link>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="space-y-12">
          {/* Introduction */}
          <section id="intro" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Introduction</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The AWA API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON responses, and uses standard HTTP response codes and bearer token authentication.
            </p>
          </section>
          
          {/* Authentication Card */}
          <section id="auth" className="scroll-mt-24 bg-white dark:bg-[#100f18] border border-slate-200 dark:border-cyan-500/30 p-6 rounded-2xl shadow-sm dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authentication</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Authenticate all API requests by including your secret API key in the standard Authorization HTTP header.
            </p>
            <div className="bg-slate-900 dark:bg-black/70 p-4 rounded-xl font-mono text-xs sm:text-sm border border-slate-800 dark:border-white/10 text-cyan-300">
              Authorization: Bearer awa_sk_live_51928471928...
            </div>
          </section>
          
          {/* Endpoint: GET Prompts */}
          <section id="get-prompts" className="scroll-mt-24 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fetch Prompts</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Retrieve a paginated list of production-tested prompts with filters for category and tools.</p>
            </div>
            
            <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden border border-slate-800 dark:border-white/10 shadow-lg">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 font-mono text-xs flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                <span className="text-slate-300">https://api.awa.ai/v1/prompts</span>
              </div>
              <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300">
                <span className="text-pink-400">curl</span> -X GET <span className="text-amber-300">&quot;https://api.awa.ai/v1/prompts?category=fashion&amp;tool=Midjourney&quot;</span> \<br/>
                &nbsp;&nbsp;-H <span className="text-cyan-300">&quot;Authorization: Bearer $AWA_API_KEY&quot;</span> \<br/>
                &nbsp;&nbsp;-H <span className="text-cyan-300">&quot;Content-Type: application/json&quot;</span>
              </div>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="scroll-mt-24 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Rate Limits & Quotas</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard accounts are limited to 60 requests per minute. Pro and Enterprise tier subscribers receive dedicated throughput of up to 1,200 requests per minute with webhook alerts.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
