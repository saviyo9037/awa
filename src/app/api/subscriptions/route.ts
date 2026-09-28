import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan, amount, paymentId } = body;

    if (!email || !plan) {
      return NextResponse.json(
        { success: false, error: "Email and plan are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabaseAdmin();

    // Check or create user in Supabase
    let { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!user) {
      const newUserId = `usr-${Date.now()}`;
      const { data: newUser, error: createErr } = await supabase
        .from("users")
        .insert([{ id: newUserId, email: cleanEmail, is_pro: true, subscription_plan: plan }])
        .select("id")
        .single();
      if (createErr || !newUser) {
        return NextResponse.json({ success: false, error: "Failed to create user in database" }, { status: 500 });
      }
      user = newUser;
    } else {
      await supabase
        .from("users")
        .update({ is_pro: true, subscription_plan: plan })
        .eq("id", user.id);
    }

    const subId = `sub-${Date.now()}`;
    const priceLabel = amount || (plan === "lifetime" ? "₹999" : "₹199");

    const { error: subErr } = await supabase.from("subscriptions").insert([
      {
        id: subId,
        user_id: user.id,
        plan,
        amount: priceLabel,
        payment_id: paymentId || `pay_${Date.now()}`,
        status: "active",
      },
    ]);

    if (subErr) {
      console.error("Subscription insert error:", subErr);
      return NextResponse.json({ success: false, error: "Failed to persist subscription in database" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { subId, plan, amount: priceLabel },
      message: `Subscription to ${plan} activated successfully!`,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
