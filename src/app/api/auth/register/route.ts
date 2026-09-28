import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createOrGetUser } from "@/lib/db";
import crypto from "node:crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);
    const userId = `usr-${Date.now()}`;
    const userName = name?.trim() || cleanEmail.split("@")[0];

    // 1. Check if user already exists in Supabase
    const supabase = getSupabaseAdmin();
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    // 2. Insert new user into Supabase Cloud
    const { error: supaErr } = await supabase.from("users").insert([
      {
        id: userId,
        email: cleanEmail,
        name: userName,
        role: "user",
        is_pro: false,
        credits: 10,
        subscription_plan: "free",
        password_hash: hashedPassword,
      },
    ]);

    if (supaErr) {
      console.error("Supabase user registration error:", supaErr.message);
      return NextResponse.json(
        { success: false, error: "Registration failed on cloud database" },
        { status: 500 }
      );
    }

    // 3. Sync to local SQLite for redundancy
    try {
      createOrGetUser(cleanEmail, userName, hashedPassword);
    } catch {}

    const response = NextResponse.json({
      success: true,
      data: {
        id: userId,
        email: cleanEmail,
        name: userName,
        role: "user",
        isPro: false,
        credits: 10,
        subscriptionPlan: "free",
      },
      message: "Account created successfully!",
    });

    // Set auth cookie
    response.cookies.set("awa_session", JSON.stringify({ id: userId, email: cleanEmail, role: "user" }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Registration route error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
