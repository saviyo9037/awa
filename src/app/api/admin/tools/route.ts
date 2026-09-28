import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("ai_tools")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching AI tools:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch tools" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error("Error fetching AI tools:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tools" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, website_url, description } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Tool name is required" }, { status: 400 });
    }

    const id = `tool-${Date.now()}`;
    const supabase = getSupabaseAdmin();

    const { error: insertErr } = await supabase.from("ai_tools").insert([
      {
        id,
        name,
        category: category || "image",
        website_url: website_url || "https://ai.example.com",
        description: description || "",
      },
    ]);

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message || "Failed to insert tool" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: { id, name },
      message: `Tool "${name}" registered in master list`,
    });
  } catch (error) {
    console.error("Error creating AI tool:", error);
    return NextResponse.json({ success: false, error: "Failed to create tool" }, { status: 500 });
  }
}
