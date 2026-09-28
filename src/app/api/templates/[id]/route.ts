import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Check if requester has active PRO access
    const sessionCookie = request.cookies.get("awa_session")?.value;
    let isUserPro = false;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        if (parsed.is_pro || parsed.role === "admin" || parsed.role === "pro_subscriber") {
          isUserPro = true;
        } else if (parsed.id || parsed.email) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("is_pro, role")
            .or(`id.eq.${parsed.id || ""},email.eq.${parsed.email || ""}`)
            .maybeSingle();
          if (dbUser && (dbUser.is_pro || dbUser.role === "admin" || dbUser.role === "pro_subscriber")) {
            isUserPro = true;
          }
        }
      } catch {}
    }

    // Query Supabase template
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Template blueprint not found in database" },
        { status: 404 }
      );
    }

    const isPro = Boolean(data.featured || data.complexity === "advanced");

    // Fetch usage steps & pro tip from Supabase
    const { data: stepsData } = await supabase
      .from("usage_steps")
      .select("*")
      .eq("template_id", data.id)
      .order("step_number", { ascending: true });

    const tipStep = stepsData?.find((s: any) => s.step_number === 0 || s.title?.toLowerCase().includes("tip"));
    const actualSteps = stepsData?.filter((s: any) => s.step_number > 0 && !s.title?.toLowerCase().includes("tip"));

    // Fetch category info if available
    let categorySlug = data.category_id;
    if (data.category_id) {
      const { data: cat } = await supabase
        .from("categories")
        .select("slug, name")
        .eq("id", data.category_id)
        .maybeSingle();
      if (cat?.slug) {
        categorySlug = cat.slug;
      }
    }

    const isVideo = Boolean(
      data.image_url?.endsWith(".mp4") ||
      data.image_url?.endsWith(".webm") ||
      data.description?.toLowerCase().includes("video") ||
      data.title?.toLowerCase().includes("video")
    );

    const rawTags = typeof data.tags === "string" ? data.tags.split(",").map((t: string) => t.trim()) : data.tags || [];
    const subTag = rawTags.find((t: string) => t.startsWith("sub:"));
    const subcategory = subTag ? subTag.replace(/^sub:/, "").trim() : (data.subcategory || null);
    const cleanTags = rawTags.filter((t: string) => !t.startsWith("sub:"));

    const formatted = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      desc: data.description,
      prompt: (isPro && !isUserPro) ? "🔒 PRO Blueprint Locked — Unlock with AWA Pro" : data.prompt_text,
      img: data.image_url,
      videoUrl: isVideo ? data.image_url : null,
      mediaType: isVideo ? "video" : "image",
      tip: tipStep?.description || null,
      isPro,
      tags: cleanTags,
      subcategory,
      category: categorySlug,
      category_id: data.category_id,
      views: data.copy_count || 0,
      copies: data.copy_count || 0,
      steps: actualSteps && actualSteps.length > 0 ? actualSteps : null,
    };

    // Increment view / copy count in Supabase Cloud
    try {
      await supabase
        .from("templates")
        .update({ copy_count: (data.copy_count || 0) + 1 })
        .eq("id", data.id);
    } catch {}

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching template details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}
