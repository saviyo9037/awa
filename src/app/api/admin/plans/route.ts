import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// 1. GET: Fetch all subscription plans for admin
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching plans:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: plans || [],
    });
  } catch (error: any) {
    console.error("Admin plans GET error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch plans" }, { status: 500 });
  }
}

// 2. POST: Create a new subscription plan (No user email! This is the plan definition)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      price,
      original_price,
      currency = "INR",
      interval = "year",
      description = "",
      features = [],
      badge = null,
      is_popular = false,
      is_active = true,
      sort_order = 1,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: "Plan name and price are required" },
        { status: 400 }
      );
    }

    const planSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();
    const planId = `plan-${planSlug}-${Date.now()}`;
    const formattedPrice = String(price).startsWith("₹") ? String(price) : `₹${price}`;

    const parsedFeatures = Array.isArray(features)
      ? features
      : typeof features === "string"
      ? features.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];

    const supabase = getSupabaseAdmin();
    const { data: newPlan, error } = await supabase
      .from("subscription_plans")
      .insert([
        {
          id: planId,
          name: name.trim(),
          slug: planSlug,
          price: formattedPrice,
          original_price: original_price ? (String(original_price).startsWith("₹") ? original_price : `₹${original_price}`) : null,
          currency,
          interval,
          description: description?.trim() || "",
          features: parsedFeatures,
          badge: badge?.trim() || null,
          is_popular: Boolean(is_popular),
          is_active: is_active !== false,
          sort_order: Number(sort_order) || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating plan:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: newPlan,
      message: `Plan "${name}" created successfully!`,
    });
  } catch (error: any) {
    console.error("Admin plans POST error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create plan" }, { status: 500 });
  }
}

// 3. PATCH: Update an existing subscription plan
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, price, original_price, interval, description, features, badge, is_popular, is_active, sort_order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Plan ID is required" }, { status: 400 });
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name.trim();
    if (slug !== undefined) updates.slug = slug.trim().toLowerCase();
    if (price !== undefined) {
      updates.price = String(price).startsWith("₹") ? String(price) : `₹${price}`;
    }
    if (original_price !== undefined) {
      updates.original_price = original_price ? (String(original_price).startsWith("₹") ? original_price : `₹${original_price}`) : null;
    }
    if (interval !== undefined) updates.interval = interval;
    if (description !== undefined) updates.description = description.trim();
    if (features !== undefined) {
      updates.features = Array.isArray(features)
        ? features
        : typeof features === "string"
        ? features.split("\n").map((f: string) => f.trim()).filter(Boolean)
        : [];
    }
    if (badge !== undefined) updates.badge = badge ? badge.trim() : null;
    if (is_popular !== undefined) updates.is_popular = Boolean(is_popular);
    if (is_active !== undefined) updates.is_active = Boolean(is_active);
    if (sort_order !== undefined) updates.sort_order = Number(sort_order);

    const supabase = getSupabaseAdmin();
    const { data: updatedPlan, error } = await supabase
      .from("subscription_plans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating plan:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedPlan,
      message: "Subscription plan updated successfully!",
    });
  } catch (error: any) {
    console.error("Admin plans PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update plan" }, { status: 500 });
  }
}

// 4. DELETE: Delete a subscription plan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Plan ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("subscription_plans").delete().eq("id", id);

    if (error) {
      console.error("Error deleting plan:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription plan deleted successfully!",
    });
  } catch (error: any) {
    console.error("Admin plans DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete plan" }, { status: 500 });
  }
}
