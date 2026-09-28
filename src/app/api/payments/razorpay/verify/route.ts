import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, isRazorpayConfigured } from "@/lib/razorpay";
import { recordSubscription, createOrGetUser } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    // Retrieve logged-in session user
    const existingCookie = request.cookies.get("awa_session")?.value;
    let sessionUser: any = null;
    if (existingCookie) {
      try {
        sessionUser = JSON.parse(existingCookie);
      } catch {}
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email: bodyEmail,
      plan = "yearly",
    } = body;

    const email = (bodyEmail || sessionUser?.email)?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "User email is required to associate subscription. Please sign in.",
        },
        { status: 401 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required Razorpay verification parameters (order_id, payment_id, signature)",
        },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not configured on the backend.",
        },
        { status: 503 }
      );
    }

    // 1. Cryptographically verify signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error("Razorpay signature verification failed:", {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Razorpay payment signature. Transaction could not be verified.",
        },
        { status: 400 }
      );
    }

    const priceLabel = plan === "lifetime" ? "₹999" : "₹199";

    // 2. Persist subscription in Local SQLite
    try {
      const localUser = createOrGetUser(email);
      if (localUser) {
        recordSubscription(localUser.id as string, plan, priceLabel, razorpay_payment_id);
      }
    } catch (localErr) {
      console.warn("SQLite subscription sync note:", localErr);
    }

    // 3. Persist subscription in Supabase Cloud
    try {
      const supabase = getSupabaseAdmin();
      // Check if user exists or insert
      const { data: userRecord } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      let userId = userRecord?.id;
      if (!userId) {
        const { data: newUser } = await supabase
          .from("users")
          .insert([{ email, is_pro: true }])
          .select("id")
          .single();
        userId = newUser?.id;
      } else {
        await supabase
          .from("users")
          .update({ is_pro: true })
          .eq("id", userId);
      }

      if (userId) {
        await supabase.from("subscriptions").insert([
          {
            user_id: userId,
            plan,
            amount: priceLabel,
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            status: "active",
          },
        ]);
      }
    } catch (supaErr) {
      console.warn("Supabase subscription sync note:", supaErr);
    }

    const response = NextResponse.json({
      success: true,
      verified: true,
      plan,
      paymentId: razorpay_payment_id,
      message: `Payment verified! You are now subscribed to ${plan === "lifetime" ? "AWA Pro (Lifetime)" : "AWA Pro (Yearly)"}.`,
    });

    // Sync session cookie with active PRO status

    const updatedSession = {
      ...(sessionUser || {}),
      email: email,
      is_pro: true,
      role: sessionUser?.role === "admin" ? "admin" : "pro_subscriber",
      subscription_plan: plan,
    };

    response.cookies.set("awa_session", JSON.stringify(updatedSession), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to verify Razorpay payment.",
      },
      { status: 500 }
    );
  }
}
