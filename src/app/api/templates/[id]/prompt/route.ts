import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Query template strictly from Supabase
    const { data: template, error } = await supabase
      .from("templates")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (error || !template) {
      return NextResponse.json(
        { success: false, error: "Template not found in database" },
        { status: 404 }
      );
    }

    const isPro = Boolean(template.featured || template.complexity === "advanced");

    // Verify authenticated user from session cookie using Supabase
    const sessionCookie = request.cookies.get("awa_session")?.value;
    let isUserPro = false;

    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        let { data: user } = await supabase
          .from("users")
          .select("id, role, is_pro")
          .eq("id", parsed.id)
          .maybeSingle();

        if (!user && parsed.email) {
          const res = await supabase
            .from("users")
            .select("id, role, is_pro")
            .eq("email", parsed.email.toLowerCase().trim())
            .maybeSingle();
          user = res.data;
        }

        if (user && (user.is_pro || user.role === "admin" || user.role === "pro_subscriber")) {
          isUserPro = true;
        }
      } catch (e) {
        console.warn("Session check in prompt route error:", e);
      }
    }

    // If template is PRO and user is NOT PRO: deny access
    if (isPro && !isUserPro) {
      return NextResponse.json({
        success: true,
        isPro: true,
        unlocked: false,
        prompt: null,
        message: "This prompt is exclusive to AWA PRO members. Please sign in with an active subscription.",
      });
    }

    return NextResponse.json({
      success: true,
      isPro,
      unlocked: true,
      prompt: template.prompt_text,
    });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}
