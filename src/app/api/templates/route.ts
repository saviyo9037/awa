import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const subcategoryParam = searchParams.get("subcategory") || undefined;
    const search = searchParams.get("search") || undefined;
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    const supabase = getSupabaseAdmin();

    // Check if requester is logged in as PRO
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

    // Fetch categories for accurate ID/Slug resolution
    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug, name");

    const catSlugMap: Record<string, { slug: string; name: string; id: string }> = {};
    const catByIdMap: Record<string, { slug: string; name: string; id: string }> = {};

    if (categories) {
      for (const c of categories) {
        catSlugMap[c.slug] = c;
        catByIdMap[c.id] = c;
      }
    }

    // Build template query
    let query = supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      const matchedCat = catSlugMap[category] || catByIdMap[category];
      if (matchedCat) {
        query = query.or(`category_id.eq.${matchedCat.id},category_id.eq.${matchedCat.slug}`);
      } else {
        query = query.eq("category_id", category);
      }
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%`);
    }

    if (limit) {
      const from = offset || 0;
      query = query.range(from, from + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase templates query error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to query database templates" },
        { status: 500 }
      );
    }

    const templates = data || [];

    const formatted = templates
      .map((t) => {
        const isPro = Boolean(t.featured || t.complexity === "advanced");
        const resolvedCat = catByIdMap[t.category_id] || catSlugMap[t.category_id];

        const isVideo = Boolean(
          t.image_url?.endsWith(".mp4") ||
          t.image_url?.endsWith(".webm") ||
          t.description?.toLowerCase().includes("video") ||
          t.title?.toLowerCase().includes("video")
        );

        const rawTags = typeof t.tags === "string" ? t.tags.split(",").map((s: string) => s.trim()) : (Array.isArray(t.tags) ? t.tags : []);
        const subTag = rawTags.find((s: string) => s.startsWith("sub:"));
        const subcategory = subTag ? subTag.replace(/^sub:/, "").trim() : "";
        const cleanTags = rawTags.filter((s: string) => !s.startsWith("sub:"));

        return {
          id: t.id,
          slug: t.slug,
          title: t.title,
          desc: t.description,
          prompt: (isPro && !isUserPro) ? "🔒 PRO Blueprint Locked — Unlock with AWA Pro" : t.prompt_text,
          img: t.image_url,
          videoUrl: isVideo ? t.image_url : null,
          mediaType: isVideo ? "video" : "image",
          isPro,
          tags: cleanTags,
          subcategory,
          category: resolvedCat?.slug || t.category_id,
          category_id: t.category_id,
          category_name: resolvedCat?.name || t.category_id,
          views: t.copy_count || 0,
          copies: t.copy_count || 0,
          copy_count: t.copy_count || 0,
        };
      })
      .filter((t) => {
        if (!subcategoryParam || subcategoryParam === "all") return true;
        return t.subcategory?.toLowerCase() === subcategoryParam.toLowerCase() ||
          t.tags.some((tag: string) => tag.toLowerCase() === subcategoryParam.toLowerCase());
      });

    return NextResponse.json({
      success: true,
      source: "supabase",
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
