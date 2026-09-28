"use client";
import Link from "next/link";

export default function BillingPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-[40px] text-slate-900 dark:text-slate-100 transition-colors duration-300" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <Link href="/profile" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 inline-flex items-center gap-1.5 text-sm font-medium">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Billing &amp; Subscription</h1>

      {/* Current Plan */}
      <div className="bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Plan</h2>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-1 px-3 rounded-full font-bold uppercase tracking-wider border border-emerald-500/20">Active</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-black mb-1">AWA Pro — Yearly</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">₹199/year · Renews on Oct 18, 2026</p>
          </div>
          <Link href="/pricing" className="btn-outline !py-2 !px-4 !text-xs !rounded-xl text-center">
            Change plan
          </Link>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Payment Method</h2>
          <button className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold hover:underline">Update</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">VISA</div>
          <div>
            <p className="font-semibold text-sm">•••• •••• •••• 4242</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Expires 12/28</p>
          </div>
        </div>
      </div>

      {/* AI Credits */}
      <div className="bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Customization Credits</h2>
          <button className="btn-glow !py-1.5 !px-3.5 !text-xs !rounded-xl">Buy more</button>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">3</div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">credits remaining</p>
          </div>
          <div className="flex-grow">
            <div className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">3 of 5 monthly free credits remaining</p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-[#100f18] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Billing History</h2>
        <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
          {[
            { date: "Sep 18, 2026", desc: "AWA Pro — Yearly", amount: "₹199", status: "Paid" },
            { date: "Sep 18, 2026", desc: "Signup bonus credits", amount: "Free", status: "—" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-4">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-mono w-[90px] sm:w-[110px]">{item.date}</span>
                <span className="font-medium text-sm">{item.desc}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{item.amount}</span>
                {item.status === "Paid" && (
                  <span className="text-[0.65rem] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-0.5 px-2 rounded-full font-semibold">{item.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Zone */}
      <div className="bg-white dark:bg-[#100f18] border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-red-500 mb-1">Cancel Subscription</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Your plan will remain active until Oct 18, 2026. After that, you will lose access to Pro features.</p>
        <button className="text-xs font-semibold text-red-500 hover:text-red-600 border border-red-500/30 hover:bg-red-500/5 px-4 py-2 rounded-xl transition-all">
          Cancel subscription
        </button>
      </div>
    </div>
  );
}
