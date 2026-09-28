"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PlanItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  original_price?: string;
  interval: string;
  description?: string;
  features: string[];
  badge?: string;
  is_popular?: boolean;
}

const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "plan-yearly",
    name: "Annual Pass",
    slug: "yearly",
    price: "₹199",
    original_price: "₹999",
    interval: "year",
    description: "Billed annually. Cancel anytime with a single click.",
    features: [
      "Full access to 500+ prompt templates",
      "1-Click prompt copy with aspect ratios",
      "Interactive parameter controls (--ar, --style raw)",
      "AI prompt customizer (5 credits/session)",
      "Standard commercial license",
    ],
    badge: "",
    is_popular: false,
  },
  {
    id: "plan-lifetime",
    name: "Lifetime Pass",
    slug: "lifetime",
    price: "₹999",
    original_price: "₹3,999",
    interval: "lifetime",
    description: "Pay once. Permanent lifetime access to all current and future updates.",
    features: [
      "Everything in Annual Pass",
      "Permanent lifetime access (Never pay again)",
      "Weekly new prompt drops & AI models",
      "Unlimited AI customizer rewrites",
      "Full commercial rights for all client work",
      "Priority creator support",
    ],
    badge: "⭐ Most Popular",
    is_popular: true,
  },
];

export default function PricingScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>("lifetime");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/plans");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPlans(json.data);
          const popular = json.data.find((p: PlanItem) => p.is_popular);
          if (popular) {
            setSelectedPlanSlug(popular.slug);
          } else {
            setSelectedPlanSlug(json.data[0].slug);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic plans:", err);
      }
    }
    fetchPlans();
  }, []);

  const faqs = [
    {
      q: "What AI tools and models are supported?",
      a: "Our prompts are custom-tuned and verified for Midjourney v6, Claude 3.5 Sonnet, Runway Gen-3 Alpha, SDXL, DALL-E 3, and ChatGPT-4o.",
    },
    {
      q: "Can I use these prompts for commercial client projects?",
      a: "Yes! All prompts in our library come with a commercial usage license. You can use outputs in client work, digital products, posters, and web applications.",
    },
    {
      q: "How does the AI Prompt Customizer work?",
      a: "Simply describe what you want in everyday English (e.g., 'make it rainy night in Tokyo'), and our customizer injects that idea into the prompt without breaking aspect ratio flags or model-specific syntax.",
    },
    {
      q: "What is the difference between Annual and Lifetime?",
      a: "Annual Pass gives you access for 12 months. Lifetime Pass is a one-time purchase that unlocks permanent lifetime access to all current and future prompts forever without any recurring fees.",
    },
  ];

  return (
    <div className="min-h-[90vh] px-4 sm:px-6 py-16 max-w-6xl mx-auto flex flex-col items-center bg-slate-50 dark:bg-[#07070a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
          ✨ Affordable Plans for Everyone
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-400 dark:to-pink-500">Pricing</span>
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          Unlock over 500+ curated AI prompts, instant 1-click copying with full parameter injection, and intelligent AI prompt customization.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className={`grid grid-cols-1 ${plans.length === 1 ? "max-w-md" : plans.length === 2 ? "md:grid-cols-2 max-w-4xl" : "md:grid-cols-3 max-w-6xl"} gap-8 w-full mb-12`}>
        {plans.map((plan) => {
          const isSelected = selectedPlanSlug === plan.slug;
          const featuresList = Array.isArray(plan.features) ? plan.features : [];
          const isPopular = Boolean(plan.is_popular);

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanSlug(plan.slug)}
              className={`p-8 rounded-3xl transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? isPopular
                    ? "bg-white dark:bg-zinc-900 border-2 border-pink-500 shadow-xl dark:shadow-[0_0_35px_rgba(255,0,127,0.25)]"
                    : "bg-white dark:bg-zinc-900 border-2 border-cyan-500 dark:border-cyan-400 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                  : "bg-white/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 shadow-sm"
              }`}
            >
              {/* Optional Ribbon / Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {plan.name}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? isPopular
                          ? "border-pink-500"
                          : "border-cyan-500 dark:border-cyan-400"
                        : "border-slate-300 dark:border-zinc-600"
                    }`}
                  >
                    {isSelected && (
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isPopular ? "bg-pink-500" : "bg-cyan-500 dark:bg-cyan-400"
                        }`}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.original_price && (
                    <span className="text-slate-400 line-through text-sm font-mono">
                      {plan.original_price}
                    </span>
                  )}
                  <span className="text-slate-500 dark:text-zinc-400 text-sm">
                    {plan.interval === "year"
                      ? "/ year"
                      : plan.interval === "lifetime"
                      ? "one-time payment"
                      : `/${plan.interval}`}
                  </span>
                </div>

                {plan.description && (
                  <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                    {plan.description}
                  </p>
                )}

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 border-t border-slate-200 dark:border-white/10 pt-6">
                  {featuresList.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          isPopular
                            ? "text-pink-600 dark:text-pink-400"
                            : "text-cyan-600 dark:text-cyan-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/checkout?plan=${encodeURIComponent(plan.slug)}`);
                }}
                className={`mt-8 w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? isPopular
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white shadow-md dark:shadow-[0_0_20px_rgba(255,0,127,0.5)]"
                      : "bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black shadow-md dark:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white"
                }`}
              >
                Choose {plan.name} ({plan.price})
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center flex-wrap gap-6 text-xs text-slate-500 dark:text-zinc-400 mb-16">
        <span className="flex items-center gap-1.5">
          <span>🔒</span> 256-Bit Encrypted Checkout
        </span>
        <span className="flex items-center gap-1.5">
          <span>💳</span> Cards, UPI, Netbanking Supported
        </span>
        <span className="flex items-center gap-1.5">
          <span>⚡</span> Instant Account Activation
        </span>
      </div>

      {/* Frequently Asked Questions */}
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
