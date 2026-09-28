import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";

const CATEGORY_MAP: Record<string, string> = {
  "image": "image",
  "video": "video",
  "website": "website",
  "slides": "slides",
  "landing-pages": "website",
  "cyber-tech": "website",
  "ecommerce": "image",
  "portfolios": "image",
  "mobile-apps": "website",
  "saas-dashboards": "website",
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, desc, prompt, category, subcategory, img, tags, isPro, complexity, tool, toolUrl, tip, steps, mediaType, videoUrl } = body;

    const supabase = getSupabaseAdmin();
    const updatePayload: Record<string, any> = {};

    if (title !== undefined) updatePayload.title = title;
    if (desc !== undefined) updatePayload.description = desc;
    if (prompt !== undefined) updatePayload.prompt_text = prompt;
    if (category !== undefined) {
      updatePayload.category_id = CATEGORY_MAP[category] || category || "image";
    }
    if (img !== undefined) updatePayload.image_url = img;
    if (isPro !== undefined) updatePayload.featured = Boolean(isPro);
    if (complexity !== undefined) updatePayload.complexity = complexity;
    if (tool !== undefined) updatePayload.tool = tool;
    if (toolUrl !== undefined) updatePayload.toolUrl = toolUrl;
    if (tip !== undefined) updatePayload.tip = tip;
    if (steps !== undefined) updatePayload.steps = steps;
    if (mediaType !== undefined) updatePayload.mediaType = mediaType;
    if (videoUrl !== undefined) updatePayload.videoUrl = videoUrl;

    if (tags !== undefined || subcategory !== undefined) {
      let tagArr: string[] = [];
      if (tags !== undefined) {
        tagArr = Array.isArray(tags) ? [...tags] : String(tags).split(",").map(s => s.trim()).filter(Boolean);
      }
      if (subcategory && typeof subcategory === "string" && subcategory.trim()) {
        tagArr = tagArr.filter(t => !t.startsWith("sub:"));
        tagArr.unshift(`sub:${subcategory.trim()}`);
      }
      updatePayload.tags = tagArr.join(",");
    }

    const { error: supaErr } = await supabase.from("templates").update(updatePayload).eq("id", id);
    if (supaErr) {
      return NextResponse.json({ success: false, error: supaErr.message }, { status: 400 });
    }

    // Update local SQLite as well
    try {
      const db = getDb();
      if (title || prompt) {
        db.prepare(`
          UPDATE templates 
          SET title = COALESCE(?, title),
              desc = COALESCE(?, desc),
              prompt = COALESCE(?, prompt),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(title || null, desc || null, prompt || null, id);
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Template updated successfully",
    });
  } catch (error) {
    console.error("Admin template update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
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

    await supabase.from("templates").delete().eq("id", id);

    try {
      const db = getDb();
      db.prepare("DELETE FROM templates WHERE id = ?").run(id);
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Template removed from catalog",
    });
  } catch (error) {
    console.error("Admin template delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
