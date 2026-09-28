import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Supabase categories error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch categories from database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
