import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const [tplRes, catRes, toolRes, fbRes, settingsRes, usersRes, subsRes] = await Promise.all([
      supabase.from("templates").select("id, copy_count", { count: "exact" }),
      supabase.from("categories").select("id", { count: "exact" }),
      supabase.from("ai_tools").select("id", { count: "exact" }),
      supabase.from("feedback").select("id, rating", { count: "exact" }),
      supabase.from("platform_settings").select("*"),
      supabase.from("users").select("id, is_pro, role", { count: "exact" }),
      supabase.from("subscriptions").select("id, amount, status"),
    ]);

    const totalTemplates = tplRes.count ?? (tplRes.data?.length || 0);
    const totalCategories = catRes.count ?? (catRes.data?.length || 0);
    const totalTools = toolRes.count ?? (toolRes.data?.length || 0);
    const totalCopies = tplRes.data?.reduce((sum, item) => sum + (item.copy_count || 0), 0) || 0;
    const totalFeedback = fbRes.count ?? (fbRes.data?.length || 0);

    const avgRating = fbRes.data && fbRes.data.length > 0
      ? (fbRes.data.reduce((acc, curr) => acc + (curr.rating || 5), 0) / fbRes.data.length).toFixed(1)
      : "0.0";

    const totalUsers = usersRes.data ? usersRes.data.length : 0;
    const totalSubscriptions = usersRes.data
      ? usersRes.data.filter((u: any) => Boolean(u.is_pro || u.role === "admin" || u.role === "pro_subscriber")).length
      : 0;

    let totalRevenueNum = 0;
    if (subsRes.data && subsRes.data.length > 0) {
      totalRevenueNum = subsRes.data.reduce((sum: number, sub: any) => {
        const val = parseFloat(String(sub.amount || "0").replace(/[^0-9.]/g, "")) || 0;
        return sum + val;
      }, 0);
    }

    const stats = {
      totalTemplates,
      totalCategories,
      totalTools,
      totalCopies,
      totalUsers,
      totalSubscriptions,
      totalRevenue: `₹${totalRevenueNum.toLocaleString("en-IN")}`,
      totalFeedback,
      avgRating,
      source: "supabase",
      settings: settingsRes.data || [],
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}
