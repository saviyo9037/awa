import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin templates:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch templates" },
        { status: 500 }
      );
    }

    const mapped = (data || []).map((t: any) => {
      const tagStr = t.tags || "";
      const subTag = tagStr.split(",").find((x: string) => x.startsWith("sub:"));
      const subcategory = subTag ? subTag.replace(/^sub:/, "").trim() : "";
      return {
        ...t,
        subcategory,
      };
    });

    return NextResponse.json({
      success: true,
      source: "supabase",
      count: mapped.length,
      data: mapped,
    });
  } catch (error) {
    console.error("Error fetching admin templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { title, desc, prompt, category, subcategory, tool, toolUrl, img, tags, isPro, complexity, mediaType, videoUrl, tip, steps } = body;

    title = (title && title.trim()) ? title.trim() : (desc && desc.trim() ? desc.trim().slice(0, 50) : "AI Prompt Blueprint");

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Finished Prompt Text is required" },
        { status: 400 }
      );
    }

    const categoryId = (category && CATEGORY_MAP[category]) ? CATEGORY_MAP[category] : (category || "image");
    const id = `tpl-${Date.now()}`;
    const baseSlug = (title || "blueprint")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
    
    let tagArray = Array.isArray(tags) 
      ? [...tags] 
      : typeof tags === "string" && tags.trim().length > 0
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) 
        : ["AI", "Blueprint"];

    // Prepend subcategory if provided
    if (subcategory && typeof subcategory === "string" && subcategory.trim()) {
      const cleanSub = subcategory.trim();
      tagArray = tagArray.filter((t: string) => !t.startsWith("sub:"));
      tagArray.unshift(`sub:${cleanSub}`);
    }

    if (mediaType === "video" && !tagArray.includes("Video")) {
      tagArray.push("Video");
    }
    const tagsString = tagArray.join(",");

    const finalMediaUrl = (mediaType === "video" && videoUrl) ? videoUrl : (img || "/cyber_dashboard.jpg");

    // 1. Insert into Supabase Cloud
    const supabase = getSupabaseAdmin();
    const { error: supaErr } = await supabase.from("templates").insert([
      {
        id,
        slug,
        title,
        description: desc || "High-fidelity production blueprint.",
        prompt_text: prompt,
        category_id: categoryId,
        image_url: finalMediaUrl,
        featured: Boolean(isPro),
        complexity: complexity || (isPro ? "advanced" : "intermediate"),
        tags: tagsString,
        copy_count: 0,
      },
    ]);

    if (supaErr) {
      console.error("Supabase template insert error:", supaErr);
      return NextResponse.json(
        { success: false, error: supaErr.message || "Failed to insert into Supabase database" },
        { status: 400 }
      );
    }

    // 2. Insert custom usage steps and pro tip into Supabase
    const allStepsToInsert: any[] = [];
    if (tip && typeof tip === "string" && tip.trim().length > 0) {
      allStepsToInsert.push({
        id: `step-${id}-tip`,
        template_id: id,
        step_number: 0,
        title: "Pro Tip",
        description: tip.trim(),
      });
    }

    if (Array.isArray(steps) && steps.length > 0) {
      steps.forEach((s: any, idx: number) => {
        allStepsToInsert.push({
          id: `step-${id}-${idx + 1}`,
          template_id: id,
          step_number: idx + 1,
          title: s.title || `Step 0${idx + 1}`,
          description: s.desc || s.instruction || s.description || "",
        });
      });
    }

    if (allStepsToInsert.length > 0) {
      try {
        await supabase.from("usage_steps").insert(allStepsToInsert);
      } catch (stepErr) {
        console.warn("Supabase usage_steps note:", stepErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: { id, slug, title, category_id: categoryId, mediaType, videoUrl: finalMediaUrl },
      message: `Blueprint "${title}" published successfully!`,
    });
  } catch (error: any) {
    console.error("Admin template creation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create template" },
      { status: 500 }
    );
  }
}
