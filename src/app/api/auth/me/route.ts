import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("awa_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    let parsedCookie: any = null;
    try {
      parsedCookie = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    let user: any = null;

    try {
      const supabase = getSupabaseAdmin();
      let res = await supabase
        .from("users")
        .select("id, email, name, role, is_pro, credits, subscription_plan, created_at")
        .eq("id", parsedCookie.id)
        .maybeSingle();

      if (!res.data && parsedCookie.email) {
        res = await supabase
          .from("users")
          .select("id, email, name, role, is_pro, credits, subscription_plan, created_at")
          .eq("email", parsedCookie.email.toLowerCase().trim())
          .maybeSingle();
      }

      if (res.data) user = res.data;
    } catch (e) {
      console.warn("Supabase auth me check note:", e);
    }

    // SQLite Fallback
    if (!user && parsedCookie.email) {
      try {
        const { getUserByEmail } = await import("@/lib/db");
        const local = getUserByEmail(parsedCookie.email.toLowerCase().trim());
        if (local) {
          user = {
            id: local.id,
            email: local.email,
            name: local.name,
            role: local.role,
            is_pro: Boolean(local.is_pro),
            credits: local.credits,
            subscription_plan: local.subscription_plan,
            created_at: local.created_at,
          };
        }
      } catch (e) {
        console.warn("SQLite auth me check note:", e);
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPro: Boolean(user.is_pro || user.role === "admin" || user.role === "pro_subscriber"),
        subscriptionPlan: user.subscription_plan || "free",
        credits: user.credits ?? 10,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ success: false, authenticated: false }, { status: 500 });
  }
}
