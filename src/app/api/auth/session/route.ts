import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabaseAdmin();

    let { data: user } = await supabase
      .from("users")
      .select("id, email, name, role, is_pro, subscription_plan, credits")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!user) {
      const id = `usr-${Date.now()}`;
      const { data: newUser, error } = await supabase
        .from("users")
        .insert([
          {
            id,
            email: cleanEmail,
            name: name || cleanEmail.split("@")[0],
            role: "user",
            is_pro: false,
            subscription_plan: "free",
            credits: 10,
          },
        ])
        .select("id, email, name, role, is_pro, subscription_plan, credits")
        .single();

      if (error || !newUser) {
        return NextResponse.json(
          { success: false, error: "Failed to initialize user session in database" },
          { status: 500 }
        );
      }
      user = newUser;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPro: Boolean(user.is_pro || user.role === "admin" || user.role === "pro_subscriber"),
        subscriptionPlan: user.subscription_plan,
        credits: user.credits,
      },
      message: "Session authenticated",
    });
  } catch (error) {
    console.error("Auth session error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
