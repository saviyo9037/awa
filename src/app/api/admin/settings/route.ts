import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("platform_settings").select("*");

    const settingsObj: Record<string, string> = {
      non_subscriber_visibility: "blurred_preview",
      ai_monthly_spending_cap: "500",
      free_customization_count: "3",
      voice_input_enabled: "true",
      standing_rewrite_instruction: "Enhance fidelity, specify lighting, color palette, camera lens, and ultra-high-definition composition parameters.",
      payment_provider: "razorpay",
    };

    if (!error && data) {
      for (const row of data) {
        settingsObj[row.key] = row.value;
      }
    }

    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));

    for (const item of updates) {
      await supabase.from("platform_settings").upsert(item, { onConflict: "key" });
    }

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully",
      data: body,
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
