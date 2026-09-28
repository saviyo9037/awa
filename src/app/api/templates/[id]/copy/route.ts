import { NextRequest, NextResponse } from "next/server";
import { incrementTemplateCopies } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Increment in local SQLite
    incrementTemplateCopies(id);

    // 2. Increment in Supabase Cloud
    try {
      const supabase = getSupabaseAdmin();
      const { data: tpl } = await supabase
        .from("templates")
        .select("copy_count")
        .eq("id", id)
        .single();

      if (tpl) {
        await supabase
          .from("templates")
          .update({ copy_count: (tpl.copy_count || 0) + 1 })
          .eq("id", id);
      }
    } catch (cloudErr) {
      console.warn("Supabase copy count sync note:", cloudErr);
    }

    return NextResponse.json({ success: true, message: "Copy tracked in cloud and local telemetry" });
  } catch (error) {
    console.error("Error logging copy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log copy" },
      { status: 500 }
    );
  }
}
