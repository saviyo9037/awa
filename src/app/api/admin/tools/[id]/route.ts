import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, category, website_url, description } = body;

    const supabase = getSupabaseAdmin();
    await supabase.from("ai_tools").update({
      name,
      category,
      website_url,
      description,
    }).eq("id", id);

    return NextResponse.json({ success: true, message: "AI Tool updated successfully" });
  } catch (error) {
    console.error("Error updating AI tool:", error);
    return NextResponse.json({ success: false, error: "Failed to update tool" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    await supabase.from("ai_tools").delete().eq("id", id);

    return NextResponse.json({ success: true, message: "AI Tool removed from registry" });
  } catch (error) {
    console.error("Error deleting AI tool:", error);
    return NextResponse.json({ success: false, error: "Failed to delete tool" }, { status: 500 });
  }
}
