import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// 1. GET: List all subscriptions with user details and overall metrics
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // Fetch all subscriptions and users in parallel
    const [subsRes, usersRes] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("users")
        .select("id, email, name, role, is_pro, subscription_plan, credits, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (subsRes.error) {
      console.error("Error fetching subscriptions:", subsRes.error);
      return NextResponse.json(
        { success: false, error: subsRes.error.message || "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    const subscriptions = subsRes.data || [];
    const users = usersRes.data || [];

    // Map user details to subscriptions
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedSubscriptions = subscriptions.map((sub) => {
      const user = userMap.get(sub.user_id) || null;
      return {
        ...sub,
        user_email: user?.email || "",
        user_name: user?.name || (user?.email ? user.email.split("@")[0] : ""),
        user_is_pro: Boolean(user?.is_pro),
        user_credits: user?.credits ?? 0,
        user,
      };
    });

    // Calculate quick metrics
    const totalCount = subscriptions.length;
    const activeCount = subscriptions.filter((s) => s.status === "active").length;
    const proUsersCount = users.filter((u) => u.is_pro).length;
    const totalRevenue = subscriptions.reduce((acc, s) => {
      const val = parseFloat(String(s.amount || "0").replace(/[^0-9.]/g, "")) || 0;
      return acc + val;
    }, 0);

    return NextResponse.json({
      success: true,
      data: enrichedSubscriptions,
      users,
      stats: {
        totalSubscriptions: totalCount,
        activeSubscriptions: activeCount,
        proUsersCount,
        totalUsers: users.length,
        totalRevenue: `₹${totalRevenue.toLocaleString("en-IN")}`,
      },
    });
  } catch (error: any) {
    console.error("Admin subscriptions GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// 2. POST: Admin manually creates or grants a subscription to a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan = "yearly", amount, status = "active", credits, paymentId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "User email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabaseAdmin();

    // 1. Locate or create user
    let { data: user } = await supabase
      .from("users")
      .select("id, email, name, is_pro, credits")
      .eq("email", cleanEmail)
      .maybeSingle();

    const isProActive = status === "active";
    const userCredits = credits !== undefined && credits !== "" ? Number(credits) : 25;

    if (!user) {
      const newUserId = `usr-${Date.now()}`;
      const { data: newUser, error: createErr } = await supabase
        .from("users")
        .insert([
          {
            id: newUserId,
            email: cleanEmail,
            name: cleanEmail.split("@")[0],
            role: "user",
            is_pro: isProActive,
            subscription_plan: plan,
            credits: userCredits,
          },
        ])
        .select("id, email, name, is_pro, credits")
        .single();

      if (createErr || !newUser) {
        return NextResponse.json(
          { success: false, error: createErr?.message || "Failed to create user record" },
          { status: 500 }
        );
      }
      user = newUser;
    } else {
      // Update existing user pro status and plan
      const updateData: any = {
        is_pro: isProActive,
        subscription_plan: plan,
      };
      if (credits !== undefined && credits !== "") {
        updateData.credits = Number(credits);
      }
      await supabase.from("users").update(updateData).eq("id", user.id);
    }

    // 2. Insert subscription record
    const subId = `sub-${Date.now()}`;
    const priceFormatted = amount ? String(amount).trim() : (plan === "lifetime" ? "₹999" : plan === "yearly" ? "₹199" : "₹0");
    const payRef = paymentId ? String(paymentId).trim() : null;

    const { data: newSub, error: subErr } = await supabase
      .from("subscriptions")
      .insert([
        {
          id: subId,
          user_id: user.id,
          plan,
          amount: priceFormatted,
          status,
          payment_id: payRef,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (subErr) {
      console.error("Subscription insert error:", subErr);
      return NextResponse.json(
        { success: false, error: subErr.message || "Failed to create subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newSub,
        user_email: cleanEmail,
        user_name: user.name,
        user_is_pro: isProActive,
        user_credits: userCredits,
      },
      message: `Subscription granted to ${cleanEmail} successfully!`,
    });
  } catch (error: any) {
    console.error("Admin subscriptions POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// 3. PATCH: Admin edits/updates an existing subscription and syncs user pro status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, plan, amount, status, credits, is_pro, payment_id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check existing subscription
    const { data: existingSub, error: findErr } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (findErr || !existingSub) {
      return NextResponse.json(
        { success: false, error: "Subscription record not found" },
        { status: 404 }
      );
    }

    // Build update object for subscription
    const subUpdates: any = {
      updated_at: new Date().toISOString(),
    };
    if (plan !== undefined) subUpdates.plan = plan;
    if (amount !== undefined) subUpdates.amount = amount;
    if (status !== undefined) subUpdates.status = status;
    if (payment_id !== undefined) subUpdates.payment_id = payment_id;

    const { data: updatedSub, error: updateErr } = await supabase
      .from("subscriptions")
      .update(subUpdates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json(
        { success: false, error: updateErr.message || "Failed to update subscription" },
        { status: 500 }
      );
    }

    // Sync user state
    if (existingSub.user_id) {
      const userUpdates: any = {};
      
      // Determine is_pro: explicit boolean if provided, else true if status is 'active'
      if (typeof is_pro === "boolean") {
        userUpdates.is_pro = is_pro;
      } else if (status !== undefined) {
        userUpdates.is_pro = status === "active";
      }

      if (plan !== undefined) {
        userUpdates.subscription_plan = plan;
      }

      if (credits !== undefined && credits !== "") {
        userUpdates.credits = Number(credits);
      }

      if (Object.keys(userUpdates).length > 0) {
        await supabase
          .from("users")
          .update(userUpdates)
          .eq("id", existingSub.user_id);
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedSub,
      message: "Subscription updated successfully!",
    });
  } catch (error: any) {
    console.error("Admin subscriptions PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// 4. DELETE: Admin cancels / removes a subscription and updates user status
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Find the subscription first to get user_id
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("id", id)
      .single();

    const { error: delErr } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (delErr) {
      return NextResponse.json(
        { success: false, error: delErr.message || "Failed to delete subscription" },
        { status: 500 }
      );
    }

    // If user has no more active subscriptions, revert user's is_pro to false
    if (sub?.user_id) {
      const { data: remainingSubs } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", sub.user_id)
        .eq("status", "active");

      if (!remainingSubs || remainingSubs.length === 0) {
        await supabase
          .from("users")
          .update({ is_pro: false, subscription_plan: "free" })
          .eq("id", sub.user_id);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscription removed and user plan updated!",
    });
  } catch (error: any) {
    console.error("Admin subscriptions DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
