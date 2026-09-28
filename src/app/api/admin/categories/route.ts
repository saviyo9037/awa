import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch categories" },
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
    console.error("Error fetching admin categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, sort_order } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = `cat-${Date.now()}`;
    const sortOrder = typeof sort_order === "number" ? sort_order : 10;

    // Write to Supabase Cloud
    const supabase = getSupabaseAdmin();
    const { error: insertErr } = await supabase.from("categories").insert([
      {
        id,
        name,
        slug: finalSlug,
        description: description || "",
        icon: icon || "Layout",
        sort_order: sortOrder,
      },
    ]);

    if (insertErr) {
      return NextResponse.json(
        { success: false, error: insertErr.message || "Failed to insert category" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id, name, slug: finalSlug },
      message: `Category "${name}" created successfully`,
    });
  } catch (error) {
    console.error("Admin category creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
