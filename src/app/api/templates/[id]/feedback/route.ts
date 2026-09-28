import { NextRequest, NextResponse } from "next/server";
import { addFeedback } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rating, comment, toolUsed, userId } = body;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    const feedbackId = `fb-${Date.now()}`;

    // 1. Write to Supabase Cloud
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("feedback").insert([
        {
          id: feedbackId,
          template_id: id,
          user_id: userId || "usr-anon",
          rating,
          comment: comment || "",
          tool_used: toolUsed || "Midjourney v6.1",
        },
      ]);
    } catch (supaErr) {
      console.warn("Supabase feedback insert warning:", supaErr);
    }

    // 2. Write to local SQLite for redundancy
    const result = addFeedback({
      templateId: id,
      userId,
      rating,
      comment,
      toolUsed,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
