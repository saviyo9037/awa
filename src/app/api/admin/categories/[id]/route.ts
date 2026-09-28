import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, icon, sort_order } = body;

    const supabase = getSupabaseAdmin();
    const updatePayload: Record<string, any> = {};
    if (name !== undefined) updatePayload.name = name;
    if (slug !== undefined) updatePayload.slug = slug;
    if (description !== undefined) updatePayload.description = description;
    if (icon !== undefined) updatePayload.icon = icon;
    if (sort_order !== undefined) updatePayload.sort_order = sort_order;

    await supabase.from("categories").update(updatePayload).eq("id", id);

    try {
      const db = getDb();
      if (name) {
        db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, id);
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Admin category update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    await supabase.from("categories").delete().eq("id", id);

    try {
      const db = getDb();
      db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Admin category delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
