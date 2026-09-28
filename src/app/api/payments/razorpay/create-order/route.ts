import { NextRequest, NextResponse } from "next/server";
import { getRazorpayInstance, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { plan = "yearly", email = "subscriber@awa.ai" } = body;

    // Standardized prices in paise (INR 1 = 100 paise)
    const amountInPaise = plan === "lifetime" ? 99900 : 19900;
    const planLabel = plan === "lifetime" ? "AWA Pro (Lifetime)" : "AWA Pro (Yearly)";

    if (!isRazorpayConfigured()) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: "Razorpay keys (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are not configured in .env.local yet.",
      }, { status: 503 });
    }

    const rzp = getRazorpayInstance();
    if (!rzp) {
      return NextResponse.json({
        success: false,
        error: "Failed to initialize Razorpay instance",
      }, { status: 500 });
    }

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;
    const order = await rzp.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        plan,
        email,
        description: planLabel,
      },
    });

    return NextResponse.json({
      success: true,
      configured: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || "INR",
      keyId: getRazorpayKeyId(),
      plan,
      planName: planLabel,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Failed to create Razorpay checkout order",
    }, { status: 500 });
  }
}
