import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !plans || plans.length === 0) {
      // Fallback default plans if database is initializing
      return NextResponse.json({
        success: true,
        data: [
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
              "Standard commercial license"
            ],
            badge: null,
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
              "Everything in Annual",
              "Permanent lifetime access (Never pay again)",
              "Weekly new prompt drops & AI models",
              "Advanced multi-modal video prompts (Runway & Kling)",
              "Priority WhatsApp & email support",
              "Unlimited AI prompt customizer credits"
            ],
            badge: "⭐ Most Popular",
            is_popular: true,
          }
        ]
      });
    }

    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
