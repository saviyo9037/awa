import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("awa_session")?.value;
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    let userId: string | null = null;
    let userEmail: string | null = null;

    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        userId = parsed.id || null;
        userEmail = parsed.email || null;
      } catch {}
    }

    if (emailParam) {
      userEmail = emailParam.toLowerCase().trim();
    }

    if (!userId && !userEmail) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. No active user session." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("users")
      .select("id, email, name, role, is_pro, subscription_plan, credits, created_at");

    if (userId) {
      query = query.eq("id", userId);
    } else if (userEmail) {
      query = query.eq("email", userEmail);
    }

    const { data: user, error } = await query.maybeSingle();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPro: Boolean(user.is_pro || user.role === "admin" || user.role === "pro_subscriber"),
        subscriptionPlan: user.subscription_plan || (user.is_pro ? "pro" : "free"),
        credits: user.credits ?? 10,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user state" },
      { status: 500 }
    );
  }
}
